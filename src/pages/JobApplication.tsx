import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Info, ArrowLeft, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Checkbox } from '../components/ui/checkbox';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  confirmEmail: z.string().email('Invalid email address'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(1, 'Phone number is required'),
  speaksLanguages: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  linkedin: z.string().optional(),
  workAuthorized: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  visaSponsorship: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  signature: z.string().min(1, 'Electronic signature is required'),
  date: z.date({ required_error: 'Date is required' }),
  gender: z.string().min(1, 'Gender selection is required'),
  raceEthnicity: z.string().min(1, 'Race/Ethnicity selection is required'),
  disability: z.enum(['yes', 'no', 'prefer-not-to-answer'], { required_error: 'This field is required' }),
  protectedVeteran: z.enum(['yes', 'no', 'prefer-not-to-answer'], { required_error: 'This field is required' }),
  privacyPolicyAgreed: z.boolean().refine(val => val === true, {
    message: 'You must read and agree to the privacy policy'
  }),
  resume: z.any().optional(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
  path: ["confirmEmail"],
});

type FormData = z.infer<typeof formSchema>;

interface JobApplicationProps {
  language: 'en' | 'es';
}

const JobApplication: React.FC<JobApplicationProps> = ({ language }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Job Application",
      backToCareers: "← Back to Careers",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      confirmEmail: "Confirm Email",
      city: "City",
      phone: "Phone Number",
      speaksLanguages: "Do you speak Spanish or Portuguese?",
      linkedin: "LinkedIn",
      workAuth: "Are you legally authorized to work in the country in which you are applying for a role?",
      visaSponsorship: "Do you now, or will you in the future, require visa sponsorship to work for ServiceNow in the country of hire?",
      disclaimer: "Any offer(s) of employment are contingent upon a satisfactory background check and drug test, which will be conducted in accordance with applicable legal regulations.",
      signatureText: "By typing your name into the signature box below, you are electronically signing this form to confirm that the above statements are true and accurate.",
      signature: "Name (Signature Field)",
      date: "Today's Date",
      gender: "Gender",
      raceEthnicity: "Race and Ethnicity",
      definitions: "definitions",
      resume: "Upload Resume",
      submit: "Submit Application",
      yes: "Yes",
      no: "No",
      disabilityQuestion: "Do you have (or have a history/record of having) a disability?",
      disabilityYes: "Yes, I have a disability, or have had one in the past.",
      disabilityNo: "No, I do not have a disability and have not had one in the past.",
      preferNotAnswer: "I do not want to answer.",
      reasonableAccommodation: "Reasonable Accommodation Notice",
      reasonableAccommodationText: "Federal law requires employers to provide reasonable accommodation to qualified individuals with disabilities. Please tell us if you require a reasonable accommodation to apply for a job or to perform your job. Examples of reasonable accommodation include making a change to the application process or work procedures, providing documents in an alternate format, using a sign language interpreter, or using specialized equipment.",
      protectedVeteran: "Are you a protected veteran?",
      privacyPolicyAgree: "By checking this box, you will declare that you read and understand the privacy policy of Kreative Theory."
    },
    es: {
      title: "Aplicación de Trabajo",
      backToCareers: "← Volver a Carreras",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      confirmEmail: "Confirmar Correo Electrónico",
      city: "Ciudad",
      phone: "Número de Teléfono",
      speaksLanguages: "¿Hablas español o portugués?",
      linkedin: "LinkedIn",
      workAuth: "¿Estás legalmente autorizado para trabajar en el país donde estás aplicando?",
      visaSponsorship: "¿Necesitas o necesitarás en el futuro patrocinio de visa para trabajar para ServiceNow en el país de contratación?",
      disclaimer: "Cualquier oferta de empleo está condicionada a una verificación de antecedentes y prueba de drogas satisfactoria, que se realizará de acuerdo con las regulaciones legales aplicables.",
      signatureText: "Al escribir tu nombre en el campo de firma a continuación, estás firmando electrónicamente este formulario para confirmar que las declaraciones anteriores son verdaderas y precisas.",
      signature: "Nombre (Campo de Firma)",
      date: "Fecha de Hoy",
      gender: "Género",
      raceEthnicity: "Raza y Etnicidad",
      definitions: "definiciones",
      resume: "Subir Currículum",
      submit: "Enviar Aplicación",
      yes: "Sí",
      no: "No",
      disabilityQuestion: "¿Tienes (o has tenido un historial de tener) una discapacidad?",
      disabilityYes: "Sí, tengo una discapacidad, o he tenido una en el pasado.",
      disabilityNo: "No, no tengo una discapacidad y no he tenido una en el pasado.",
      preferNotAnswer: "No quiero responder.",
      reasonableAccommodation: "Aviso de Acomodación Razonable",
      reasonableAccommodationText: "La ley federal requiere que los empleadores proporcionen acomodación razonable a individuos calificados con discapacidades. Por favor dinos si requieres una acomodación razonable para aplicar a un trabajo o para realizar tu trabajo. Ejemplos de acomodación razonable incluyen hacer un cambio en el proceso de aplicación o procedimientos de trabajo, proporcionar documentos en un formato alternativo, usar un intérprete de lenguaje de señas, o usar equipo especializado.",
      protectedVeteran: "¿Eres un veterano protegido?",
      privacyPolicyAgree: "Al marcar esta casilla, declararás que leíste y entiendes la política de privacidad de Kreative Theory."
    }
  };

  const t = content[language];

  const genderOptions = [
    'Male', 'Female', 'Non-binary', 'Prefer not to answer'
  ];

  const raceEthnicityOptions = [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Two or More Races',
    'Prefer not to answer'
  ];

  const raceDefinitions = `Definitions of Race and Ethnicity

American Indian or Alaska Native - A person having origins in any of the original peoples of North and South America (including Central America), and who maintain tribal affiliation or community attachment.

Asian - A person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian Subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam.

Black or African American - A person having origins in any of the black racial groups of Africa.

Hispanic or Latino - A person of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.

Native Hawaiian or Other Pacific Islander - A person having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands.

White - A person having origins in any of the original peoples of Europe, the Middle East, or North Africa.

Two or More Races - All persons who identify with more than one of the above races.`;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined, // Remove pre-filled date
      privacyPolicyAgreed: false,
      workAuthorized: undefined,
      visaSponsorship: undefined,
      disability: undefined,
      protectedVeteran: undefined,
      speaksLanguages: undefined,
    },
  });

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    onChange(formatted);
  };

  const extractResumeData = async (file: File) => {
    setIsExtractingData(true);
    
    console.log('Starting resume data extraction for file:', file.name, file.type);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Calling Supabase function...');
      const { data, error } = await supabase.functions.invoke('extract-resume-data', {
        body: formData,
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Info",
          description: "Unable to extract data from resume. Please fill the form manually.",
        });
        return;
      }

      if (data.message) {
        toast({
          title: "Info",
          description: data.message,
        });
        return;
      }

      // Auto-fill the form with extracted data
      let fieldsUpdated = 0;
      if (data.firstName) {
        form.setValue('firstName', data.firstName);
        fieldsUpdated++;
      }
      if (data.lastName) {
        form.setValue('lastName', data.lastName);
        fieldsUpdated++;
      }
      if (data.email) {
        form.setValue('email', data.email);
        form.setValue('confirmEmail', data.email);
        fieldsUpdated++;
      }
      if (data.city) {
        form.setValue('city', data.city);
        fieldsUpdated++;
      }
      if (data.phone) {
        form.setValue('phone', data.phone);
        fieldsUpdated++;
      }

      if (fieldsUpdated > 0) {
        toast({
          title: "Success",
          description: `Resume data extracted! ${fieldsUpdated} fields auto-filled.`,
        });
      } else {
        toast({
          title: "Info",
          description: "No personal information found in resume. Please fill the form manually.",
        });
      }
    } catch (error) {
      console.error('Error extracting resume data:', error);
      toast({
        title: "Info",
        description: "Unable to extract data from resume. Please fill the form manually.",
      });
    } finally {
      setIsExtractingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log('Starting form submission with data:', data);
    
    try {
      let resumeUrl = null;
      let resumeFilename = null;

      // Upload resume if provided
      if (uploadedFile) {
        console.log('Uploading resume file:', uploadedFile.name);
        const fileName = `${Date.now()}-${uploadedFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, uploadedFile);

        if (uploadError) {
          console.error('Error uploading resume:', uploadError);
          toast({
            title: "Error",
            description: "Failed to upload resume. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log('Resume uploaded successfully:', uploadData);
        resumeUrl = fileName;
        resumeFilename = uploadedFile.name;
      }

      // Save to database
      console.log('Saving to database...');
      const applicationData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        city: data.city,
        phone: data.phone,
        speaks_languages: data.speaksLanguages || null,
        linkedin: data.linkedin || null,
        work_authorized: data.workAuthorized,
        visa_sponsorship: data.visaSponsorship,
        signature: data.signature,
        date: data.date.toISOString().split('T')[0],
        gender: data.gender,
        race_ethnicity: data.raceEthnicity,
        disability_status: data.disability,
        veteran_status: data.protectedVeteran,
        privacy_policy_accepted: data.privacyPolicyAgreed,
        resume_url: resumeUrl,
        resume_filename: resumeFilename
      };
      
      console.log('Application data to be saved:', applicationData);
      
      const { data: insertData, error: dbError } = await supabase
        .from('job_applications')
        .insert(applicationData)
        .select();

      if (dbError) {
        console.error('Error saving application:', dbError);
        toast({
          title: "Error",
          description: `Failed to submit application: ${dbError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Application saved successfully:', insertData);
      
      // Send confirmation email to applicant
      try {
        console.log('Sending confirmation email...');
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-application-confirmation', {
          body: {
            candidateName: `${data.firstName} ${data.lastName}`,
            candidateEmail: data.email,
            position: "Brand Experience & Merch Coordinator"
          }
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't fail the whole process if email fails
        } else {
          console.log('Confirmation email sent successfully:', emailData);
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the whole process if email fails
      }

      // Send notification email to admin
      try {
        console.log('Sending admin notification email...');
        const { data: adminEmailData, error: adminEmailError } = await supabase.functions.invoke('notify-admin-application', {
          body: {
            candidateName: `${data.firstName} ${data.lastName}`,
            candidateEmail: data.email,
            position: "Brand Experience & Merch Coordinator",
            applicationDate: new Date().toLocaleDateString()
          }
        });

        if (adminEmailError) {
          console.error('Error sending admin notification email:', adminEmailError);
          // Don't fail the whole process if email fails
        } else {
          console.log('Admin notification email sent successfully:', adminEmailData);
        }
      } catch (adminEmailError) {
        console.error('Error sending admin notification email:', adminEmailError);
        // Don't fail the whole process if email fails
      }
      
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully! You should receive a confirmation email shortly.",
      });
      form.reset();
      setUploadedFile(null);
      navigate('/careers');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-montserrat">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <button 
            onClick={() => navigate('/careers')}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToCareers}
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Resume Upload */}
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-lg font-semibold">{t.resume} *</Label>
                {uploadedFile ? (
                  // Show uploaded file
                  <div className="border-2 border-primary/20 bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedFile(null);
                            form.setValue('resume', null);
                            const input = document.getElementById('resume') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show upload area
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    {isExtractingData ? (
                      <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
                    ) : (
                      <Upload className="mx-auto h-16 w-16 text-primary/60" />
                    )}
                    <div className="mt-4">
                      <label htmlFor="resume" className="cursor-pointer">
                        <span className="mt-2 block text-base font-medium text-gray-900">
                          {isExtractingData ? 'Extracting data from resume...' : 'Drop your resume here or click to upload'}
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG files
                        </span>
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log('File selected:', file.name, file.type, file.size);
                              setUploadedFile(file);
                              form.setValue('resume', file);
                              await extractResumeData(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.firstName} *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.lastName} *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.email} *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.confirmEmail} *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.city} *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.phone} *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="(000) 000-0000"
                            className="h-12"
                            onChange={(e) => handlePhoneChange(e.target.value, field.onChange)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Language and LinkedIn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="speaksLanguages"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">{t.speaksLanguages} *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="languages-yes" />
                              <Label htmlFor="languages-yes">{t.yes}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="languages-no" />
                              <Label htmlFor="languages-no">{t.no}</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t.linkedin}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://linkedin.com/in/yourprofile" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Legal Questions */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Legal Information</h2>
                
                <FormField
                  control={form.control}
                  name="workAuthorized"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">{t.workAuth} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="workAuth-yes" />
                            <Label htmlFor="workAuth-yes">{t.yes}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="workAuth-no" />
                            <Label htmlFor="workAuth-no">{t.no}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visaSponsorship"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">{t.visaSponsorship} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="visa-yes" />
                            <Label htmlFor="visa-yes">{t.yes}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="visa-no" />
                            <Label htmlFor="visa-no">{t.no}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pink-500">
                <p className="text-sm text-gray-700 mb-4">{t.disclaimer}</p>
                <p className="text-sm text-gray-700">{t.signatureText}</p>
              </div>

              {/* Signature and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">{t.signature} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Type your full name" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-base font-medium">{t.date} *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal h-12",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Demographics */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Demographics (Optional)</h2>
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">{t.gender} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="raceEthnicity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        {t.raceEthnicity}{' '}
                        <button
                          type="button"
                          onClick={() => setShowDefinitions(true)}
                          className="text-pink-600 hover:text-pink-700 underline text-sm"
                        >
                          ({t.definitions})
                        </button>
                        *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select race/ethnicity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {raceEthnicityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Disability Question */}
                <FormField
                  control={form.control}
                  name="disability"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">{t.disabilityQuestion} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="disability-yes" />
                            <Label htmlFor="disability-yes" className="text-sm">{t.disabilityYes}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="disability-no" />
                            <Label htmlFor="disability-no" className="text-sm">{t.disabilityNo}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prefer-not-to-answer" id="disability-prefer" />
                            <Label htmlFor="disability-prefer" className="text-sm">{t.preferNotAnswer}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reasonable Accommodation Notice */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{t.reasonableAccommodation}</h3>
                  <p className="text-sm text-blue-800">{t.reasonableAccommodationText}</p>
                </div>

                {/* Protected Veteran */}
                <FormField
                  control={form.control}
                  name="protectedVeteran"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">{t.protectedVeteran} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="veteran-yes" />
                            <Label htmlFor="veteran-yes">{t.yes}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="veteran-no" />
                            <Label htmlFor="veteran-no">{t.no}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prefer-not-to-answer" id="veteran-prefer" />
                            <Label htmlFor="veteran-prefer">{t.preferNotAnswer}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Privacy Policy */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacyPolicyAgreed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          {t.privacyPolicyAgree} *
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    t.submit
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Race/Ethnicity Definitions Dialog */}
          <Dialog open={showDefinitions} onOpenChange={setShowDefinitions}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Race and Ethnicity Definitions</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {raceDefinitions}
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;