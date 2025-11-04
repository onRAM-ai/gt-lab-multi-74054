import React from 'react';
import { Shield, Award, CheckCircle } from 'lucide-react';

const Certifications: React.FC = () => {
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
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Standards & Compliance
          </h2>
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
            <h3 className="text-3xl font-bold mb-6">NATA Accreditation</h3>
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
      </div>
    </section>
  );
};

export default Certifications;
