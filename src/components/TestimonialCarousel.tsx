import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Quote, Star, ArrowRight } from 'lucide-react';

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      text: "Goldfields Testing Laboratory has been our testing laboratory for over three years. Their consistency, reliability, and understanding of mining requirements make them a valuable partner",
      name: "Jen",
      company: "Geotechnical Engineer, Kambalda",
      rating: 5
    },
    {
      text: "We have recently started using Goldfields Testing Laboratory for all our QAQC testing. We have been impressed with their communications and feedback on the results.",
      name: "Matt",
      company: "Project Manager, Kalgoorlie",
      rating: 5
    },
    {
      text: "We have been using Goldfields Testing Laboratory for many years for our cable bolt grout UCS testing. Being local makes getting samples to the lab straightforward. They provide regular feedback on sample quality and promptly answer any questions we may have on the results",
      name: "Farhan",
      company: "Geotechnical Superintendent, Kalgoorlie",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Trusted by mining companies across Australia
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-center justify-center mb-8">
              <Quote className="w-12 h-12 text-primary/30" />
            </div>
            
            <div className="text-center">
              <p className="text-2xl text-gray-700 mb-8 leading-relaxed font-medium">
                "{testimonials[currentIndex].text}"
              </p>
              
              <div className="flex items-center justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-current" />
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="font-bold text-gray-900 text-xl">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-600 mt-2">
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-primary"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-primary"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/testimonials"
            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl border-2 border-transparent hover:from-white hover:to-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Read All Testimonials
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
