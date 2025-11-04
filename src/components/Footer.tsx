import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import gtLabLogo from '../assets/GT_Lab_Logo_big.png';
const Footer: React.FC = () => {
  const links = [{
    name: 'Home',
    href: '/'
  }, {
    name: 'About',
    href: '/about'
  }, {
    name: 'Services',
    href: '/services'
  }, {
    name: 'Why Choose Us',
    href: '/why-choose-us'
  }, {
    name: 'Testimonials',
    href: '/testimonials'
  }, {
    name: 'Contact',
    href: '/contact'
  }];
  const servicesList = [
    'Concrete Cylinders or Cubes',
    'Shotcrete Cores', 
    'Cement Grout',
    'Backfill Testing'
  ];
  const currentYear = new Date().getFullYear();
  return <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <img src={gtLabLogo} alt="Goldfields Testing Laboratory" className="h-12 w-auto mb-4" />
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary/80">32 Vivian St, South Boulder, WA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary/80">+61 428 466 070</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary/80">labmanager@gtlab.com.au</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link, index) => <li key={index}>
                  <Link to={link.href} className="text-primary/80 hover:text-primary transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Testing Services</h3>
            <ul className="space-y-3">
              {servicesList.map((service, index) => <li key={index}>
                  <span className="text-primary/80 text-sm">{service}</span>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-center">
          <p className="text-primary/80 text-sm">
            © {currentYear} Goldfields Testing Laboratory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;