import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Moda con identidad. Envíos a todo el país.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest">Tienda</h4>
          <ul className="space-y-2">
            <li><Link href="/productos" className="text-sm text-gray-500 hover:text-black">Todos los productos</Link></li>
            <li><Link href="/productos?categoria=novedades" className="text-sm text-gray-500 hover:text-black">Novedades</Link></li>
            <li><Link href="/productos?categoria=ofertas" className="text-sm text-gray-500 hover:text-black">Ofertas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest">Ayuda</h4>
          <ul className="space-y-2">
            <li><Link href="/envios" className="text-sm text-gray-500 hover:text-black">Envíos</Link></li>
            <li><Link href="/cambios" className="text-sm text-gray-500 hover:text-black">Cambios y devoluciones</Link></li>
            <li><Link href="/contacto" className="text-sm text-gray-500 hover:text-black">Contacto</Link></li>
          </ul>
        </div>

      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} Opendes1gn. Todos los derechos reservados.
      </div>
    </footer>
  );
}