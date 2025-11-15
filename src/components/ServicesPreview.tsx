import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import concreteSpecimens from '../assets/services/concrete-specimens.jpg';
import shotcreteCores from '../assets/services/shotcrete-cores.jpg';
import cementGrout from '../assets/services/cement-grout.jpg';
import backfillTesting from '../assets/services/backfill-testing.jpg';
const ServicesPreview: React.FC = () => {
  return <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Testing Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Concrete testing to Australian and ASTM standards</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[{
          title: 'Concrete Specimens',
          description: 'Compressive strength of concrete cylinders or cubes',
          image: concreteSpecimens
        }, {
          title: 'Shotcrete Cores',
          description: 'Compressive strength of shotcrete cores',
          image: shotcreteCores
        }, {
          title: 'Cement Grout',
          description: 'Compressive strength of cement grout cylinders or cubes',
          image: cementGrout
        }, {
          title: 'Backfill Testing',
          description: 'Compressive strength of backfill (paste or CAF) cylinders',
          image: backfillTesting
        }].map((service, index) => <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="aspect-video overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>)}
        </div>

        <div className="text-center">
          <Link to="/services" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary via-accent to-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            View All Services
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>;
};
export default ServicesPreview;