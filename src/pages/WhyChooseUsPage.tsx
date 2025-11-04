import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, DollarSign, Shield, Wrench, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const WhyChooseUsPage: React.FC = () => {
  const content = {
    en: {
      title: 'Why Choose GT Lab',
      subtitle: 'The Operational Advantage in Concrete Testing',
      description: 'Unlike traditional laboratories run by technicians, GT Lab Kalgoorlie brings real-world mining operational experience to every test. We understand the demands of mining environments and provide testing services that truly serve your operational needs.',
      advantages: [{
        icon: Wrench,
        title: 'Operational Experience',
        description: 'Our team combines laboratory expertise with hands-on mining operations experience, providing insights that pure lab technicians cannot offer.',
        color: 'from-primary to-accent'
      }, {
        icon: MapPin,
        title: 'Local Kalgoorlie Service',
        description: 'Based in the heart of the Goldfields, we provide faster turnaround times and understand local mining conditions and requirements.',
        color: 'from-primary to-accent'
      }, {
        icon: DollarSign,
        title: 'Competitive Pricing',
        description: 'We have price-checked against our competitors and consistently match or beat their pricing while maintaining superior service quality.',
        color: 'from-primary to-accent'
      }, {
        icon: Shield,
        title: 'Australian Standards Compliant',
        description: 'All our testing procedures strictly adhere to Australian Standards, ensuring your results meet regulatory and industry requirements.',
        color: 'from-primary to-accent'
      }, {
        icon: Clock,
        title: 'Reliable Scheduling',
        description: 'Precise testing at 7, 14, and 28-day intervals with consistent, dependable reporting that fits your project timelines.',
        color: 'from-primary to-accent'
      }, {
        icon: Users,
        title: 'Mining-Focused Service',
        description: 'We specialize exclusively in serving mining companies and contractors, understanding your unique operational challenges and requirements.',
        color: 'from-primary to-accent'
      }],
      cta: {
        title: 'Experience the GT Lab Difference',
        subtitle: 'Ready to work with a laboratory that understands mining operations?',
        button: 'Contact Us Today'
      },
      pageTitle: 'Why Choose Us - GT Lab Kalgoorlie Mining Laboratory',
      pageDescription: 'Discover the GT Lab advantage: operational mining experience, competitive pricing, Australian Standards compliance, and local Kalgoorlie service for superior concrete testing.',
      breadcrumb: 'Why Choose Us'
    },
    es: {
      title: 'Por Qué Elegir GT Lab',
      subtitle: 'La Ventaja Operacional en Pruebas de Concreto',
      description: 'A diferencia de los laboratorios tradicionales dirigidos por técnicos, GT Lab Kalgoorlie aporta experiencia operativa minera del mundo real a cada prueba. Entendemos las demandas de los ambientes mineros y proporcionamos servicios de prueba que realmente sirven sus necesidades operativas.',
      advantages: [{
        icon: Wrench,
        title: 'Experiencia Operacional',
        description: 'Nuestro equipo combina experiencia de laboratorio con experiencia práctica en operaciones mineras, proporcionando perspectivas que los técnicos de laboratorio puros no pueden ofrecer.',
        color: 'from-primary to-accent'
      }, {
        icon: MapPin,
        title: 'Servicio Local de Kalgoorlie',
        description: 'Basados en el corazón de Goldfields, proporcionamos tiempos de entrega más rápidos y entendemos las condiciones y requisitos mineros locales.',
        color: 'from-primary to-accent'
      }, {
        icon: DollarSign,
        title: 'Precios Competitivos',
        description: 'Hemos verificado precios contra nuestros competidores y consistentemente igualamos o superamos su precios mientras mantenemos calidad de servicio superior.',
        color: 'from-primary to-accent'
      }, {
        icon: Shield,
        title: 'Cumple Estándares Australianos',
        description: 'Todos nuestros procedimientos de prueba se adhieren estrictamente a los Estándares Australianos, asegurando que sus resultados cumplan requisitos regulatorios y de la industria.',
        color: 'from-primary to-accent'
      }, {
        icon: Clock,
        title: 'Programación Confiable',
        description: 'Pruebas precisas en intervalos de 7, 14 y 28 días con reportes consistentes y confiables que se ajustan a sus cronogramas de proyecto.',
        color: 'from-primary to-accent'
      }, {
        icon: Users,
        title: 'Servicio Enfocado en Minería',
        description: 'Nos especializamos exclusivamente en servir empresas y contratistas mineros, entendiendo sus desafíos y requisitos operacionales únicos.',
        color: 'from-primary to-accent'
      }],
      cta: {
        title: 'Experimenta la Diferencia GT Lab',
        subtitle: '¿Listo para trabajar con un laboratorio que entiende las operaciones mineras?',
        button: 'Contáctanos Hoy'
      },
      pageTitle: 'Por Qué Elegirnos - Laboratorio Minero GT Lab Kalgoorlie',
      pageDescription: 'Descubre la ventaja de GT Lab: experiencia operativa minera, precios competitivos, cumplimiento de estándares australianos, y servicio local de Kalgoorlie para pruebas superiores de concreto.',
      breadcrumb: 'Por Qué Elegirnos'
    }
  };

  // Set page title and meta description
  React.useEffect(() => {
    document.title = 'Why Choose Us - GT Lab Kalgoorlie Mining Laboratory';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the GT Lab advantage: operational mining experience, competitive pricing, Australian Standards compliance, and local Kalgoorlie service for superior concrete testing.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover the GT Lab advantage: operational mining experience, competitive pricing, Australian Standards compliance, and local Kalgoorlie service for superior concrete testing.';
      document.head.appendChild(meta);
    }
  }, []);
  const advantages = [{
    icon: Wrench,
    title: 'Operational Experience',
    description: 'Our team combines laboratory expertise with hands-on mining operations experience, providing insights that pure lab technicians cannot offer.',
    color: 'from-primary to-accent'
  }, {
    icon: MapPin,
    title: 'Local Kalgoorlie Service',
    description: 'Based in the heart of the Goldfields, we provide faster turnaround times and understand local mining conditions and requirements.',
    color: 'from-primary to-accent'
  }, {
    icon: DollarSign,
    title: 'Competitive Pricing',
    description: 'We have price-checked against our competitors and consistently match or beat their pricing while maintaining superior service quality.',
    color: 'from-primary to-accent'
  }, {
    icon: Shield,
    title: 'Australian Standards Compliant',
    description: 'All our testing procedures strictly adhere to Australian Standards, ensuring your results meet regulatory and industry requirements.',
    color: 'from-primary to-accent'
  }, {
    icon: Clock,
    title: 'Reliable Scheduling',
    description: 'Precise testing at 7, 14, and 28-day intervals with consistent, dependable reporting that fits your project timelines.',
    color: 'from-primary to-accent'
  }, {
    icon: Users,
    title: 'Mining-Focused Service',
    description: 'We specialize exclusively in serving mining companies and contractors, understanding your unique operational challenges and requirements.',
    color: 'from-primary to-accent'
  }];
  return <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="relative py-32 bg-white pt-24">
          {/* Subtle gold accent elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-sm font-medium text-gray-500">Why Choose Us</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Goldfields Testing
                </span>{" "}
                <span className="text-gray-900">Laboratory?</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                The Operational Advantage in Concrete Testing
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">Unlike traditional laboratories run by technicians, Goldfields Testing Laboratory Kalgoorlie brings real-world mining operational experience to every test. We understand the demands of mining environments and provide testing services that truly serve your operational needs.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return <div key={index} className="group bg-white border-2 border-primary/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-2" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${advantage.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                      {advantage.description}
                    </p>

                    {/* Hover effect line */}
                    <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${advantage.color} group-hover:w-full transition-all duration-500`}></div>
                  </div>;
            })}
            </div>

            {/* Call to action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl p-12 shadow-xl">
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  Experience the GT Lab Difference
                </h2>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Ready to work with a laboratory that understands mining operations?
                </p>
                <Link to="/contact" className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Contact Us Today
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default WhyChooseUsPage;