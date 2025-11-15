import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Award, Users, Clock, MapPin } from "lucide-react";
import labFacility from "../assets/lab-facility.jpg";
const WhyChooseUsPreview: React.FC = () => {
  return <section className="py-20 bg-white">
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
          {[{
          number: "30+",
          label: "Mining Focused"
        }, {
          icon: MapPin,
          label: "Kalgoorlie Local"
        }].map((stat, index) => <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                {stat.icon ? <stat.icon className="w-12 h-12 md:w-16 md:h-16 inline-block" /> : stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>)}
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[{
          icon: Award,
          title: "Australian Standard Compliant",
          description: "All testing procedures follows AS and ASTM standards for guranteed reliability"
        }, {
          icon: Users,
          title: "Over 60+yrs of operational and technical mining experience",
          description: "As Kalgoorlie locals, we're right where you need us - delivering fast, reliable service without the delays of distant labs"
        }, {
          icon: Clock,
          title: "Fast & Reliable Results",
          description: "Located in Kalgoorlie to ensure fast and reliable results"
        }].map((highlight, index) => {
          const IconComponent = highlight.icon;
          return <div key={index} className="group text-center p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{highlight.title}</h3>

                <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
              </div>;
        })}
        </div>

        <div className="text-center">
          
        </div>
      </div>
    </section>;
};
export default WhyChooseUsPreview;