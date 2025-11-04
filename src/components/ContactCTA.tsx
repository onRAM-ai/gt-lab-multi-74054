import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
const ContactCTA: React.FC = () => {
  return <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Contact us today for professional UCS testing services
            </p>
            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              
              <Link to="/contact" className="group inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="space-y-6">
            {[{
            icon: Phone,
            label: 'Call Us',
            value: '+61 8 9021 3333',
            action: 'tel:+61890213333',
            type: 'tel'
          }, {
            icon: Mail,
            label: 'Email Us',
            value: 'info@gtlabkalgoorlie.com',
            action: 'mailto:info@gtlabkalgoorlie.com',
            type: 'mailto'
          }, {
            icon: MapPin,
            label: 'Visit Us',
            value: 'Kalgoorlie, WA',
            action: '/contact',
            type: 'link'
          }].map((contact, index) => {
            const IconComponent = contact.icon;
            if (contact.type === 'link') {
              return <Link key={index} to={contact.action} className="group flex items-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {contact.label}
                      </div>
                      <div className="text-gray-300">
                        {contact.value}
                      </div>
                    </div>
                  </Link>;
            }
            return <a key={index} href={contact.action} className="group flex items-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {contact.label}
                    </div>
                    <div className="text-gray-300">
                      {contact.value}
                    </div>
                  </div>
                </a>;
          })}
          </div>
        </div>
      </div>
    </section>;
};
export default ContactCTA;