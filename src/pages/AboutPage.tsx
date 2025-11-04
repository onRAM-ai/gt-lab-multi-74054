import React, { useState } from 'react';
import { Users, Target, Award, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import gtLabLogo from '../assets/gt-lab-logo.jpg';
import labInterior from '../assets/lab-interior.jpg';
import labTesting from '../assets/lab-testing.jpg';
import labEquipment from '../assets/lab-equipment.jpg';
const AboutPage: React.FC = () => {
  const content = {
    en: {
      title: 'About Goldfields Testing Laboratory',
      subtitle: 'Your Trusted Partner in Mining Ground Support Quality Control',
      description: "Goldfields Testing Laboratory are a Kalgoorlie based laboratory specialising in mining ground support quality control testing. We provide high quality testing of shotcrete and cable bolt grout materials.\n\nOur well-trained staff ensure that your test results are accurate, reliable and on time. We pride ourselves on our ability to provide you with a personal yet professional service.",
      mission: 'Mission',
      missionText: 'To provide accurate and reliable ground support quality control testing services that mining companies can trust. We combine laboratory excellence with personal service to deliver results that meet your ground support QAQC requirements.',
      vision: 'Vision',
      visionText: 'To be the Goldfields\' premier testing laboratory for mining ground support materials, known for our high quality testing, well-trained staff, and commitment to personal yet professional service.',
      stats: [{
        icon: Users,
        number: '30+',
        label: 'Mining Clients'
      }, {
        icon: Award,
        number: '5000+',
        label: 'Samples Tested'
      }, {
        icon: Target,
        number: '100%',
        label: 'Standards Compliant'
      }, {
        icon: MapPin,
        number: 'Kalgoorlie Local',
        label: 'Fast & Reliable Testing'
      }],
      pageTitle: 'About Us - Goldfields Testing Laboratory',
      pageDescription: 'Learn about Goldfields Testing Laboratory, Kalgoorlie\'s specialist in mining ground support quality control testing. High quality shotcrete and grout testing with personal, professional service.'
    },
    es: {
      title: 'Acerca de Goldfields Testing Laboratory',
      subtitle: 'Su Socio de Confianza en Control de Calidad de Soporte de Terreno Minero',
      description: 'Goldfields Testing Laboratory es un laboratorio con sede en Kalgoorlie especializado en pruebas de control de calidad de soporte de terreno minero. Proporcionamos pruebas de alta calidad de materiales de shotcrete y lechada de pernos de cable.\n\nNuestro personal bien capacitado garantiza que sus resultados de prueba sean precisos, confiables y a tiempo. Nos enorgullecemos de nuestra capacidad para brindarle un servicio personal pero profesional.',
      mission: 'Misión',
      missionText: 'Proporcionar servicios de pruebas de control de calidad de soporte de terreno precisos y confiables en los que las empresas mineras puedan confiar. Combinamos excelencia de laboratorio con servicio personal para entregar resultados que cumplan sus requisitos de QAQC de soporte de terreno.',
      vision: 'Visión',
      visionText: 'Ser el laboratorio de pruebas premier de Goldfields para materiales de soporte de terreno minero, conocido por nuestras pruebas de alta calidad, personal bien capacitado y compromiso con un servicio personal pero profesional.',
      stats: [{
        icon: Users,
        number: '30+',
        label: 'Clientes Mineros'
      }, {
        icon: Award,
        number: '5000+',
        label: 'Muestras Probadas'
      }, {
        icon: Target,
        number: '100%',
        label: 'Cumplimiento de Estándares'
      }, {
        icon: MapPin,
        number: 'Kalgoorlie Local',
        label: 'Pruebas Rápidas y Confiables'
      }],
      pageTitle: 'Acerca de Nosotros - Goldfields Testing Laboratory',
      pageDescription: 'Conoce sobre Goldfields Testing Laboratory, especialista de Kalgoorlie en pruebas de control de calidad de soporte de terreno minero. Pruebas de alta calidad de shotcrete y lechada con servicio personal y profesional.'
    }
  };

  // Set page title and meta description
  React.useEffect(() => {
    document.title = 'About Us - Goldfields Testing Laboratory';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Goldfields Testing Laboratory, Kalgoorlie\'s specialist in mining ground support quality control testing. High quality shotcrete and grout testing with personal, professional service.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about Goldfields Testing Laboratory, Kalgoorlie\'s specialist in mining ground support quality control testing. High quality shotcrete and grout testing with personal, professional service.';
      document.head.appendChild(meta);
    }
  }, []);
  const stats = [{
    icon: Users,
    number: '30+',
    label: 'Mining Clients'
  }, {
    icon: Award,
    number: '5000+',
    label: 'Samples Tested'
  }, {
    icon: Target,
    number: '100%',
    label: 'Standards Compliant'
  }, {
    icon: MapPin,
    number: 'Kalgoorlie Local',
    label: 'Fast & Reliable Testing'
  }];
  return <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="relative py-32 bg-white pt-24">
          {/* Subtle gold accent elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Centered Header Section */}
            <div className="text-center mb-20 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                <span className="block">About</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Goldfields Testing Laboratory
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner for concrete, shotcrete, grout &amp; backfill QAQC.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Content with slide-in animations */}
              <div className="space-y-8">
                <div className="space-y-6 animate-fade-in">
                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    Goldfields Testing Laboratory are a Kalgoorlie based laboratory specialising in mining ground support quality control testing. We provide high quality testing of shotcrete and cable bolt grout materials.

