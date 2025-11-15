import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const TestimonialsPage: React.FC = () => {
  const content = {
    en: {
      title: 'Industry Standards',
      subtitle: 'Trusted by mining companies across the Goldfields for reliable concrete testing services',
      testimonials: [{
        name: 'Jen',
        company: 'Geotechnical Engineer, Kambalda',
        text: 'Goldfields Testing Laboratory has been our testing laboratory for over three years. Their consistency, reliability, and understanding of mining requirements make them a valuable partner',
        rating: 5
      }, {
        name: 'Matt',
        company: 'Project Manager, Kalgoorlie',
        text: 'We have recently started using Goldfields Testing Laboratory for all our QAQC testing. We have been impressed with their communications and feedback on the results.',
        rating: 5
      }, {
        name: 'Farhan',
        company: 'Geotechnical Superintendent, Kalgoorlie',
        text: 'We have been using Goldfields Testing Laboratory for many years for our cable bolt grout UCS testing. Being local makes getting samples to the lab straightforward. They provide regular feedback on sample quality and promptly answer any questions we may have on the results',
        rating: 5
      }, {
        name: 'James',
        company: 'Operations Director, Perth',
        text: 'The difference between Goldfields Testing Laboratory and other testing facilities is clear - they know mining operations. Their sample handling is professional, reporting is detailed, and turnaround times consistently meet our project deadlines.',
        rating: 5
      }],
      pageTitle: 'Client Testimonials - Goldfields Testing Laboratory Reviews',
      pageDescription: 'Read what mining companies say about Goldfields Testing Laboratory\'s concrete testing services. Trusted by Goldfields mining operations for Australian Standard compliant UCS testing.',
      breadcrumb: 'Testimonials'
    },
    es: {
      title: 'Estándares de la Industria',
      subtitle: 'Confiado por empresas mineras en Goldfields para servicios confiables de pruebas de concreto',
      testimonials: [{
        name: 'Sarah Mitchell',
        company: 'Gerente de Operaciones, Goldfields Mining Co.',
        text: 'La experiencia operativa minera de Goldfields Testing Laboratory realmente se muestra en su enfoque de pruebas. Entienden nuestras limitaciones de tiempo y proporcionan resultados que nos ayudan a tomar decisiones informadas rápidamente. Su cumplimiento con los Estándares Australianos nos da confianza en cada reporte.',
        rating: 5
      }, {
        name: 'Mike Thompson',
        company: 'Ingeniero de Proyecto, Kalgoorlie Construction',
        text: 'La diferencia entre Goldfields Testing Laboratory y otras instalaciones de pruebas es clara - conocen las operaciones mineras. Su manejo de muestras es profesional, los reportes son detallados, y los tiempos de entrega consistentemente cumplen nuestros plazos de proyecto.',
        rating: 5
      }, {
        name: 'Rachel Davis',
        company: 'Gerente de Calidad, Regional Contractors',
        text: 'Hemos usado varios laboratorios de pruebas a lo largo de los años, pero Goldfields Testing Laboratory se destaca por sus precios competitivos y calidad de servicio superior. Su presencia local en Kalgoorlie significa servicio más rápido y mejor comprensión de nuestras necesidades.',
        rating: 5
      }, {
        name: 'James Wilson',
        company: 'Supervisor de Sitio, Mining Solutions Ltd.',
        text: 'Servicio profesional de principio a fin. El equipo de Goldfields Testing Laboratory proporciona comunicación clara, reportes detallados, y su experiencia operativa nos ayuda a interpretar resultados en términos prácticos para nuestras aplicaciones de concreto.',
        rating: 5
      }, {
        name: 'Emma Thompson',
        company: 'Gerente de Proyecto, Goldfields Development',
        text: 'Goldfields Testing Laboratory ha sido nuestro laboratorio de pruebas preferido por más de dos años. Su consistencia, confiabilidad y profundo entendimiento de los requisitos mineros los convierte en un socio invaluable en nuestras operaciones.',
        rating: 5
      }, {
        name: 'David Rodriguez',
        company: 'Líder de Aseguramiento de Calidad, Mining Corp Australia',
        text: 'Lo que distingue a Goldfields Testing Laboratory es su capacidad de proporcionar no solo resultados de pruebas, sino perspectivas prácticas basadas en experiencia minera real. Sus reportes nos ayudan a optimizar nuestros diseños de mezcla de concreto para mejor rendimiento.',
        rating: 5
      }],
      pageTitle: 'Testimonios de Clientes - Reseñas Goldfields Testing Laboratory',
      pageDescription: 'Lee lo que las empresas mineras dicen sobre los servicios de pruebas de concreto de Goldfields Testing Laboratory. Confiado por operaciones mineras de Goldfields para pruebas UCS conformes con estándares australianos.',
      breadcrumb: 'Testimonios'
    }
  };

  // Set page title and meta description
  React.useEffect(() => {
    document.title = 'Client Testimonials - Goldfields Testing Laboratory Reviews';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read what mining companies say about Goldfields Testing Laboratory\'s concrete testing services. Trusted by Goldfields mining operations for Australian Standard compliant UCS testing.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Read what mining companies say about Goldfields Testing Laboratory\'s concrete testing services. Trusted by Goldfields mining operations for Australian Standard compliant UCS testing.';
      document.head.appendChild(meta);
    }
  }, []);
  const testimonials = [{
    name: 'Jen',
    company: 'Geotechnical Engineer, Kambalda',
    text: 'Goldfields Testing Laboratory has been our testing laboratory for over three years. Their consistency, reliability, and understanding of mining requirements make them a valuable partner',
    rating: 5
  }, {
    name: 'Matt',
    company: 'Project Manager, Kalgoorlie',
    text: 'We have recently started using Goldfields Testing Laboratory for all our QAQC testing. We have been impressed with their communications and feedback on the results.',
    rating: 5
  }, {
    name: 'Farhan',
    company: 'Geotechnical Superintendent, Kalgoorlie',
    text: 'We have been using Goldfields Testing Laboratory for many years for our cable bolt grout UCS testing. Being local makes getting samples to the lab straightforward. They provide regular feedback on sample quality and promptly answer any questions we may have on the results',
    rating: 5
  }, {
    name: 'James',
    company: 'Operations Director, Perth',
    text: 'The difference between Goldfields Testing Laboratory and other testing facilities is clear - they know mining operations. Their sample handling is professional, reporting is detailed, and turnaround times consistently meet our project deadlines.',
    rating: 5
  }];
  return <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="relative py-32 bg-gradient-to-br from-gray-50 to-white pt-24">
          {/* Subtle accent elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="hidden flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-sm font-medium text-gray-500">Testimonials</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Industry Standards
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Trusted by companies across the Goldfields for reliable concrete testing services</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
              {testimonials.map((testimonial, index) => <div key={index} className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <Quote className="w-8 h-8 text-primary mr-4" />
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-current" />)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    {testimonial.company && <div className="text-gray-600">{testimonial.company}</div>}
                  </div>
                </div>)}
            </div>

            {/* Call to action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-8 shadow-lg">
                <p className="text-gray-900 text-xl font-semibold mb-4">
                  Ready to experience professional UCS testing?
                </p>
                <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Request Testing Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default TestimonialsPage;