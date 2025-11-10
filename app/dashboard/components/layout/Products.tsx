'use client'
import { getProductos } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Producto } from "@/interfaces/services/Products";
import { AlertCircle, Loader2, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Image from 'next/image';
import useCart from "@/hooks/cart/useCart";
import Link from "next/link";

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        const data = await getProductos();
        setProductos(data.filter(p => p.activo && p.stock > 0));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        setIsLoading(false);
      }
    };
    cargarProductos()
  }, []);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="ml-3 text-lg text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">¡Error!</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Comprar Productos
      </h1>
      {productos.length === 0 && !isLoading ? (
        <p className="text-gray-500 text-center py-4">
          No hay productos disponibles para comprar en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <Card key={producto.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <Link href={`/dashboard/products/${producto.id}`} passHref>
                <CardHeader className="p-0">
                  <div className="w-full h-48 rounded-t-lg bg-gray-100 flex items-center justify-center">
                    {producto.imagen_url ? (
                      <Image
                        src={producto.imagen_url} 
                        alt={producto.nombre}
                        width={120}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div className="p-6">
                    <CardTitle className="text-xl hover:text-orange-600 transition-colors">
                      {producto.nombre}
                    </CardTitle>
                  </div>
                </CardHeader>
              </Link>
              <CardContent className="p-4 pt-0 flex flex-col flex-grow">
                <p className="text-gray-600 mb-2 flex-grow min-h-[3.5rem]">
                  {producto.descripcion || 'Producto sin descripción.'}
                </p>
                <p className="text-sm text-green-600 font-medium mb-2">
                  {producto.stock} en stock
                </p>
                <div className="text-right mt-auto">
                  <p className="text-xs text-gray-500">Precio</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">
                    ${producto.precio.toFixed(2)}
                  </p>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => addToCart(producto,1)}
                  >
                    Añadir al Carrito
                    <ShoppingCart className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default Productos;