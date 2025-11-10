'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductoById } from '@/api/services/CatalogService';
import { Producto } from '@/interfaces/services/Products';
import useCart from '@/hooks/cart/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, ShoppingCart, ArrowLeft,CheckCircle2, MessageCircle} from 'lucide-react';
import { ProductGallery } from './ProductGallery';
import { StarRating } from './StarRating';
import { QuantitySelector } from './QuantitySelector';

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