import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Shield, Trophy } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import concreteSpecimens from '../assets/services/concrete-specimens.jpg';
import shotcreteCores from '../assets/services/shotcrete-cores.jpg';
import cementGrout from '../assets/services/cement-grout.jpg';
import backfillTesting from '../assets/services/backfill-testing.jpg';

const ServicesPage: React.FC = () => {
  // Set page title and meta description
  React.useEffect(() => {
    document.title = 'Ground Support Testing Services - Goldfields Testing Laboratory';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional ground support QAQC testing services for mining. Shotcrete, concrete, grout and backfill testing to Australian Standards. High quality, reliable results.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Professional ground support QAQC testing services for mining. Shotcrete, concrete, grout and backfill testing to Australian Standards. High quality, reliable results.';
      document.head.appendChild(meta);
    }
  }, []);
  const services = [{
    image: concreteSpecimens,
    title: 'Concrete Cylinders or Cubes (AS 1012.9 & 1012.12.1)',
    description: 'Compressive strength testing of concrete cylinders or cubes for quality control verification.',
    color: 'from-primary to-accent'
  }, {
    image: shotcreteCores,
    title: 'Shotcrete Cores (AS 1012.14)',
    description: 'Compressive strength testing of shotcrete cores to Australian Standards using calibrated equipment.',
    color: 'from-primary to-accent'
  }, {
    image: cementGrout,
    title: 'Cement Grout',
    description: 'Compressive strength testing of cement grout cylinders or cubes for cable bolt applications.',
    color: 'from-accent to-primary'
  }, {
    image: backfillTesting,
    title: 'Backfill Testing',
    description: 'Compressive strength testing of backfill (paste or CAF) cylinders for mining applications.',
    color: 'from-primary to-accent'
  }];
  const processSteps = ['Sample Collection & Delivery', 'Laboratory Registration', 'Testing Execution', 'Results & Reporting'];
  return <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="relative py-32 bg-gradient-to-br from-gray-50 to-white pt-24">
          {/* Subtle background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
          
          {/* Minimal decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/5 rounded-full blur-xl"></div>
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
                    <span className="text-sm font-medium text-gray-500">Services</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Professional Header */}
            <div className="text-center mb-20 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                <span className="block">Testing</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Services
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Concrete and Ground Support QAQC Testing for Mining Operations</p>
            </div>

            {/* Enhanced Services Grid - WHITE CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
              {services.map((service, index) => {
              return <div key={index} className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-primary/25 transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 animate-fade-in" style={{
                animationDelay: `${index * 100}ms`
              }}>
                    {/* Image container */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        {service.description}
                      </p>
                    </div>

                    {/* Hover effect line with service color */}
                    <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${service.color} group-hover:w-full transition-all duration-500`}></div>
                  </div>;
            })}
            </div>

            {/* Professional Process Steps */}
            <div className="mb-16 animate-fade-in delay-300">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Testing Process</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed">{step}</p>
                  </div>)}
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
                  <Link to="/contact" className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25">
                    <span className="relative">Request Testing Quote</span>
                    <div className="ml-3 w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Our Laboratory Section */}
            <div className="mt-20 animate-fade-in delay-700">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Laboratory
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  High quality equipment and well-trained staff ensure accurate, reliable results
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Quality Equipment
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    High quality cutting, grinding and compression testing equipment, automated where possible
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Regular Maintenance
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    All equipment is regularly serviced and calibrated to ensure data integrity
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Trained Staff
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Well-trained staff ensure accurate, reliable results delivered on time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default ServicesPage;