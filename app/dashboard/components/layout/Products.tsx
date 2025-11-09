'use client'
import { getProductos } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Producto } from "@/interfaces/services/Products";
import { AlertCircle, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import Image from 'next/image';

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      {productos.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay productos disponibles para comprar en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <Card
              key={producto.id}
              className="flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                {producto.imagen_url ? (
                  <Image
                    src={producto.imagen_url}
                    width={500}
                    height={300}
                    alt={producto.nombre}
                    className="object-cover w-full h-full"/>
                ) : (
                  <div className="text-gray-400 text-sm">Sin imagen</div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{producto.nombre}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow">
                <p className="text-gray-600 mb-2 h-16 overflow-y-auto">
                  {producto.descripcion || "Producto sin descripción."}
                </p>
                <p className="text-sm text-green-600 font-medium mb-4">
                  {producto.stock} en stock
                </p>

                <div className="text-right mt-auto">
                  <p className="text-xs text-gray-500">Precio</p>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    ${producto.precio.toFixed(2)}
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Comprar
                    <Package className="w-4 h-4 ml-2" />
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