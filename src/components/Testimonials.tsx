import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      company: 'Operations Manager, Goldfields Mining Co.',
      text: 'Goldfields Testing Laboratory\'s operational mining experience really shows in their testing approach. They understand our time constraints and provide results that help us make informed decisions quickly. Their Australian Standards compliance gives us confidence in every report.',
      rating: 5
    },
    {
      name: 'Mike Thompson',
      company: 'Project Engineer, Kalgoorlie Construction',
      text: 'The difference between Goldfields Testing Laboratory and other testing facilities is clear - they know mining operations. Their sample handling is professional, reporting is detailed, and turnaround times consistently meet our project deadlines.',
      rating: 5
    },
    {
      name: 'Rachel Davis',
      company: 'Quality Manager, Regional Contractors',
      text: 'We\'ve used several testing labs over the years, but Goldfields Testing Laboratory stands out for their competitive pricing and superior service quality. Their local presence in Kalgoorlie means faster service and better understanding of our needs.',
      rating: 5
    },
    {
      name: 'James Wilson',
      company: 'Site Supervisor, Mining Solutions Ltd.',
      text: 'Professional service from start to finish. Goldfields Testing Laboratory\'s team provides clear communication, detailed reports, and their operational experience helps us interpret results in practical terms for our concrete applications.',
      rating: 5
    }
  ];

  return (
    <section className="relative py-32 bg-secondary">
      {/* Subtle accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Industry Standards
          </h2>
          <p className="text-xl text-primary/80 max-w-3xl mx-auto">
            Trusted by mining companies across the Goldfields for reliable concrete testing services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
            >
              <div className="flex items-center mb-6">
                <Quote className="w-8 h-8 text-primary mr-4" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-white mb-6 leading-relaxed text-lg">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-white/20 pt-6">
                <div className="font-bold text-white text-lg">{testimonial.name}</div>
                {testimonial.company && (
                  <div className="text-primary/80">{testimonial.company}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 inline-block">
            <p className="text-white text-xl font-semibold mb-4">
              Ready to experience professional UCS testing?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Request Testing Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
