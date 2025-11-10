'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductoById } from '@/api/services/CatalogService';
import { Producto } from '@/interfaces/services/Products';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Loader2, AlertCircle, ShoppingCart, Package, ArrowLeft,
  ChevronDown, ChevronUp, CheckCircle2, Star, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImagenProducto } from '@/interfaces/Review/ImagenProducto';
import useCart from '@/hooks/cart/useCart';

const ProductGallery = ({ principal, imagenes }: { principal?: string | null, imagenes?: ImagenProducto[] }) => {
  
  const allImages = [...(principal ? [{ id: 'main', url_imagen: principal, orden: -1 }] : []), ...(imagenes || []).filter(img => img.url_imagen !== principal)
  ].sort((a, b) => a.orden - b.orden);

  const [selectedImage, setSelectedImage] = useState(allImages[0]?.url_imagen || null);

  useEffect(() => {
    setSelectedImage(allImages[0]?.url_imagen || null);
  }, [principal, imagenes]);

  if (allImages.length === 0) {
    return (
      <div className="w-full min-h-[450px] bg-gray-100 flex items-center justify-center rounded-lg">
        <Package className="w-24 h-24 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 4. Imagen Principal Seleccionada */}
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
        <img
          src={selectedImage || ''}
          alt="Vista principal del producto"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {/* 5. Iterador de Thumbnails (solo si hay más de 1 imagen) */}
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.url_imagen)}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200",
                // Resalta el thumbnail seleccionado
                selectedImage === img.url_imagen 
                  ? "border-orange-500 opacity-100" 
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
              )}
            >
              <img src={img.url_imagen} alt="Vista miniatura" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const StarRating = ({ rating, totalReviews, showTotal = true }: { rating: number, totalReviews: number, showTotal?: boolean }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 fill-current" />)}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />)}
      </div>
      {showTotal && (
        <span className="text-sm text-gray-500">({totalReviews} reseñas)</span>
      )}
    </div>
  );
};

const QuantitySelector = ({ stock, quantity, setQuantity }: { stock: number, quantity: number, setQuantity: (q: number) => void }) => {
  const handleSet = (newQuantity: number) => {
    const boundedQuantity = Math.max(1, Math.min(newQuantity, stock));
    setQuantity(boundedQuantity);
  };

  return (
    <div className="flex items-center border rounded-lg">
      <Button variant="ghost" size="icon" className="h-full rounded-r-none" onClick={() => handleSet(quantity - 1)} disabled={stock === 0 || quantity <= 1}>
        <ChevronDown className="w-5 h-5" />
      </Button>
      <span className="w-14 text-center text-lg font-medium">{quantity}</span>
      <Button variant="ghost" size="icon" className="h-full rounded-l-none" onClick={() => handleSet(quantity + 1)} disabled={stock === 0 || quantity >= stock}>
        <ChevronUp className="w-5 h-5" />
      </Button>
    </div>
  );
};

const ProductDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  
  const { addToCart } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true); setError(null);
          const data = await getProductoById(id);
          setProducto(data);
          if (data.stock === 0) setQuantity(0);
        } catch (err) {
          setError('Producto no encontrado o no disponible.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!producto || quantity === 0) return;
    addToCart(producto, quantity);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="ml-4 text-lg text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-xl font-semibold text-red-700">{error || 'Producto no encontrado'}</p>
        <Button asChild variant="link" className="text-orange-600 mt-2">
          <Link href="/dashboard/products"><ArrowLeft className="w-4 h-4 mr-2" />Volver a todos los productos</Link>
        </Button>
      </div>
    );
  }

  const isOutOfStock = producto.stock === 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 px-0">
          <Link href="/dashboard/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Productos
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        <div className="lg:col-span-3">
          <ProductGallery principal={producto.imagen_url} imagenes={producto.imagenes} />
        </div>
        
        <div className="lg:col-span-2">
          <span className="text-sm text-orange-600 font-medium">{producto.marca || producto.categoria}</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-1 mb-2">{producto.nombre}</h1>
          
          <StarRating rating={producto.rating_promedio || 0} totalReviews={producto.total_reseñas || 0} />
          
          <p className="text-4xl font-bold text-orange-600 mb-6">
            ${producto.precio.toFixed(2)}
          </p>
          
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            {producto.descripcion || "Este producto no tiene una descripción detallada."}
          </p>

          {isOutOfStock ? (
            <span className="flex items-center text-red-500 font-medium mb-6">
              <AlertCircle className="w-5 h-5 mr-2" />Agotado
            </span>
          ) : (
            <span className="flex items-center text-green-600 font-medium mb-6">
              <CheckCircle2 className="w-5 h-5 mr-2" />{producto.stock} disponibles
            </span>
          )}
          
          <div className="flex items-stretch gap-4 mb-4">
            <QuantitySelector stock={producto.stock || 0} quantity={quantity} setQuantity={setQuantity} />
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-lg py-6" onClick={handleAddToCart} disabled={isOutOfStock}>
              <ShoppingCart className="w-5 h-5 mr-3" />
              {isOutOfStock ? 'Sin Stock' : 'Añadir al Carrito'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Producto</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            
            {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 && (
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-4">Especificaciones</h3>
                <ul className="space-y-2">
                  {Object.entries(producto.especificaciones).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-md">
                      <span className="font-medium text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900 text-right">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="py-6">
              <h3 className="text-lg font-semibold mb-4">Reseñas de Clientes ({producto.total_reseñas || 0})</h3>
              {(!producto.reseñas || producto.reseñas.length === 0) ? (
                <div className="text-center text-gray-500 py-6">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  Este producto aún no tiene reseñas.
                </div>
              ) : (
                <div className="space-y-6">
                  {producto.reseñas.map((review) => (
                    <div key={review.id} className="flex gap-4 border-b pb-6 last:border-b-0">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-semibold flex items-center justify-center flex-shrink-0">
                        {review.nombre_cliente.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <StarRating rating={review.calificacion} totalReviews={0} showTotal={false} />
                        </div>
                        <h4 className="font-semibold text-gray-900">{review.titulo}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          Por {review.nombre_cliente} el {new Date(review.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">{review.comentario}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;