Our well-trained staff ensure that your test results are accurate, reliable and on time. We pride ourselves on our ability to provide you with a personal yet professional service.
                  </p>
                </div>

                {/* Mission & Vision with cards */}
                <div className="space-y-6 animate-fade-in delay-300">
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 transform hover:scale-105">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      Mission
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      To provide accurate and reliable ground support quality control testing services that mining companies can trust. We combine laboratory excellence with personal service to deliver results that meet your ground support QAQC requirements.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-accent/5 to-primary/5 border-2 border-accent/20 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 transform hover:scale-105">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse delay-500"></span>
                      Vision
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      To be the Goldfields' premier testing laboratory for mining ground support materials, known for our high quality testing, well-trained staff, and commitment to personal yet professional service.
                    </p>
                  </div>
                </div>
              </div>

              {/* Laboratory Images Gallery */}
              <div className="space-y-12">
                {/* Main Featured Image */}
                <div className="relative animate-fade-in delay-500 overflow-hidden rounded-3xl shadow-2xl group">
                  <img src={labInterior} alt="Professional concrete testing laboratory interior" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-6 animate-fade-in delay-700">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                    <img src={labTesting} alt="Laboratory technician testing concrete cylinders" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                    <img src={labEquipment} alt="Concrete test cylinders and quality control equipment" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 gap-6 animate-fade-in delay-900">
                  {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return <div key={index} className="group bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-2" style={{
                    animationDelay: `${800 + index * 100}ms`
                  }}>
                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                          {stat.number}
                        </div>
                        <div className="text-gray-700 font-medium text-sm">
                          {stat.label}
                        </div>
                      </div>;
                })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="border-t border-gray-200 pt-20 mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experienced professionals with deep mining industry knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Laboratory Leadership
                </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our team brings over 65 years of combined experience in mining operations and concrete testing, ensuring results that truly serve the mining industry.
                  </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-accent to-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Technical Expertise
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Certified in Australian Standards testing procedures with hands-on mining operational experience that sets us apart from traditional laboratory services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="border-t border-gray-200 pt-20 mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From sample delivery to final reporting - our streamlined process
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent"></div>
            
            <div className="space-y-12">
              {[{
                  step: 1,
                  title: 'Sample Collection & Delivery',
                  description: 'Secure sample delivery with proper chain of custody documentation and labeling according to Australian Standards.'
                }, {
                  step: 2,
                  title: 'Laboratory Registration',
                  description: 'Professional cataloguing and storage in our controlled environment with full traceability systems.'
                }, {
                  step: 3,
                  title: 'Testing Execution',
                  description: 'Precise UCS testing at required intervals using calibrated equipment and Australian Standard procedures.'
                }, {
                  step: 4,
                  title: 'Results & Reporting',
                  description: 'Comprehensive digital reports.'
                }].map((item, index) => <div key={index} className="relative flex items-center">
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10`}>
                    {item.step}
                  </div>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 ml-auto'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default AboutPage;