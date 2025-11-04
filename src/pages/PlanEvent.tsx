import React, { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

interface PlanEventProps {
  language: 'en' | 'es';
}

const PlanEvent: React.FC<PlanEventProps> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    name: '',
    date: '',
    time: '',
    duration: 1,
    location: '',
    guests: 50,
    budget: 5000
  });
  const [selectedElements, setSelectedElements] = useState<{ [key: string]: boolean }>({});
  const [contactInfo, setContactInfo] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');

  const content = {
    en: {
      steps: ['Event Details', 'Select Elements', 'Contact Information'],
      eventDetails: {
        title: 'Let’s start with your event details',
        name: 'Event Name',
        date: 'Date',
        time: 'Time',
        duration: 'Duration (days)',
        location: 'Location',
        guests: 'Number of Guests',
        budget: 'Budget ($)'
      },
      selectElements: {
        title: 'Select elements for your event',
        services: {
          Catering: 'Catering',
          Decorations: 'Decorations',
          Entertainment: 'Entertainment',
          Photography: 'Photography',
          Videography: 'Videography',
          Transportation: 'Transportation',
          Accommodation: 'Accommodation',
          Security: 'Security',
          AVEquipment: 'AV Equipment',
          Staffing: 'Staffing',
          Marketing: 'Marketing',
          Gifts: 'Gifts'
        },
        aiPromptLabel: 'Describe your event in detail for AI suggestions',
        aiButton: 'Get AI Suggestions'
      },
      contactInformation: {
        title: 'Your contact information',
        name: 'Name',
        company: 'Company',
        email: 'Email',
        phone: 'Phone',
        submit: 'Submit'
      }
    },
    es: {
      steps: ['Detalles del Evento', 'Seleccionar Elementos', 'Información de Contacto'],
      eventDetails: {
        title: 'Empecemos con los detalles de tu evento',
        name: 'Nombre del Evento',
        date: 'Fecha',
        time: 'Hora',
        duration: 'Duración (días)',
        location: 'Ubicación',
        guests: 'Número de Invitados',
        budget: 'Presupuesto ($)'
      },
      selectElements: {
        title: 'Selecciona elementos para tu evento',
        services: {
          Catering: 'Catering',
          Decorations: 'Decoraciones',
          Entertainment: 'Entretenimiento',
          Photography: 'Fotografía',
          Videography: 'Videografía',
          Transportation: 'Transporte',
          Accommodation: 'Alojamiento',
          Security: 'Seguridad',
          AVEquipment: 'Equipo AV',
          Staffing: 'Personal',
          Marketing: 'Marketing',
          Gifts: 'Regalos'
        },
        aiPromptLabel: 'Describe tu evento en detalle para sugerencias de la IA',
        aiButton: 'Obtener Sugerencias de la IA'
      },
      contactInformation: {
        title: 'Tu información de contacto',
        name: 'Nombre',
        company: 'Empresa',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        submit: 'Enviar'
      }
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleEventInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventInfo({ ...eventInfo, [e.target.name]: e.target.value });
  };

  const handleElementSelect = (element: string) => {
    setSelectedElements({ ...selectedElements, [element]: !selectedElements[element] });
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleAiPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const handleGetAiSuggestions = async () => {
    // Simulate AI suggestions
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAiSuggestions('AI suggestions based on your prompt.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const message = `Hello! I'd like to plan an event with the following details:
    
Event: ${eventInfo.name}
Date: ${eventInfo.date}
Time: ${eventInfo.time}
Duration: ${eventInfo.duration} days
Location: ${eventInfo.location}
Guests: ${eventInfo.guests}
Budget: $${eventInfo.budget}

Selected Services: ${Object.entries(selectedElements)
  .filter(([_, selected]) => selected)
  .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim())
  .join(', ')}

AI Recommendations: ${aiSuggestions}

Name: ${contactInfo.name}
Company: ${contactInfo.company}
Email: ${contactInfo.email}
Phone: ${contactInfo.phone}

Please contact me to discuss this event further.`;

    const phoneNumber = contactInfo.phone || '14079175581';
    const whatsappUrl = `https://wa.me/${phoneNumber.toString().replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setIsSubmitting(false);
    
    toast.success(language === 'en' 
      ? 'Event plan sent successfully! We\'ll contact you soon.' 
      : '¡Plan de evento enviado exitosamente! Te contactaremos pronto.'
    );
    
    // Reset form after successful submission
    setTimeout(() => {
      setCurrentStep(1);
      setEventInfo({ name: '', date: '', time: '', duration: 1, location: '', guests: 50, budget: 5000 });
      setSelectedElements({});
      setContactInfo({ name: '', company: '', email: '', phone: '' });
      setAiPrompt('');
      setAiSuggestions('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Stepper */}
        <div className="bg-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Progress">
              <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {content[language].steps.map((step, index) => (
                  <li className="md:flex-1" key={index}>
                    <div className="relative">
                      {index < currentStep - 1 ? (
                        <>
                          <div className="absolute top-4 left-0 w-full h-0.5 bg-green-600" aria-hidden="true"></div>
                          <a href="#" className="group flex items-center">
                            <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <span className="ml-4 text-sm font-medium text-green-600 group-hover:text-green-800">{step}</span>
                          </a>
                        </>
                      ) : index === currentStep - 1 ? (
                        <>
                          <div className="absolute top-4 left-0 w-full h-0.5 bg-pink-300" aria-hidden="true"></div>
                          <a href="#" className="flex items-center" aria-current="step">
                            <span className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white">{index + 1}</span>
                            </span>
                            <span className="ml-4 text-sm font-semibold text-pink-600">{step}</span>
                          </a>
                        </>
                      ) : (
                        <>
                          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
                          <a href="#" className="group flex items-center">
                            <span className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-500">{index + 1}</span>
                            </span>
                            <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-700">{step}</span>
                          </a>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <div className="p-10">
          {/* Step 1: Event Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{content[language].eventDetails.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.name}</label>
                  <input type="text" name="name" value={eventInfo.name} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.date}</label>
                  <input type="date" name="date" value={eventInfo.date} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.time}</label>
                  <input type="time" name="time" value={eventInfo.time} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.duration}</label>
                  <input type="number" name="duration" value={eventInfo.duration} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.location}</label>
                  <input type="text" name="location" value={eventInfo.location} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.guests}</label>
                  <input type="number" name="guests" value={eventInfo.guests} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].eventDetails.budget}</label>
                  <input type="number" name="budget" value={eventInfo.budget} onChange={handleEventInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={nextStep} className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                  {language === 'en' ? 'Next' : 'Siguiente'}
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Elements */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{content[language].selectElements.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(content[language].selectElements.services).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={`element-${key}`}
                      type="checkbox"
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      checked={selectedElements[key] || false}
                      onChange={() => handleElementSelect(key)}
                    />
                    <label htmlFor={`element-${key}`} className="ml-3 block text-sm text-gray-700">
                      {value}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700">{content[language].selectElements.aiPromptLabel}</label>
                <div className="mt-1">
                  <textarea
                    id="ai-prompt"
                    rows={3}
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={aiPrompt}
                    onChange={handleAiPromptChange}
                  />
                </div>
                <button
                  onClick={handleGetAiSuggestions}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  {content[language].selectElements.aiButton}
                </button>
                {aiSuggestions && <p className="mt-2 text-sm text-gray-500">{aiSuggestions}</p>}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={prevStep} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                  {language === 'en' ? 'Previous' : 'Anterior'}
                </button>
                <button onClick={nextStep} className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                  {language === 'en' ? 'Next' : 'Siguiente'}
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{content[language].contactInformation.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].contactInformation.name}</label>
                  <input type="text" name="name" value={contactInfo.name} onChange={handleContactInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].contactInformation.company}</label>
                  <input type="text" name="company" value={contactInfo.company} onChange={handleContactInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].contactInformation.email}</label>
                  <input type="email" name="email" value={contactInfo.email} onChange={handleContactInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{content[language].contactInformation.phone}</label>
                  <input type="tel" name="phone" value={contactInfo.phone} onChange={handleContactInfoChange} className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={prevStep} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                  {language === 'en' ? 'Previous' : 'Anterior'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  {isSubmitting ? (
                    language === 'en' ? 'Submitting...' : 'Enviando...'
                  ) : (
                    <>
                      {content[language].contactInformation.submit}
                      <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanEvent;
