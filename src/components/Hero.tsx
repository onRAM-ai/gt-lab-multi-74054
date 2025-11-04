import React, { useState } from 'react';
import { ArrowRight, Beaker, BarChart, Shield } from 'lucide-react';
import QuoteForm from './QuoteForm';
import gtLabLogo from '../assets/GT_Lab_Logo_big.png';

const Hero: React.FC = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const handleGetQuote = () => {
    window.location.href = '/#contact';
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes with mining colors */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-64 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 rotate-45 animate-bounce delay-1000 blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-20 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 rotate-12 animate-pulse delay-2000 blur-xl"></div>
        
        {/* Floating laboratory elements */}
        <div className="absolute top-1/4 left-1/3 animate-bounce delay-500">
          <Beaker className="w-6 h-6 text-primary opacity-60" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-bounce delay-1500">
          <BarChart className="w-4 h-4 text-secondary opacity-40" />
        </div>
        <div className="absolute top-1/2 left-1/6 animate-bounce delay-700">
          <Shield className="w-5 h-5 text-accent opacity-50" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content with slide-in animation */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
              <span className="block animate-fade-in">Precision</span>
              <span className="block animate-fade-in">Concrete Testing</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">
                For Mining Excellence
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed animate-fade-in delay-300">
              Professional Uniaxial Compressive Strength (UCS) testing services for mining companies. Australian Standard compliant, backed by operational mining experience.
            </p>

            {/* Floating Feature Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {['Australian Standard Compliant', 'Operational Experience', 'Competitive Pricing'].map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-white to-gray-50 rounded-full text-sm font-semibold text-gray-700 shadow-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-500">
              <button
                onClick={handleGetQuote}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary via-accent to-primary text-white font-bold rounded-xl shadow-2xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Get Your Samples Tested</span>
                <ArrowRight className="relative ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <a
                href="#services"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl border-2 border-transparent hover:from-white hover:to-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Learn About Process
              </a>
            </div>
          </div>

          {/* Enhanced Logo Section */}
          <div className="flex justify-center lg:justify-end animate-fade-in delay-700">
            <div className="relative group">
              {/* Multiple gradient layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-3xl scale-150 animate-pulse-once"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-2xl scale-125 animate-pulse-once delay-1000"></div>
              
              {/* Floating ring animation - only on hover */}
              <div className="absolute inset-0 border-4 border-gradient-to-r from-primary/50 to-transparent rounded-full group-hover:animate-spin" style={{ animationDuration: '10s' }}></div>
              
              <img 
                src={gtLabLogo}
                alt="Goldfields Testing Laboratory Logo"
                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-float-once"
              />
              
              {/* Orbiting elements */}
              <div className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-8 left-8 w-3 h-3 bg-gradient-to-r from-accent to-secondary rounded-full animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none animate-gradient-xy"></div>

      {/* Quote Form Modal */}
      <QuoteForm 
        isOpen={isQuoteFormOpen} 
        onClose={() => setIsQuoteFormOpen(false)} 
      />
    </section>
  );
};

export default Hero;
