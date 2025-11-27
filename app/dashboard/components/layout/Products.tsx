'use client'
import { getProductos } from "@/api/services/CatalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Producto } from "@/interfaces/services/Products";
import { 
  AlertCircle, 
  Loader2, 
  Package, 
  Search, 
  ShoppingCart, 
  Check,
  FilterX
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from 'next/image';
import useCart from "@/hooks/cart/useCart";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (e: React.MouseEvent, producto: Producto) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(producto, 1);
    toast.success(`Agregado al carrito: ${producto.nombre}`, {
      description: "Puedes ver tu pedido en el carrito de compras.",
      icon: <Check className="w-4 h-4 text-green-500" />,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
          <Loader2 className="relative w-12 h-12 text-orange-500 animate-spin" />
        </div>
        <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="bg-destructive/10 p-6 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Hubo un problema</h3>
        <p className="text-muted-foreground mt-2 text-center max-w-md">{error}</p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground mt-1">Explora nuestra selección exclusiva</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            name="search"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <FilterX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No se encontraron productos</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Intenta ajustar tu búsqueda o explora otras categorías.
          </p>
          {search && (
            <Button 
              variant="link" 
              className="text-orange-600 mt-2"
              onClick={() => setSearch("")}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {productosFiltrados.map((producto, index) => (
              <motion.div
                key={producto.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/dashboard/products/${producto.id}`} className="block h-full group">
                  <Card className="h-full flex flex-col overflow-hidden border-border/60 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 bg-card">
                    
                    <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden bg-secondary/30">
                      {producto.stock < 5 && (
                        <Badge variant="destructive" className="absolute top-3 right-3 z-10 shadow-sm">
                          ¡Últimas unidades!
                        </Badge>
                      )}
                      
                      {producto.imagen_url ? (
                        <Image
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <Package className="w-16 h-16" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </CardHeader>

                    <CardContent className="flex-grow p-5">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <CardTitle className="text-lg font-bold leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {producto.nombre}
                        </CardTitle>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {producto.descripcion || 'Sin descripción disponible para este producto.'}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <Badge variant="secondary" className="font-normal bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                          Stock: {producto.stock}
                        </Badge>
                        {producto.marca && (
                          <Badge variant="outline" className="font-normal text-muted-foreground">
                            {producto.marca}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/50 bg-muted/20">
                      <div className="flex flex-col py-3">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Precio</span>
                        <span className="text-xl font-bold text-foreground">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                      </div>
                      
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
                        onClick={(e) => handleAddToCart(e, producto)}
                        title="Añadir al carrito"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default Productos;