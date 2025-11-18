import React from 'react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
const Reasons = ({visibleSections}:StepsProps)=> {
  return (
    <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white"
        data-animate
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Comienza en{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                2 Pasos
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Configura tu cuenta y empieza a realizar pagos en minutos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Crea tu Cuenta',
                description:
                  'Regístrate en menos de 2 minutos con tu correo electrónico',
              },
              {
                step: '02',
                title: 'Configura Pagos',
                description:
                  'Tus métodos de pago se conectan de manera automática y segura',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative ${visibleSections.has('how-it-works')
                    ? 'animate-slide-up'
                    : 'opacity-0'
                  }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 bg-white group hover:-translate-y-2">
                  <div className="text-6xl font-bold text-orange-100 group-hover:text-orange-200 transition-colors mb-4">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
                {index < 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-orange-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}
export default Reasons;