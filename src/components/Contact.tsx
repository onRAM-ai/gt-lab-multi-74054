import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    sampleQuantity: '',
    testingTimeline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || 'Not provided',
            company: formData.company,
            source: 'Goldfields Testing Laboratory Website',
            status: 'New',
            notes: `Samples: ${formData.sampleQuantity || 'Not specified'}, Timeline: ${formData.testingTimeline || 'Not specified'}`,
            message: formData.message
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Error submitting form. Please try again.');
        return;
      }

      console.log('Lead saved to Supabase:', data);
      toast.success('Testing request sent successfully! We\'ll contact you within 24 hours.');
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        company: '', 
        message: '',
        sampleQuantity: '',
        testingTimeline: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Request Testing Services
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Ready to ensure your concrete meets Australian Standards? Contact Goldfields Testing Laboratory for professional UCS testing services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mining Company/Contractor *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Samples
                  </label>
                  <select
                    name="sampleQuantity"
                    value={formData.sampleQuantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors select-field"
                  >
                    <option value="">Select quantity</option>
                    <option value="1-10">1-10 samples</option>
                    <option value="11-25">11-25 samples</option>
                    <option value="26-50">26-50 samples</option>
                    <option value="50+">50+ samples</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testing Timeline Required
                  </label>
                  <select
                    name="testingTimeline"
                    value={formData.testingTimeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors select-field"
                  >
                    <option value="">Select timeline</option>
                    <option value="7-day">7-day testing</option>
                    <option value="14-day">14-day testing</option>
                    <option value="28-day">28-day testing</option>
                    <option value="7-14-28-day">Full 7, 14, 28-day series</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details & Requirements *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none input-field"
                  required
                  placeholder="Please describe your project requirements, concrete specifications, and any special testing needs..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
              >
                Send Testing Request
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Laboratory Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Location
                    </h4>
                    <p className="text-gray-600">
                      32 Vivian St, South Boulder, WA
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Phone
                    </h4>
                    <p className="text-gray-600">
                      +61 428 466 070
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Email
                    </h4>
                    <p className="text-gray-600">
                      labmanager@gtlab.com.au
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h4>
                    <p className="text-gray-600">
                      Mon - Fri: 7:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Delivery Information */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Sample Delivery Instructions
              </h3>
              <p className="opacity-90 leading-relaxed">
                Please contact us for sample delivery instructions and proper labelling requirements for Australian Standard compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
