import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Info, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
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
  speaksLanguages: z.enum(['yes', 'no']).optional(),
  linkedin: z.string().optional(),
  workAuthorized: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  visaSponsorship: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  signature: z.string().min(1, 'Electronic signature is required'),
  date: z.date({ required_error: 'Date is required' }),
  gender: z.string().min(1, 'Gender selection is required'),
  raceEthnicity: z.string().min(1, 'Race/Ethnicity selection is required'),
  disabilityStatus: z.enum(['yes', 'no', 'prefer-not-to-answer'], { required_error: 'This field is required' }),
  veteranStatus: z.enum(['yes', 'no', 'prefer-not-to-answer'], { required_error: 'This field is required' }),
  privacyPolicyAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy'
  }),
  resume: z.any().optional(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
  path: ["confirmEmail"],
});

type FormData = z.infer<typeof formSchema>;

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'es';
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ isOpen, onClose, language }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const content = {
    en: {
      title: "Job Application",
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
      no: "No"
    },
    es: {
      title: "Aplicación de Trabajo",
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
      no: "No"
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
      date: new Date(),
      privacyPolicyAccepted: false,
      workAuthorized: undefined,
      visaSponsorship: undefined,
      disabilityStatus: undefined,
      veteranStatus: undefined,
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
          title: "Error",
          description: "Unable to connect to extraction service. Please fill the form manually.",
          variant: "destructive",
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
        title: "Error",
        description: "Failed to extract data from resume. Please fill the form manually.",
        variant: "destructive",
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
        disability_status: data.disabilityStatus,
        veteran_status: data.veteranStatus,
        privacy_policy_accepted: data.privacyPolicyAccepted,
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
      
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      });
      form.reset();
      setUploadedFile(null);
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{t.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Resume Upload */}
            <div className="space-y-2">
              <Label htmlFor="resume">{t.resume} *</Label>
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
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {isExtractingData ? (
                  <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-primary/60" />
                )}
                <div className="mt-4">
                  <label htmlFor="resume" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {isExtractingData ? 'Extracting data from resume...' : 'Drop your resume here or click to upload'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.firstName} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t.lastName} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t.email} *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>{t.confirmEmail} *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>{t.city} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t.phone} *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(000) 000-0000"
                        onChange={(e) => handlePhoneChange(e.target.value, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <FormField
              control={form.control}
              name="speaksLanguages"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t.speaksLanguages}</FormLabel>
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
                  <FormLabel>{t.linkedin}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://linkedin.com/in/yourprofile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Yes/No Questions */}
            <FormField
              control={form.control}
              name="workAuthorized"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t.workAuth} *</FormLabel>
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
                  <FormLabel>{t.visaSponsorship} *</FormLabel>
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

            {/* Disclaimer */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">{t.disclaimer}</p>
              <p className="text-sm text-gray-700">{t.signatureText}</p>
            </div>

            {/* Signature and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signature} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Type your full name" />
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
                    <FormLabel>{t.date} *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.gender} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                  <FormLabel className="flex items-center gap-2">
                    {t.raceEthnicity} *
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm text-blue-600 underline"
                      onClick={() => setShowDefinitions(true)}
                    >
                      ({t.definitions})
                    </Button>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

            {/* Disability Status */}
            <FormField
              control={form.control}
              name="disabilityStatus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Do you have (or have a history/record of having) a disability? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="disability-yes" />
                        <Label htmlFor="disability-yes">Yes, I have a disability, or have had one in the past.</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="disability-no" />
                        <Label htmlFor="disability-no">No, I do not have a disability and have not had one in the past.</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-answer" id="disability-prefer" />
                        <Label htmlFor="disability-prefer">I do not want to answer.</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reasonable Accommodation Notice */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Reasonable Accommodation Notice</h4>
              <p className="text-sm text-blue-800">
                Federal law requires employers to provide reasonable accommodation to qualified individuals with disabilities. 
                Please tell us if you require a reasonable accommodation to apply for a job or to perform your job. 
                Examples of reasonable accommodation include making a change to the application process or work procedures, 
                providing documents in an alternate format, using a sign language interpreter, or using specialized equipment.
              </p>
            </div>

            {/* Veteran Status */}
            <FormField
              control={form.control}
              name="veteranStatus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Are you a protected veteran? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="veteran-yes" />
                        <Label htmlFor="veteran-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="veteran-no" />
                        <Label htmlFor="veteran-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-answer" id="veteran-prefer" />
                        <Label htmlFor="veteran-prefer">Prefer not to answer</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privacy Policy */}
            <FormField
              control={form.control}
              name="privacyPolicyAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      Please review the{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                      >
                        Kreative Theory Privacy Policy
                      </a>
                      . By checking this box, you will declare that you read and understand the privacy policy of Kreative Theory. *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Definitions of Race and Ethnicity
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDefinitions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {raceDefinitions}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;