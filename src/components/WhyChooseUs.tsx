import React from 'react';
import { Users, MapPin, DollarSign, Shield, Wrench, Clock } from 'lucide-react';
import labFacility from '../assets/lab-facility.jpg';
import labTesting from '../assets/lab-testing.jpg';
import labEquipment from '../assets/lab-equipment.jpg';

const WhyChooseUs: React.FC = () => {
  const advantages = [
    {
      icon: Wrench,
      title: 'Operational Experience',
      description: 'Our team combines laboratory expertise with hands-on mining operations experience, providing insights that pure lab technicians cannot offer.',
      color: 'from-primary to-accent'
    },
    {
      icon: MapPin,
      title: 'Local Kalgoorlie Service',
      description: 'Based in the heart of the Goldfields, we provide faster turnaround times and understand local mining conditions and requirements.',
      color: 'from-primary to-accent'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'We have price-checked against our competitors and consistently match or beat their pricing while maintaining superior service quality.',
      color: 'from-primary to-accent'
    },
    {
      icon: Shield,
      title: 'Australian Standards Compliant',
      description: 'All our testing procedures strictly adhere to Australian Standards, ensuring your results meet regulatory and industry requirements.',
      color: 'from-primary to-accent'
    },
    {
      icon: Clock,
      title: 'Reliable Scheduling',
      description: 'Precise testing at 7, 14, and 28-day intervals with consistent, dependable reporting that fits your project timelines.',
      color: 'from-primary to-accent'
    },
    {
      icon: Users,
      title: 'Mining-Focused Service',
      description: 'We specialize exclusively in serving mining companies and contractors, understanding your unique operational challenges and requirements.',
      color: 'from-primary to-accent'
    }
  ];

  const handleContactUs = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="why-us" className="relative py-32 bg-white">
      {/* Subtle gold accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="block">Why Choose</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Goldfields Testing Laboratory
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            The Operational Advantage in Concrete Testing
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Unlike traditional laboratories run by technicians, Goldfields Testing Laboratory brings real-world mining operational experience to every test. We understand the demands of mining environments and provide testing services that truly serve your operational needs.
          </p>
        </div>

        {/* Featured Laboratory Images */}
        <div className="mb-16 animate-fade-in">
          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-6 group">
            <img 
              src={labFacility}
              alt="Australian Standards compliant testing facility"
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-3xl font-bold mb-2">State-of-the-Art Facility</h3>
              <p className="text-lg opacity-90">Professional mining ground support testing in Kalgoorlie</p>
            </div>
          </div>

          {/* Secondary Images Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl shadow-lg group">
              <img 
                src={labTesting}
                alt="Laboratory technician performing concrete testing"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-xl font-bold">Expert Testing</h4>
                <p className="text-sm opacity-90">AS standards compliant procedures</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-lg group">
              <img 
                src={labEquipment}
                alt="Quality control testing equipment"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-xl font-bold">Modern Equipment</h4>
                <p className="text-sm opacity-90">Calibrated testing instruments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div
                key={index}
                className="group bg-white border-2 border-primary/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
              </div>
            );
          })}
        </div>

        {/* Featured CTA Image */}
        <div className="mb-12 animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
            <img 
              src={labFacility}
              alt="Professional laboratory testing services in Kalgoorlie"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-3xl font-bold">Your Trusted Testing Partner</h3>
              <p className="text-lg opacity-90 mt-2">Delivering precision and reliability for mining operations</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl p-12 shadow-xl">
            <h3 className="text-4xl font-black text-gray-900 mb-4">
              Experience the Goldfields Testing Laboratory Difference
            </h3>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Ready to work with a laboratory that understands mining operations?
            </p>
            <button
              onClick={handleContactUs}
              className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
