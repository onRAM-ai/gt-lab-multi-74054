import React, { useState } from 'react';
import { MapPin, Users, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface CareersProps {
  language: 'en' | 'es';
}

const Careers: React.FC<CareersProps> = ({ language }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es'>(language);

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setCurrentLanguage(lang);
  };
  const content = {
    en: {
      title: "JOIN THE TEAM.",
      subtitle: "BE A PART OF THE PURPOSE.",
      jobTitle: "Branded Merch Specialist",
      location: "Orlando, FL (Hybrid or Remote Considered)",
      reportsTo: "Creative Director / Founder",
      company: "Kreative Theory",
      aboutRole: "ABOUT THE ROLE",
      whatYoullDo: "WHAT YOU'LL DO:",
      youllLove: "YOU'LL LOVE THIS ROLE IF YOU ARE",
      qualifications: "QUALIFICATIONS",
      applyNow: "Apply Now"
    },
    es: {
      title: "ÚNETE AL EQUIPO.",
      subtitle: "SÉ PARTE DEL PROPÓSITO.",
      jobTitle: "Coordinador de Experiencia de Marca y Mercadeo",
      location: "Orlando, FL (Híbrido o Remoto Considerado)",
      reportsTo: "Director Creativo / Fundador",
      company: "Kreative Theory",
      aboutRole: "SOBRE EL PUESTO",
      whatYoullDo: "LO QUE HARÁS:",
      youllLove: "TE ENCANTARÁ ESTE PUESTO SI ERES",
      qualifications: "CALIFICACIONES",
      applyNow: "Aplicar Ahora"
    }
  };

  const t = content[currentLanguage];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-500 to-purple-600 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-2xl md:text-3xl font-light opacity-90">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Job Header */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.jobTitle}
              </h2>
              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  <span>{t.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  <span>Reports to: {t.reportsTo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-500" />
                  <span>Company: {t.company}</span>
                </div>
              </div>
            </div>

            {/* About the Role */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.aboutRole}</h3>
              <p className="text-gray-700 leading-relaxed">
                Kreative Theory is seeking a proactive and creative Branded Merch Specialist to join our team.
                This role is perfect for someone who loves branded merchandise, enjoys connecting with clients,
                and thrives on finding creative, on brand product solutions that deliver impact.
                You'll be responsible for researching unique merchandise options, managing supplier
                communications, preparing proposals, and helping grow client accounts through excellent
                service and follow-through.
                If you have a passion for branded merch, a flair for creative problem-solving, and the drive to
                keep clients happy and engaged, we'd love to meet you!
              </p>
            </div>

            {/* What You'll Do */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.whatYoullDo}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Branded Merchandise Research & Sourcing</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Research and recommend unique, relevant, and out-of-the-box merchandise tailored to client industries (especially private aviation, luxury, and events).</li>
                    <li>• Understand and interpret client brand values to recommend merch that aligns with their identity.</li>
                    <li>• Source samples, request pricing, and build vendor relationships for effective and timely quoting.</li>
                  </ul>
                </div>


                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Client & Vendor Communication</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Support sales efforts by helping follow up on quotes, orders, and timelines.</li>
                    <li>• Join client calls to help brainstorm merch ideas and provide support on creative direction.</li>
                    <li>• Manage supplier communication for pricing, samples, and updates on custom jobs.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* You'll Love This Role */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.youllLove}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Detail-oriented and organized, yet creative and full of ideas</li>
                <li>• Comfortable juggling multiple tasks and clients while keeping a sharp eye on deadlines.</li>
                <li>• Obsessed with branded merchandise, aesthetics, and finding the perfect product.</li>
                <li>• Comfortable engaging directly with clients and suppliers in a professional, friendly way</li>
                <li>• Experienced in Canva, and/or Monday.com (bonus points for all!).</li>
                <li>• Bonus: You speak English, Portuguese and/or Spanish</li>
              </ul>
            </div>

            {/* Qualifications */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.qualifications}</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Experience working with branded merchandise, product sourcing, or promotional products is a huge plus</li>
                <li>• Familiarity with branded merchandise or promotional products industry preferred</li>
                <li>• Excellent written and verbal communication skills</li>
                <li>• Bonus: Sales or account management experience</li>
              </ul>
            </div>

            {/* Apply Button */}
            <div className="text-center">
              <a 
                href="/job-application"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t.applyNow}
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Careers;