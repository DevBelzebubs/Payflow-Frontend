import React from 'react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CreditCard,
  ArrowRight,
} from 'lucide-react';
const Balance = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className="space-y-8 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="inline-block">
              <span className="bg-primary/10 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                Nuevo: API v2.0 Disponible
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Pagos{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Fluidos
              </span>{' '}
              para ti
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              La plataforma de pagos más rápida y segura. Acepta pagos
              globales con la mejor experiencia para tus clientes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-accent text-lg"
              >
                Ver Demo
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Card className="p-8 bg-background backdrop-blur-sm shadow-2xl border-2 border-border transform hover:scale-105 transition-all duration-500 animate-float">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Balance Total
                      </p>
                      <h3 className="text-3xl font-bold">$124,563.00</h3>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white rotate-180" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            Pago Recibido
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Cliente Premium
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600 dark:text-green-400">
                        +$2,500
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            Pago Enviado
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Proveedor
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-orange-600 dark:text-orange-400">-$850</p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white rotate-180" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            Suscripción
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mensual
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-blue-600 dark:text-blue-400">+$1,200</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full opacity-20 blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
export default Balance;