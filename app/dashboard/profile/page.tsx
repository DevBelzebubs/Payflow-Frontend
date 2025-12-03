"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  X,
  Trash2,
  IdCard,
} from "lucide-react";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { updateUserProfile } from "@/api/services/UserService";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ResetPasswordModal from "../components/layout/ResetPasswordModal";
import { UpdateProfileDTO } from "@/interfaces/client/UpdateProfile";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const DEFAULT_BANNER =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
  
  const { user, logout, syncUser, setUser } = useAuth() as any;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });

  const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        email: user.email || "",
      });
      if (user.banner_url) {
        setBannerUrl(user.banner_url);
      }
    }
  }, [user,isEditing]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDeleteImage = async (type: "banner" | "avatar") => {
    if (!confirm(`¿Estás seguro de que quieres eliminar ${type === "banner" ? "el banner" : "la foto de perfil"}?`)) return;
    try {
      setIsUploading(true);
      const updateData: UpdateProfileDTO = {
        [type === "banner" ? "banner_url" : "avatar_url"]: "",
      };

      const updatedUser = await updateUserProfile(updateData);

      if (setUser) setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (type === "banner") {
        setBannerUrl(DEFAULT_BANNER);
      }
      toast.success("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      toast.error("No se pudo eliminar la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "banner" | "avatar"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Procesando imagen...");

    try {
      setIsUploading(true);
      const base64Image = await convertToBase64(file);

      const updateData: UpdateProfileDTO = {
        [type === "banner" ? "banner_url" : "avatar_url"]: base64Image,
      };

      const updatedUser = await updateUserProfile(updateData);

      if (setUser) setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (type === "banner") {
        setBannerUrl(base64Image);
      }

      if (user && user.id && syncUser) {
        await syncUser(user.id);
      }
      toast.success("Imagen actualizada", { id: toastId });
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error("Hubo un error al guardar la imagen.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    const toastId = toast.loading("Guardando cambios...");
    try {
      setIsSaving(true);

      const updateData: UpdateProfileDTO = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
      };

      const updatedUser = await updateUserProfile(updateData);
      if (setUser) setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (user && user.id && syncUser) {
        await syncUser(user.id);
      }

      setIsEditing(false);
      toast.success("Perfil actualizado correctamente", { id: toastId });
    } catch (error) {
      console.error("Error guardando perfil:", error);
      toast.error("No se pudo actualizar la información.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const isBCPUser = false;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto pb-10 bg-background min-h-screen"
    >
      <div className="relative mb-24 md:mb-20 group/banner">
        <div className="h-48 md:h-64 w-full rounded-b-2xl md:rounded-2xl overflow-hidden bg-muted relative shadow-md">
          <img
            src={bannerUrl}
            alt="Banner de perfil"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover/banner:bg-black/30 transition-colors duration-300" />
          
          <input
            type="file"
            ref={bannerInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "banner")}
            disabled={isUploading}
          />
          
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300">
            {bannerUrl !== DEFAULT_BANNER && (
              <Button
                variant="destructive"
                size="sm"
                className="shadow-md h-8 px-2"
                onClick={() => handleDeleteImage("banner")}
                disabled={isUploading}
                title="Eliminar banner"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="shadow-md h-8 bg-background/80 hover:bg-background backdrop-blur-sm"
              onClick={() => bannerInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
              Cambiar Banner
            </Button>
          </div>
        </div>

        <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center px-4">
          <div className="relative group/avatar mb-3">
            <Avatar className="w-32 h-32 border-4 border-background dark:border-card shadow-xl">
              <AvatarImage
                src={user?.avatar_url || ""}
                alt={user?.nombre}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 font-bold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "avatar")}
              disabled={isUploading}
            />
            
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 gap-2">
               <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploading}
                title="Cambiar foto"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </Button>
              {user?.avatar_url && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleDeleteImage("avatar")}
                  disabled={isUploading}
                  title="Eliminar foto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {user?.nombre}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200">
                {user?.rol || "Cliente"}
              </Badge>
              {isBCPUser && (
                <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20">
                  Cliente BCP
                </Badge>
              )}
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-400">
                Nivel Oro
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 px-4 md:px-0">
        <Card className="lg:col-span-2 border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 py-4">
            <div>
              <CardTitle className="flex items-center text-lg text-foreground">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Información Personal
              </CardTitle>
              <CardDescription className="text-xs md:text-sm mt-1">
                Gestiona tus datos de contacto.
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 border-border hover:bg-accent hover:text-accent-foreground"
              >
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="h-8 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSaving ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3 mr-1" />
                  )}
                  Guardar
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Nombre Completo</Label>
                {isEditing ? (
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-background"
                  />
                ) : (
                  <div className="p-2.5 bg-muted/30 rounded-lg border border-border/50 text-foreground font-medium text-sm">
                    {user?.nombre}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide flex items-center gap-1">
                  <IdCard className="w-3 h-3" /> DNI / Documento
                </Label>
                <div className="p-2.5 bg-muted/50 rounded-lg border border-border/50 text-muted-foreground text-sm flex justify-between items-center">
                  <span>{user?.dni || "No registrado"}</span>
                  {!isEditing && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground/70">Solo lectura</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Correo Electrónico
                </Label>
                {isEditing && !isBCPUser ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background"
                  />
                ) : (
                  <div className="p-2.5 bg-muted/50 rounded-lg border border-border/50 text-foreground text-sm flex justify-between items-center">
                    <span className="truncate">{user?.email}</span>
                    {isBCPUser && <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">BCP</span>}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Teléfono
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+51..."
                    className="bg-background"
                  />
                ) : (
                  <div className="p-2.5 bg-muted/30 rounded-lg border border-border/50 text-foreground text-sm">
                    {user?.telefono || "No registrado"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center text-foreground">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3">
                  <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Mis Finanzas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/profile/accounts" passHref>
                <Button
                  variant="outline"
                  className="w-full justify-start text-foreground hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
                >
                  <Building2 className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-orange-500" />
                  Ver y Gestionar Cuentas
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center text-foreground">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mr-3">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!isBCPUser && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-normal border border-transparent hover:border-border"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Cambiar Contraseña
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ResetPasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </motion.div>
  );
}