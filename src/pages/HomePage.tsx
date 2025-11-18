import React, { useState } from 'react';
import { ArrowRight, Beaker, BarChart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuoteForm from '../components/QuoteForm';
import ServicesPreview from '../components/ServicesPreview';
import WhyChooseUsPreview from '../components/WhyChooseUsPreview';
import ClientsSection from '../components/ClientsSection';
import TestimonialCarousel from '../components/TestimonialCarousel';
import ContactCTA from '../components/ContactCTA';
import gtLabLogo from '../assets/GT_Lab_Logo_big.png';
import labFacility from '../assets/lab-facility.jpg';
const HomePage: React.FC = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const handleGetQuote = () => {
    setIsQuoteFormOpen(true);
  };
  return <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Side-by-Side Hero Section */}
        <section className="relative min-h-screen lg:min-h-[85vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-gray-100 overflow-hidden">
          {/* Animated Background Elements - Left Side Only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse blur-xl"></div>
            <div className="absolute top-40 left-1/4 w-24 h-64 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 rotate-45 animate-bounce delay-1000 blur-xl"></div>
            <div className="absolute bottom-20 left-1/6 w-40 h-20 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 rotate-12 animate-pulse delay-2000 blur-xl"></div>
            
            {/* Floating laboratory elements */}
            <div className="absolute top-1/4 left-1/3 animate-bounce delay-500">
              <Beaker className="w-6 h-6 text-primary opacity-60" />
            </div>
            <div className="absolute bottom-1/4 left-1/6 animate-bounce delay-700">
              <Shield className="w-5 h-5 text-accent opacity-50" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center">
              
              {/* LEFT: Content Column */}
              <div className="relative z-10 text-center lg:text-left animate-fade-in">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
                  <span className="block">Concrete Testing</span>
                  <span className="block"> </span>
                  <span className="block mt-4 md:mt-6 lg:mt-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">
                    For Mining Excellence
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed animate-fade-in delay-300">
                  Concrete testing services for mining and construction companies. Concrete, shotcrete, grout and backfill testing to Australian Standards with personal, professional service.
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  {['Australian Standards Compliant', 'High Quality Testing', 'Personal Service'].map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-white to-gray-50 rounded-full text-sm font-semibold text-gray-700 shadow-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-500">
                  <Link
                    to="/contact"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary via-accent to-primary text-white font-bold rounded-xl shadow-2xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">Request Testing Services</span>
                    <ArrowRight className="relative ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                  <Link
                    to="/services"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl border-2 border-transparent hover:from-white hover:to-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Learn About Services
                  </Link>
                </div>
              </div>

              {/* RIGHT: Photo Column */}
              <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-fade-in delay-300">
                <img 
                  src={labFacility} 
                  alt="Goldfields Testing Laboratory Facility" 
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
              </div>

            </div>
          </div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none animate-gradient-xy"></div>
        </section>

        {/* Services Preview Section */}
        <ServicesPreview />

        {/* Why Choose Us Preview Section */}
        <WhyChooseUsPreview />

        {/* Clients Section */}
        <ClientsSection />

        {/* Testimonial Carousel Section */}
        <TestimonialCarousel />

        {/* Contact CTA Section */}
        <ContactCTA />
      </main>

      <Footer />

      {/* Quote Form Modal */}
      <QuoteForm isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} />
    </div>;
};
export default HomePage;