import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(categoria && { category: { slug: categoria } }),
      ...(featured === "true" && { featured: true }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, price, comparePrice, sku, stock, categoryId, images, variants } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice,
        sku,
        stock,
        categoryId,
        images: {
          create: images?.map((img: { url: string; alt: string }, i: number) => ({
            url: img.url,
            alt: img.alt,
            position: i,
          })) || [],
        },
        variants: {
          create: variants?.map((v: { size: string; color: string; stock: number; price: string; sku: string }) => ({
            size: v.size || null,
            color: v.color || null,
            stock: v.stock || 0,
            price: v.price ? parseFloat(v.price) : null,
            sku: v.sku || null,
          })) || [],
        },
        published: body.published ?? false,
        featured: body.featured ?? false,
      },
      include: { images: true, variants: true },
    });

    revalidatePath("/productos");
    revalidatePath("/");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}