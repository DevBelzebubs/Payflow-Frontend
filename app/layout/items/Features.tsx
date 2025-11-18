import React from 'react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CreditCard,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
const Features = ({visibleSections}:StepsProps)=> {
    const features = [
    {
      icon: Zap,
      title: 'Pagos Instantáneos',
      description: 'Procesa transacciones en segundos, no en días',
    },
    {
      icon: Shield,
      title: 'Máxima Seguridad',
      description: 'Encriptación de nivel bancario en todas las transacciones',
    },
    {
      icon: Globe,
      title: 'Global',
      description: 'Acepta pagos de múltiples entornos',
    },
    {
      icon: CreditCard,
      title: 'Métodos simples y seguros',
      description: 'Tarjetas y transferencias',
    },
  ];
  return (
    <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8"
        data-animate
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              ¿Por qué elegir{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                PayFlow
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todas las herramientas que necesitas para realizar pagos de
              forma profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className={`p-6 hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-orange-200 group ${visibleSections.has('features')
                      ? 'animate-slide-up'
                      : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
  )
}
export default Features;