import React from 'react';
import { Beaker, Clock, FileText, Users, Shield, Trophy, Circle } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Beaker,
      title: 'Shotcrete Cores',
      description: 'Compressive strength testing of shotcrete cores to Australian Standards using calibrated equipment.',
      color: 'from-primary to-accent'
    },
    {
      icon: FileText,
      title: 'Concrete Cylinders or Cubes', 
      description: 'Compressive strength testing of concrete cylinders or cubes for quality control verification.',
      color: 'from-primary to-accent'
    },
    {
      icon: Shield,
      title: 'Cement Grout',
      description: 'Compressive strength testing of cement grout cylinders or cubes for cable bolt applications.',
      color: 'from-accent to-primary'
    },
    {
      icon: Trophy,
      title: 'Backfill Testing',
      description: 'Compressive strength testing of backfill (paste or CAF) cylinders for mining applications.',
      color: 'from-primary to-accent'
    },
    {
      icon: Circle,
      title: 'Round Determinate Panel (RDP)',
      description: 'Flexural testing of shotcrete using the Round Determinate Panel (RDP) method to assess energy absorption and toughness for ground support applications.',
      color: 'from-primary to-accent'
    }
  ];

  const processSteps = [
    'Sample Delivery & Registration',
    'Water Bath Curing',
    'Scheduled Testing',
    'Results & Reporting'
  ];

  return (
    <section id="services" className="relative py-32 bg-gradient-to-br from-gray-50 to-white">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      
      {/* Minimal decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/5 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Professional Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="block">Testing</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ground Support QAQC Testing for Mining Operations
          </p>
        </div>

        {/* Enhanced Services Grid - WHITE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-primary/25 transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating icon container with service colors */}
                <div className={`relative flex items-center justify-center w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                  
                  {/* Orbiting dot */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Hover effect line with service color */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${service.color} group-hover:w-full transition-all duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Professional Process Steps */}
        <div className="mb-16 animate-fade-in delay-300">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Testing Process</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="text-center animate-fade-in delay-500">
          <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 md:p-16 border border-primary/10 shadow-lg overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative">
              <h3 className="text-4xl font-black mb-6 text-gray-900">
                Ready to Test Your Samples?
              </h3>
              <p className="text-xl mb-10 text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get Australian Standard compliant UCS testing backed by operational mining experience.
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                <span className="relative">Request Testing Quote</span>
                <div className="ml-3 w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
