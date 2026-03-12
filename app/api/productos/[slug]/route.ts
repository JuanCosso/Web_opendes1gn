import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { name, description, price, comparePrice, sku, stock,
            categoryId, images, variants, published, featured } = body;

    const newSlug = name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const product = await prisma.product.update({
      where: { slug },
      data: {
        name,
        slug: newSlug,
        description: description || null,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku: sku || null,
        stock: parseInt(stock) || 0,
        categoryId: categoryId || null,
        published: published ?? false,
        featured: featured ?? false,
        images: {
          deleteMany: {},
          create: images?.map((img: { url: string; alt: string }, i: number) => ({
            url: img.url,
            alt: img.alt || "",
            position: i,
          })) || [],
        },
        variants: {
          deleteMany: {},
          create: variants?.map((v: {
            size: string; color: string;
            stock: number; price: string; sku: string
          }) => ({
            size: v.size || null,
            color: v.color || null,
            stock: v.stock || 0,
            price: v.price ? parseFloat(v.price) : null,
            sku: v.sku || null,
          })) || [],
        },
      },
      include: { images: true, variants: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Buscar el producto y ver si tiene órdenes asociadas
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        _count: { select: { orderItems: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (product._count.orderItems > 0) {
      // Tiene órdenes → solo despublicar (soft delete)
      await prisma.product.update({
        where: { slug },
        data: { published: false, featured: false },
      });
      return NextResponse.json({
        ok: true,
        softDeleted: true,
        message: "El producto tiene pedidos asociados y fue despublicado en lugar de eliminado.",
      });
    }

    // Sin órdenes → eliminar físicamente
    await prisma.product.delete({ where: { slug } });
    return NextResponse.json({ ok: true, softDeleted: false });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}