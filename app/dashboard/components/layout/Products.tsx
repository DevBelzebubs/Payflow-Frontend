'use client'
import { getProductos } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Producto } from "@/interfaces/services/Products";
import { AlertCircle, Loader2, Package, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Image from 'next/image';
import useCart from "@/hooks/cart/useCart";
import Link from "next/link";

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("")
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
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()));
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="ml-3 text-lg text-muted-foreground">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 border border-destructive/30 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">¡Error!</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Comprar Productos
      </h1>
      <div className="relative w-full md:w-72 mb-5">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          name="search"
          type="text"
          placeholder="Buscar Producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>
      {productosFiltrados.length === 0 && !isLoading ? (
        <p className="text-muted-foreground text-center py-4">
          No hay productos disponibles para comprar en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className="bg-card border flex flex-col justify-between hover:shadow-lg transition-shadow">
              <Link href={`/dashboard/products/${producto.id}`} passHref>
                <CardHeader className="p-0">
                  <div className="w-full h-48 rounded-t-lg bg-secondary flex items-center justify-center">
                    {producto.imagen_url ? (
                      <Image
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        width={120}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="p-6">
                    <CardTitle className="text-xl text-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      {producto.nombre}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col flex-grow">
                  <p className="text-muted-foreground mb-2 flex-grow min-h-[3.5rem]">
                    {producto.descripcion || 'Producto sin descripción.'}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                    {producto.stock} en stock
                  </p>
                  <div className="text-right mt-auto">
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="text-xl font-bold text-foreground mb-3">
                      ${producto.precio.toFixed(2)}
                    </p>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => addToCart(producto, 1)}
                    >
                      Añadir al Carrito
                      <ShoppingCart className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default Productos;