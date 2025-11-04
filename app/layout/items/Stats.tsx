import React from 'react'

const Stats = () => {
    const stats = [
    { value: '100K+', label: 'Transacciones' },
    { value: '2K+', label: 'Usuarios' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Soporte' },
  ];
  return (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
              >
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-gray-600 mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}
export default Stats;