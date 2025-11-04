import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CertificationsPage: React.FC = () => {

  const content = {
    en: {
      title: 'Standards & Compliance',
      subtitle: 'Australian Standard Testing Laboratory',
      standards: [
        {
          icon: Shield,
          title: 'AS 1012.8.1',
          description: 'Method for making and curing concrete specimens for strength testing',
          color: 'from-primary to-accent'
        },
        {
          icon: Shield,
          title: 'AS 1012.8.3',
          description: 'Methods of making and curing grout specimens for cable bolt applications',
          color: 'from-primary to-accent'
        },
        {
          icon: CheckCircle,
          title: 'AS 1012.9',
          description: 'Compressive strength tests - Concrete, mortar and grout specimens',
          color: 'from-accent to-primary'
        },
        {
          icon: CheckCircle,
          title: 'AS 1012.12.1',
          description: 'Determination of mass per unit volume of hardened concrete',
          color: 'from-primary to-accent'
        },
        {
          icon: Award,
          title: 'AS 1012.14',
          description: 'Method for securing and testing cores from hardened concrete for compressive strength',
          color: 'from-accent to-primary'
        }
      ],
      compliance: {
        title: 'NATA Accreditation',
        description: 'Goldfields Testing Laboratory is currently applying for NATA Accreditation. All testing procedures strictly adhere to Australian Standards, ensuring your ground support testing meets regulatory and industry requirements.',
        features: [
          'High quality testing equipment',
          'Automated where possible',
          'Regularly serviced and calibrated',
          'Data integrity assured'
        ]
      },
      pageTitle: 'Standards & Compliance - Goldfields Testing Laboratory',
      pageDescription: 'Goldfields Testing Laboratory adheres to Australian Standards (AS 1012.8.1, 8.3, 9, 12.1, 14) and is currently applying for NATA accreditation for reliable ground support testing.',
      breadcrumb: 'Certifications'
    },
    es: {
      title: 'Estándares y Cumplimiento',
      subtitle: 'Laboratorio de Pruebas de Estándares Australianos',
      standards: [
        {
          icon: Shield,
          title: 'AS 1012.8.1',
          description: 'Método para hacer y curar especímenes de concreto para pruebas de resistencia',
          color: 'from-primary to-accent'
        },
        {
          icon: Shield,
          title: 'AS 1012.8.3',
          description: 'Métodos para hacer y curar especímenes de lechada para aplicaciones de pernos de cable',
          color: 'from-primary to-accent'
        },
        {
          icon: CheckCircle,
          title: 'AS 1012.9',
          description: 'Pruebas de resistencia a la compresión - Especímenes de concreto, mortero y lechada',
          color: 'from-accent to-primary'
        },
        {
          icon: CheckCircle,
          title: 'AS 1012.12.1',
          description: 'Determinación de masa por unidad de volumen de concreto endurecido',
          color: 'from-primary to-accent'
        },
        {
          icon: Award,
          title: 'AS 1012.14',
          description: 'Método para asegurar y probar núcleos de concreto endurecido para resistencia a compresión',
          color: 'from-accent to-primary'
        }
      ],
      compliance: {
        title: 'Acreditación NATA',
        description: 'Goldfields Testing Laboratory está actualmente aplicando para Acreditación NATA. Todos los procedimientos de prueba se adhieren estrictamente a los Estándares Australianos, asegurando que sus pruebas de soporte de terreno cumplan los requisitos regulatorios e industriales.',
        features: [
          'Equipo de prueba de alta calidad',
          'Automatizado donde sea posible',
          'Regularmente mantenido y calibrado',
          'Integridad de datos asegurada'
        ]
      },
      pageTitle: 'Estándares y Cumplimiento - Goldfields Testing Laboratory',
      pageDescription: 'Goldfields Testing Laboratory se adhiere a Estándares Australianos (AS 1012.8.1, 8.3, 9, 12.1, 14) y está actualmente aplicando para acreditación NATA para pruebas confiables de soporte de terreno.',
      breadcrumb: 'Certificaciones'
    }
  };

  // Set page title and meta description
  React.useEffect(() => {
    document.title = 'Standards & Compliance - Goldfields Testing Laboratory';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Goldfields Testing Laboratory adheres to Australian Standards (AS 1012.8.1, 8.3, 9, 12.1, 14) and is currently applying for NATA accreditation for reliable ground support testing.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Goldfields Testing Laboratory adheres to Australian Standards (AS 1012.8.1, 8.3, 9, 12.1, 14) and is currently applying for NATA accreditation for reliable ground support testing.';
      document.head.appendChild(meta);
    }
  }, []);

  const standards = [
    {
      icon: Shield,
      title: 'AS 1012.8.1',
      description: 'Method for making and curing concrete specimens for strength testing',
      color: 'from-primary to-accent'
    },
    {
      icon: Shield,
      title: 'AS 1012.8.3',
      description: 'Methods of making and curing grout specimens for cable bolt applications',
      color: 'from-primary to-accent'
    },
    {
      icon: CheckCircle,
      title: 'AS 1012.9',
      description: 'Compressive strength tests - Concrete, mortar and grout specimens',
      color: 'from-accent to-primary'
    },
    {
      icon: CheckCircle,
      title: 'AS 1012.12.1',
      description: 'Determination of mass per unit volume of hardened concrete',
      color: 'from-primary to-accent'
    },
    {
      icon: Award,
      title: 'AS 1012.14',
      description: 'Method for securing and testing cores from hardened concrete for compressive strength',
      color: 'from-accent to-primary'
    }
  ];

  const complianceFeatures = [
    'High quality testing equipment',
    'Automated where possible',
    'Regularly serviced and calibrated',
    'Data integrity assured'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="py-32 bg-gradient-to-br from-gray-50 to-white pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <span className="text-sm font-medium text-gray-500">Certifications</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Standards & Compliance
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Australian Standard Testing Laboratory
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>
            
            {/* Standards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {standards.map((standard, index) => {
                const IconComponent = standard.icon;
                return (
                  <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 bg-gradient-to-r ${standard.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{standard.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{standard.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Compliance Section */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">NATA Accreditation</h2>
                <p className="text-xl text-primary-foreground mb-8 leading-relaxed">
                  Goldfields Testing Laboratory is currently applying for NATA Accreditation. All testing procedures strictly adhere to Australian Standards, ensuring your ground support testing meets regulatory and industry requirements.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {complianceFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 justify-center md:justify-start">
                      <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                      <span className="text-primary-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Need Standards-Compliant Testing?
                </h3>
                <p className="text-gray-600 mb-6 max-w-lg">
                  Trust Goldfields Testing Laboratory for Australian Standards compliant ground support testing with high quality results and professional service.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Request Certified Testing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CertificationsPage;