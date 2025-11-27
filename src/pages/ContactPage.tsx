import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Smartphone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/lib/supabase';
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    testingType: ''
  });
  const content = {
    en: {
      title: 'Request Testing Services',
      subtitle: 'Ready to ensure your concrete meets Australian Standards? Contact Goldfields Testing Laboratory for professional UCS testing services.',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Mining Company/Contractor',
        sampleQuantity: 'Number of Samples',
        testingTimeline: 'Testing Timeline Required',
        message: 'Project Details & Requirements',
        send: 'Send Testing Request',
        success: 'Testing request sent successfully! We\'ll contact you within 24 hours.',
        error: 'Please fill in all required fields.'
      },
      info: {
        title: 'Laboratory Information',
        address: '32 Vivian St, South Boulder, WA',
        phone: '+61 428 466 070',
        email: 'labmanager@gtlab.com.au',
        hours: 'Mon - Fri: 7:00 AM - 5:00 PM'
      },
      sampleDelivery: 'Sample Delivery Instructions',
      sampleInfo: 'Please contact us for sample delivery instructions and proper labelling requirements for Australian Standard compliance.',
      pageTitle: 'Contact Goldfields Testing Laboratory - Request UCS Testing Services',
      pageDescription: 'Contact Goldfields Testing Laboratory for professional concrete UCS testing services. Request quotes, sample delivery instructions, and Australian Standards compliant testing.',
      breadcrumb: 'Contact'
    },
    es: {
      title: 'Solicitar Servicios de Prueba',
      subtitle: '¿Listo para asegurar que tu concreto cumple con los Estándares Australianos? Contacta a Goldfields Testing Laboratory para servicios profesionales de pruebas UCS.',
      form: {
        name: 'Nombre Completo',
        email: 'Correo Electrónico',
        phone: 'Número de Teléfono',
        company: 'Empresa Minera/Contratista',
        sampleQuantity: 'Número de Muestras',
        testingTimeline: 'Cronograma de Pruebas Requerido',
        message: 'Detalles del Proyecto y Requisitos',
        send: 'Enviar Solicitud de Prueba',
        success: '¡Solicitud de prueba enviada exitosamente! Te contactaremos dentro de 24 horas.',
        error: 'Por favor completa todos los campos requeridos.'
      },
      info: {
        title: 'Información del Laboratorio',
        address: '32 Vivian St, South Boulder, WA',
        phone: '+61 428 466 070',
        email: 'labmanager@gtlab.com.au',
        hours: 'Lun - Vie: 7:00 AM - 5:00 PM'
      },
      sampleDelivery: 'Instrucciones de Entrega de Muestras',
      sampleInfo: 'Por favor contáctanos para instrucciones de entrega de muestras y requisitos de etiquetado adecuados para cumplimiento con Estándares Australianos.',
      pageTitle: 'Contactar Goldfields Testing Laboratory - Solicitar Servicios de Pruebas UCS',
      pageDescription: 'Contacta a Goldfields Testing Laboratory para servicios profesionales de pruebas UCS de concreto. Solicita cotizaciones, instrucciones de entrega de muestras, y pruebas conformes con estándares australianos.',
      breadcrumb: 'Contacto'
    }
  };

  // Set page title and meta description
  React.useEffect(() => {
    document.title = 'Contact Goldfields Testing Laboratory - Request UCS Testing Services';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Goldfields Testing Laboratory for professional concrete UCS testing services. Request quotes, sample delivery instructions, and Australian Standards compliant testing.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact Goldfields Testing Laboratory for professional concrete UCS testing services. Request quotes, sample delivery instructions, and Australian Standards compliant testing.';
      document.head.appendChild(meta);
    }
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          company: formData.company,
          message: formData.message,
          testingType: formData.testingType || 'Not specified'
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      if (data?.success) {
        toast.success('Testing request sent successfully! We\'ll contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          testingType: ''
        });
      } else {
        throw new Error(data?.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="py-20 bg-gray-50 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="hidden flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-sm font-medium text-gray-500">Contact</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Request Testing Services
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Contact Goldfields Testing Laboratory for professional UCS testing services.</p>
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
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field" required />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mining Company/Contractor *
                      </label>
                      <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors input-field" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Testing
                    </label>
                    <select name="testingType" value={formData.testingType} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors select-field">
                      <option value="">Select testing type</option>
                      <option value="Concrete Cylinders or Cubes (AS 1012.9 & 1012.12.1)">Concrete Cylinders or Cubes (AS 1012.9 & 1012.12.1)</option>
                      <option value="Shotcrete Cores (AS 1012.14)">Shotcrete Cores (AS 1012.14)</option>
                      <option value="Cement Grout - For cable bolt applications">Cement Grout - For cable bolt applications</option>
                      <option value="Backfill Testing - Paste or CAF cylinders">Backfill Testing - Paste or CAF cylinders</option>
                      <option value="Round Determinate Panel (ASTM C1550)">Round Determinate Panel (ASTM C1550)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Details & Requirements *
                    </label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none input-field" required placeholder="Please describe your project requirements, concrete specifications, and any special testing needs..."></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Testing Request'}
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Laboratory Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Location
                        </h3>
                        <p className="text-gray-600">
                          32 Vivian St, South Boulder, WA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Mobile
                        </h3>
                        <p className="text-gray-600">
                          +61 428 466 070
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Landline
                        </h3>
                        <p className="text-gray-600">
                          08 9093 2431
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Email
                        </h3>
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
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Business Hours
                        </h3>
                        <p className="text-gray-600">
                          Mon - Fri: 6:00 AM - 5:00 PM
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

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        What makes Goldfields Testing Laboratory different?
                      </h4>
                      <p className="text-gray-600">
                        Our team brings real operational mining experience, not just laboratory expertise. We understand mining requirements firsthand.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        What testing standards do you follow?
                      </h4>
                      <p className="text-gray-600">
                        We follow the relevant Australian or ASTM Standards for all concrete curing & testing procedures, ensuring compliance and reliability.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">How can samples be delivered to the laboratory?</h4>
                      <p className="text-gray-600">
                        Samples can be dropped off by the client or delivered via transport companies to the laboratory located at 32 Vivian St, South Boulder. The office is open from 6am-5pm, Monday to Friday.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        How should I pack samples for transport?
                      </h4>
                      <p className="text-gray-600">
                        GTL recommends that samples are transported so they remain damp and tightly packed to minimise any damage during transport.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        What information is required to be included with the samples?
                      </h4>
                      <p className="text-gray-600">
                        As a minimum we require the Company/Mine Name, Sample Cast Date and the Location/Batch Number where the samples were taken.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default ContactPage;