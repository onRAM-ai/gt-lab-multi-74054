import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Award, Users, Clock, MapPin } from "lucide-react";
import labFacility from "../assets/lab-facility.jpg";

const WhyChooseUsPreview: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Goldfields Testing</span>{" "}
            <span className="text-gray-900">Laboratory?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the difference of professional concrete testing
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 mb-16">
          {[
            { number: "30+", label: "Mining Focused" },
            { icon: MapPin, label: "Kalgoorlie Local" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                {stat.icon ? <stat.icon className="w-12 h-12 md:w-16 md:h-16 inline-block" /> : stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Laboratory Image */}
        <div className="mb-16 relative overflow-hidden rounded-3xl shadow-2xl group animate-fade-in">
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

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Award,
              title: "Australian Standard Compliant",
              description: "All testing procedures follow AS standards for guaranteed reliability",
            },
            {
              icon: Users,
              title: "Over 60+yrs of operational and technical mining experience",
              description:
                "As Kalgoorlie locals, we're right where you need us - delivering fast, reliable service without the delays of distant labs",
            },
            {
              icon: Clock,
              title: "Fast & Reliable Results",
              description: "Located in Kalgoorlie to ensure fast and reliable results",
            },
          ].map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div key={index} className="group text-center p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{highlight.title}</h3>

                <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/why-choose-us"
            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl border-2 border-transparent hover:from-white hover:to-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Discover More Benefits
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsPreview;
