'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StarRatingInput } from './StarRatingInput';
import { createResena, updateResena, CreateResenaData } from '@/api/services/ReviewService';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  productoId: string;
  onReviewSaved: () => void;
  editData?: {
    resenaId: string;
    calificacion: number;
    titulo: string;
    comentario: string;
  };
}

export const ReviewForm = ({ isOpen, onClose, productoId, onReviewSaved, editData }: ReviewFormProps) => {
  const [calificacion, setCalificacion] = useState(editData?.calificacion || 0);
  const [titulo, setTitulo] = useState(editData?.titulo || '');
  const [comentario, setComentario] = useState(editData?.comentario || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (calificacion === 0) {
      setError('Selecciona una calificación');
      return;
    }
    if (!titulo.trim()) {
      setError('El título es requerido');
      return;
    }
    if (!comentario.trim()) {
      setError('El comentario es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateResenaData = {
        calificacion,
        titulo: titulo.trim(),
        comentario: comentario.trim(),
      };

      if (isEditing) {
        await updateResena(editData.resenaId, data);
      } else {
        await createResena(productoId, data);
      }

      setCalificacion(0);
      setTitulo('');
      setComentario('');
      onReviewSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCalificacion(editData?.calificacion || 0);
    setTitulo(editData?.titulo || '');
    setComentario(editData?.comentario || '');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Reseña' : 'Escribir Reseña'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica tu opinión sobre este producto.' : 'Comparte tu opinión sobre este producto.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Calificación</label>
            <StarRatingInput rating={calificacion} onRatingChange={setCalificacion} disabled={isSubmitting} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Resumen de tu opinión"
              maxLength={100}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuéntanos tu experiencia con este producto..."
              rows={4}
              maxLength={500}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{comentario.length}/500</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                isEditing ? 'Guardar Cambios' : 'Publicar Reseña'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
