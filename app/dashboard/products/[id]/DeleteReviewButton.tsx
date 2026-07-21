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
import { deleteResena } from '@/api/services/ReviewService';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteReviewButtonProps {
  resenaId: string;
  onReviewDeleted: () => void;
}

export const DeleteReviewButton = ({ resenaId, onReviewDeleted }: DeleteReviewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteResena(resenaId);
      setIsOpen(false);
      onReviewDeleted();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-destructive transition-colors"
        title="Eliminar reseña"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Reseña</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
