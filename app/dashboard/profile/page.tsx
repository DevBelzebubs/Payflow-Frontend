'use client'

import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  User,
  CreditCard,
  Shield,
  Camera,
  LogOut,
  Mail,
  Phone,
  Building2,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { updateUserProfile, UpdateProfileDTO } from '@/api/services/UserService';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, logout, syncUser, setUser } = useAuth() as any;

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        telefono: user.telefono || '',
        email: user.email || ''
      });
      if (user.banner_url) {
        setBannerUrl(user.banner_url);
      }
    }
  }, [user]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [bannerUrl, setBannerUrl] = useState(
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  );

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64Image = await convertToBase64(file);

      const updateData: UpdateProfileDTO = {
        [type === 'banner' ? 'banner_url' : 'avatar_url']: base64Image
      };

      const updatedUser = await updateUserProfile(updateData);

      if (setUser) setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (type === 'banner') {
        setBannerUrl(base64Image);
      }
      
      const token = localStorage.getItem('token');
      if (token && syncUser) {
        await syncUser(token);
      }

    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Hubo un error al guardar la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdateProfileDTO = {
        nombre: formData.nombre,
        telefono: formData.telefono,

        email: formData.email
      };

      await updateUserProfile(updateData);

      const token = localStorage.getItem('token');
      if (token && syncUser) {
        await syncUser(token);
      }

      setIsEditing(false);

    } catch (error) {
      console.error("Error guardando perfil:", error);
      alert("No se pudo actualizar la información del perfil.");
    } finally {
      setIsSaving(false);
    }
  };
  const isBCPUser = false;
  return (
    <div className="max-w-5xl mx-auto pb-10 bg-background min-h-screen">
      <div className="relative mb-24 md:mb-20">

        <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden bg-muted relative group">
          <img
            src={bannerUrl}
            alt="Banner de perfil"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

          <input
            type="file"
            ref={bannerInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'banner')}
            disabled={isUploading}
          />

          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer bg-background/80 hover:bg-background text-foreground"
            onClick={() => bannerInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
            {isUploading ? 'Subiendo...' : 'Cambiar Banner'}
          </Button>
        </div>
        <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center px-4">
          <div className="relative group mb-3">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl bg-card">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.nombre} className="object-cover" />
              <AvatarFallback className="text-4xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 font-bold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'avatar')}
              disabled={isUploading}
            />

            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-1 right-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 bg-background border border-border hover:bg-accent cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <Camera className="w-4 h-4 text-muted-foreground" />}
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{user?.nombre}</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50">
                {user?.rol || 'Cliente'}
              </Badge>
              {isBCPUser && (
                <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20">
                  Cliente BCP
                </Badge>
              )}
              <Badge variant="outline" className="border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400">
                Nivel Oro
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">

        <Card className="lg:col-span-2 bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl text-foreground">
                <User className="w-5 h-5 mr-2 text-muted-foreground" />
                Información Personal
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Gestiona tus datos de contacto y acceso.
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="border-border text-foreground hover:bg-accent">
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving} className="text-muted-foreground">
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  Guardar
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Nombre Completo</Label>
                {isEditing ? (
                  <Input
                    value={formData.nombre}
                    onChange={(e: any) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-background border-input text-foreground"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground font-medium">
                    {user?.nombre}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">DNI / Documento</Label>
                <div className="p-3 bg-muted/30 rounded-md border border-border/50 text-muted-foreground">
                  {user?.dni || 'No registrado'}
                  <span className="float-right text-xs italic opacity-70">(No editable)</span>
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Correo Electrónico
                </Label>
                {isEditing && !isBCPUser ? ( // Solo editable si NO es BCP
                  <Input
                    value={formData.email}
                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-input text-foreground"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground">
                    {user?.email}
                    {isEditing && isBCPUser && <span className="float-right text-xs text-orange-500">(Gestionado por Banco)</span>}
                  </div>
                )}
              </div>

              {/* TELÉFONO */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Teléfono
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="bg-background border-input text-foreground"
                    placeholder="+51..."
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground">
                    {user?.telefono || 'No registrado'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COLUMNA DERECHA: Acciones */}
        <div className="space-y-6">
          {/* TARJETA FINANZAS */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-foreground">
                <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
                Mis Finanzas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent">
                <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                Gestionar Cuentas
              </Button>
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent">
                <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />
                Ver Tarjetas Asociadas
              </Button>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2 shadow-md hover:shadow-lg transition-all">
                Transferir Saldo
              </Button>
            </CardContent>
          </Card>

          {/* TARJETA SEGURIDAD */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-foreground">
                <Shield className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isBCPUser && (
                <Button variant="outline" className="w-full justify-start border-border hover:bg-accent text-foreground">
                  Cambiar Contraseña
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}