import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WebsiteData {
  domain: string;
  deadline: Date | null;
  websiteTypes: string[];
  features: string[];
  hasContent: 'yes' | 'no' | '';
  hasLogo: 'yes' | 'no' | '';
  needsLogoCreation: 'yes' | 'no' | '';
  logoPreferences: {
    colors: string;
    style: string;
    industry: string;
    inspirations: string;
  };
  isLandingPage: 'yes' | 'no' | '';
  pageCount: number;
  menuItems: string[];
  needsMonthlyMaintenance: 'yes' | 'no' | '';
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  websites: WebsiteData[];
}

const WEBSITE_TYPES = [
  'WordPress',
  'HTML',
  'Wix',
  'CMS',
  'PHP',
  'React',
  'Next.js',
  'Shopify',
  'Squarespace',
  'Custom Development'
];

const LOGO_STYLES = [
  'Modern & Minimalist',
  'Classic & Professional',
  'Creative & Artistic',
  'Bold & Strong',
  'Elegant & Sophisticated',
  'Fun & Playful'
];

const WebsiteQuote = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    websites: [{
      domain: '',
      deadline: null,
      websiteTypes: [],
      features: [],
      hasContent: '',
      hasLogo: '',
      needsLogoCreation: '',
      logoPreferences: {
        colors: '',
        style: '',
        industry: '',
        inspirations: ''
      },
      isLandingPage: '',
      pageCount: 1,
      menuItems: ['HOME'],
      needsMonthlyMaintenance: ''
    }]
  });
  
  const [newFeature, setNewFeature] = useState<string[]>([]);

  const updateWebsite = (index: number, field: keyof WebsiteData, value: any) => {
    const updatedWebsites = [...formData.websites];
    updatedWebsites[index] = { ...updatedWebsites[index], [field]: value };
    
    // Auto-generate menu items based on page count
    if (field === 'pageCount') {
      const menuSuggestions = ['HOME', 'ABOUT US', 'SERVICES', 'CONTACT US', 'PORTFOLIO', 'BLOG', 'FAQ'];
      const menuItems = menuSuggestions.slice(0, value);
      updatedWebsites[index].menuItems = menuItems;
    }
    
    // Reset logo creation if they have a logo
    if (field === 'hasLogo' && value === 'yes') {
      updatedWebsites[index].needsLogoCreation = 'no';
      updatedWebsites[index].logoPreferences = {
        colors: '',
        style: '',
        industry: '',
        inspirations: ''
      };
    }
    
    setFormData({ ...formData, websites: updatedWebsites });
  };

  const updateLogoPreference = (websiteIndex: number, field: keyof WebsiteData['logoPreferences'], value: string) => {
    const updatedWebsites = [...formData.websites];
    updatedWebsites[websiteIndex].logoPreferences = {
      ...updatedWebsites[websiteIndex].logoPreferences,
      [field]: value
    };
    setFormData({ ...formData, websites: updatedWebsites });
  };

  const addWebsite = () => {
    setFormData({
      ...formData,
      websites: [...formData.websites, {
        domain: '',
        deadline: null,
        websiteTypes: [],
        features: [],
        hasContent: '',
        hasLogo: '',
        needsLogoCreation: '',
        logoPreferences: {
          colors: '',
          style: '',
          industry: '',
          inspirations: ''
        },
        isLandingPage: '',
        pageCount: 1,
        menuItems: ['HOME'],
        needsMonthlyMaintenance: ''
      }]
    });
    setNewFeature([...newFeature, '']);
  };

  const removeWebsite = (index: number) => {
    if (formData.websites.length > 1) {
      const updatedWebsites = formData.websites.filter((_, i) => i !== index);
      setFormData({ ...formData, websites: updatedWebsites });
      
      const updatedNewFeature = newFeature.filter((_, i) => i !== index);
      setNewFeature(updatedNewFeature);
    }
  };

  const addFeature = (websiteIndex: number) => {
    if (newFeature[websiteIndex]?.trim()) {
      const updatedWebsites = [...formData.websites];
      updatedWebsites[websiteIndex].features.push(newFeature[websiteIndex].trim());
      setFormData({ ...formData, websites: updatedWebsites });
      
      const updatedNewFeature = [...newFeature];
      updatedNewFeature[websiteIndex] = '';
      setNewFeature(updatedNewFeature);
    }
  };

  const removeFeature = (websiteIndex: number, featureIndex: number) => {
    const updatedWebsites = [...formData.websites];
    updatedWebsites[websiteIndex].features.splice(featureIndex, 1);
    setFormData({ ...formData, websites: updatedWebsites });
  };

  const handleMenuItemChange = (websiteIndex: number, itemIndex: number, value: string) => {
    const updatedWebsites = [...formData.websites];
    const menuItems = [...updatedWebsites[websiteIndex].menuItems];
    menuItems[itemIndex] = value;
    updatedWebsites[websiteIndex].menuItems = menuItems;
    setFormData({ ...formData, websites: updatedWebsites });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('website_quotes')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          websites: formData.websites as any
        });

      if (error) throw error;

      toast({
        title: "Quote Request Sent!",
        description: "We've received your website quote request and will get back to you soon.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        websites: [{
          domain: '',
          deadline: null,
          websiteTypes: [],
          features: [],
          hasContent: '',
          hasLogo: '',
          needsLogoCreation: '',
          logoPreferences: {
            colors: '',
            style: '',
            industry: '',
            inspirations: ''
          },
          isLandingPage: '',
          pageCount: 1,
          menuItems: ['HOME'],
          needsMonthlyMaintenance: ''
        }]
      });
      setNewFeature(['']);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateNewFeature = (websiteIndex: number, value: string) => {
    const updated = [...newFeature];
    while (updated.length <= websiteIndex) {
      updated.push('');
    }
    updated[websiteIndex] = value;
    setNewFeature(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Get Your Quote
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Website Quote Request
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your website project and we'll provide you with a detailed, professional quote
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-2xl flex items-center gap-2">
                📧 Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-base font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-2 h-12"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 h-12"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 h-12"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-base font-medium">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-2 h-12"
                    placeholder="Company Inc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Projects */}
          {formData.websites.map((website, websiteIndex) => (
            <Card key={websiteIndex} className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 flex flex-row items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  🌐 Website Project {websiteIndex + 1}
                </CardTitle>
                {formData.websites.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeWebsite(websiteIndex)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Domain and Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`domain-${websiteIndex}`} className="text-base font-medium">Domain Name *</Label>
                    <Input
                      id={`domain-${websiteIndex}`}
                      value={website.domain}
                      onChange={(e) => updateWebsite(websiteIndex, 'domain', e.target.value)}
                      placeholder="example.com"
                      className="mt-2 h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Project Deadline *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-2 h-12"
                        >
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          {website.deadline ? format(website.deadline, "PPP") : "Select deadline date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={website.deadline || undefined}
                          onSelect={(date) => updateWebsite(websiteIndex, 'deadline', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Website Types */}
                <div>
                  <Label className="text-base font-medium">Website Type(s) *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                    {WEBSITE_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`${websiteIndex}-${type}`}
                          checked={website.websiteTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            const types = checked
                              ? [...website.websiteTypes, type]
                              : website.websiteTypes.filter(t => t !== type);
                            updateWebsite(websiteIndex, 'websiteTypes', types);
                          }}
                        />
                        <Label htmlFor={`${websiteIndex}-${type}`} className="text-sm font-medium cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-base font-medium">Additional Features</Label>
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Add a feature (e.g., Contact Form, Blog, E-commerce)..."
                        value={newFeature[websiteIndex] || ''}
                        onChange={(e) => updateNewFeature(websiteIndex, e.target.value)}
                        className="h-12"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeature(websiteIndex);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addFeature(websiteIndex)}
                        className="h-12 px-6"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {website.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="flex items-center gap-2 p-2 text-sm">
                          {feature}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeFeature(websiteIndex, featureIndex)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Required Questions */}
                <div className="space-y-6">
                  {/* Content */}
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <Label className="text-base font-medium">Do you have content ready? *</Label>
                    <RadioGroup
                      value={website.hasContent}
                      onValueChange={(value) => updateWebsite(websiteIndex, 'hasContent', value)}
                      className="mt-3"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`content-yes-${websiteIndex}`} />
                        <Label htmlFor={`content-yes-${websiteIndex}`}>Yes, I have all content ready</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`content-no-${websiteIndex}`} />
                        <Label htmlFor={`content-no-${websiteIndex}`}>No, I need help creating content</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Logo */}
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <Label className="text-base font-medium">Do you have a logo? *</Label>
                    <RadioGroup
                      value={website.hasLogo}
                      onValueChange={(value) => updateWebsite(websiteIndex, 'hasLogo', value)}
                      className="mt-3"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`logo-yes-${websiteIndex}`} />
                        <Label htmlFor={`logo-yes-${websiteIndex}`}>Yes, I have a logo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`logo-no-${websiteIndex}`} />
                        <Label htmlFor={`logo-no-${websiteIndex}`}>No, I don't have a logo</Label>
                      </div>
                    </RadioGroup>

                    {website.hasLogo === 'no' && (
                      <div className="mt-6 p-4 border-l-4 border-primary bg-primary/5">
                        <Label className="text-base font-medium">Would you like us to create a logo for you? *</Label>
                        <RadioGroup
                          value={website.needsLogoCreation}
                          onValueChange={(value) => updateWebsite(websiteIndex, 'needsLogoCreation', value)}
                          className="mt-3"
                          required
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id={`logo-create-yes-${websiteIndex}`} />
                            <Label htmlFor={`logo-create-yes-${websiteIndex}`}>Yes, please create a logo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id={`logo-create-no-${websiteIndex}`} />
                            <Label htmlFor={`logo-create-no-${websiteIndex}`}>No, I'll provide it later</Label>
                          </div>
                        </RadioGroup>

                        {website.needsLogoCreation === 'yes' && (
                          <div className="mt-6 space-y-4">
                            <h4 className="font-medium text-lg">Logo Design Preferences</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`logo-colors-${websiteIndex}`}>Preferred Colors</Label>
                                <Input
                                  id={`logo-colors-${websiteIndex}`}
                                  value={website.logoPreferences.colors}
                                  onChange={(e) => updateLogoPreference(websiteIndex, 'colors', e.target.value)}
                                  placeholder="e.g., Blue and white, Modern colors, Corporate colors"
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`logo-style-${websiteIndex}`}>Style Preference</Label>
                                <select
                                  id={`logo-style-${websiteIndex}`}
                                  value={website.logoPreferences.style}
                                  onChange={(e) => updateLogoPreference(websiteIndex, 'style', e.target.value)}
                                  className="mt-2 w-full h-10 px-3 border border-input bg-background rounded-md"
                                >
                                  <option value="">Select a style</option>
                                  {LOGO_STYLES.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label htmlFor={`logo-industry-${websiteIndex}`}>Industry/Business Type</Label>
                                <Input
                                  id={`logo-industry-${websiteIndex}`}
                                  value={website.logoPreferences.industry}
                                  onChange={(e) => updateLogoPreference(websiteIndex, 'industry', e.target.value)}
                                  placeholder="e.g., Technology, Healthcare, Restaurant"
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`logo-inspirations-${websiteIndex}`}>Inspirations/Ideas</Label>
                                <Textarea
                                  id={`logo-inspirations-${websiteIndex}`}
                                  value={website.logoPreferences.inspirations}
                                  onChange={(e) => updateLogoPreference(websiteIndex, 'inspirations', e.target.value)}
                                  placeholder="Describe any specific ideas, competitors you like, or inspiration"
                                  className="mt-2"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Landing Page */}
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <Label className="text-base font-medium">Is this a landing page? *</Label>
                    <RadioGroup
                      value={website.isLandingPage}
                      onValueChange={(value) => updateWebsite(websiteIndex, 'isLandingPage', value)}
                      className="mt-3"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`landing-yes-${websiteIndex}`} />
                        <Label htmlFor={`landing-yes-${websiteIndex}`}>Yes, single landing page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`landing-no-${websiteIndex}`} />
                        <Label htmlFor={`landing-no-${websiteIndex}`}>No, multi-page website</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Monthly Maintenance */}
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <Label className="text-base font-medium">Do you need monthly maintenance? *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monthly maintenance includes updates, security, backups, and support (separate charge)
                    </p>
                    <RadioGroup
                      value={website.needsMonthlyMaintenance}
                      onValueChange={(value) => updateWebsite(websiteIndex, 'needsMonthlyMaintenance', value)}
                      className="mt-3"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`maintenance-yes-${websiteIndex}`} />
                        <Label htmlFor={`maintenance-yes-${websiteIndex}`}>Yes, I need monthly maintenance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`maintenance-no-${websiteIndex}`} />
                        <Label htmlFor={`maintenance-no-${websiteIndex}`}>No, I'll handle it myself</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Page Count and Menu Items */}
                {website.isLandingPage === 'no' && (
                  <div className="p-4 border rounded-lg bg-secondary/5">
                    <div className="mb-6">
                      <Label htmlFor={`pages-${websiteIndex}`} className="text-base font-medium">Number of Pages *</Label>
                      <Input
                        id={`pages-${websiteIndex}`}
                        type="number"
                        min="1"
                        max="50"
                        value={website.pageCount}
                        onChange={(e) => updateWebsite(websiteIndex, 'pageCount', parseInt(e.target.value) || 1)}
                        className="w-32 mt-2 h-12"
                        required
                      />
                    </div>
                    
                    {website.pageCount > 1 && (
                      <div>
                        <Label className="text-base font-medium">Menu Items *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {website.menuItems.map((item, itemIndex) => (
                            <Input
                              key={itemIndex}
                              value={item}
                              onChange={(e) => handleMenuItemChange(websiteIndex, itemIndex, e.target.value)}
                              placeholder={`Menu item ${itemIndex + 1}`}
                              className="h-12"
                              required
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add Another Website */}
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={addWebsite}
              className="w-full md:w-auto px-8 py-4 text-lg border-2 border-primary/20 hover:bg-primary/5"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Another Website to Quote
            </Button>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isSubmitting ? 'Submitting Your Request...' : 'Request Professional Quote'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebsiteQuote;