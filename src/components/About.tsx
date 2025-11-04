import React from 'react';
import { Users, Target, Award, Clock } from 'lucide-react';
import gtLabLogo from '../assets/gt-lab-logo.jpg';
import labInterior from '../assets/lab-interior.jpg';
import labTesting from '../assets/lab-testing.jpg';
import labEquipment from '../assets/lab-equipment.jpg';

const About: React.FC = () => {
  const stats = [
    { icon: Users, number: '30+', label: 'Mining Clients' },
    { icon: Award, number: '5000+', label: 'Samples Tested' },
    { icon: Target, number: '100%', label: 'Standards Compliant' },
    { icon: Clock, number: '7/14/28', label: 'Day Testing' }
  ];

  return (
    <section id="about" className="relative py-32 bg-white">
      {/* Subtle gold accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content with slide-in animations */}
          <div className="space-y-8">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                <span className="block">About Goldfields</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Testing Laboratory
                </span>
              </h2>
              <h3 className="text-2xl text-gray-700 font-light italic">
                Your Trusted Partner in Mining Ground Support Quality Control
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                Goldfields Testing Laboratory are a Kalgoorlie based laboratory specialising in mining ground support quality control testing. We provide high quality testing of shotcrete and cable bolt grout materials.

Our well-trained staff ensure that your test results are accurate, reliable and on time. We pride ourselves on our ability to provide you with a personal yet professional service.
              </p>
            </div>

            {/* Mission & Vision with cards */}
            <div className="space-y-6 animate-fade-in delay-300">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  Mission
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  To provide accurate and reliable ground support quality control testing services that mining companies can trust. We combine laboratory excellence with personal service to deliver results that meet your ground support QAQC requirements.
                </p>
              </div>
              <div className="bg-gradient-to-r from-accent/5 to-primary/5 border-2 border-accent/20 rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 transform hover:scale-105">
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse delay-500"></span>
                  Vision
                </h4>
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
              <img 
                src={labInterior}
                alt="Professional concrete testing laboratory interior"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6 animate-fade-in delay-700">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                <img 
                  src={labTesting}
                  alt="Laboratory technician testing concrete cylinders"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                <img 
                  src={labEquipment}
                  alt="Concrete test cylinders and quality control equipment"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 gap-6 animate-fade-in delay-700">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-2"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
