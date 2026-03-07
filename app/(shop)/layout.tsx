import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { FadeUpTrigger } from "@/components/shop/FadeUpTrigger";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <FadeUpTrigger>{children}</FadeUpTrigger>
      <Footer />
    </>
  );
}