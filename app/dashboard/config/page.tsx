'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { 
  Accessibility, 
  Type, 
  Eye, 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun,
  ZapOff,
  Check,
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ConfigPage() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [fontSize, highContrast, reduceMotion]);

  const handleReset = () => {
    setFontSize(100);
    setHighContrast(false);
    setReduceMotion(false);
    toast.info("Configuración restaurada", {
      description: "Se han restablecido las opciones de accesibilidad."
    });
  };

  const adjustFontSize = (increment: boolean) => {
    const newSize = increment ? fontSize + 10 : fontSize - 10;
    if (newSize >= 80 && newSize <= 150) {
      setFontSize(newSize);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    toast.success(!highContrast ? "Alto contraste activado" : "Alto contraste desactivado");
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
    toast.success(!reduceMotion ? "Reducción de movimiento activada" : "Reducción de movimiento desactivada");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            Configuración
          </h1>
          <p className="text-muted-foreground mt-2">
            Personaliza la apariencia y accesibilidad de PayFlow.
          </p>
        </div>
        <Button variant="outline" onClick={handleReset} className="hidden sm:flex" title="Restaurar valores">
          <RotateCcw className="w-4 h-4 mr-2" /> Restaurar
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Apariencia</CardTitle>
            </div>
            <CardDescription className="ml-9">
              Ajusta el tema visual de la aplicación según tu preferencia.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  Tema de la aplicación
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alterna entre modo claro, oscuro o sistema.
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Accessibility className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Accesibilidad</CardTitle>
              </div>
              <Badge variant="secondary" className="font-normal text-muted-foreground">
                Beta
              </Badge>
            </div>
            <CardDescription className="ml-9">
              Herramientas para mejorar tu experiencia de lectura y navegación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Type className="w-4 h-4 text-orange-500" />
                  Tamaño de Fuente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ajusta el tamaño del texto ({fontSize}%).
                </p>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-lg border border-border/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => adjustFontSize(false)}
                  disabled={fontSize <= 80}
                  className="h-8 w-8 hover:bg-background"
                >
                  <span className="text-xs font-bold">A-</span>
                </Button>
                <span className="w-12 text-center font-mono font-medium">{fontSize}%</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => adjustFontSize(true)}
                  disabled={fontSize >= 150}
                  className="h-8 w-8 hover:bg-background"
                >
                  <span className="text-lg font-bold">A+</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4 text-orange-500" />
                  Alto Contraste
                </Label>
                <p className="text-sm text-muted-foreground">
                  Aumenta la diferencia entre texto y fondo.
                </p>
              </div>
              <Button 
                variant={highContrast ? "default" : "outline"}
                onClick={toggleHighContrast}
                className={highContrast ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              >
                {highContrast ? <Check className="w-4 h-4 mr-2" /> : null}
                {highContrast ? "Activado" : "Activar"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <ZapOff className="w-4 h-4 text-orange-500" />
                  Reducir Movimiento
                </Label>
                <p className="text-sm text-muted-foreground">
                  Minimiza las animaciones de la interfaz.
                </p>
              </div>
              <Button 
                variant={reduceMotion ? "default" : "outline"}
                onClick={toggleReduceMotion}
                className={reduceMotion ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              >
                {reduceMotion ? <Check className="w-4 h-4 mr-2" /> : null}
                {reduceMotion ? "Activado" : "Activar"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}