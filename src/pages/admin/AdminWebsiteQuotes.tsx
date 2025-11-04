import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Mail, Phone, Building, Globe, FileText, Download, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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

interface WebsiteQuote {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  websites: WebsiteData[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

const AdminWebsiteQuotes = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<WebsiteQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<WebsiteQuote | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('website_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes((data || []) as unknown as WebsiteQuote[]);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch website quotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('website_quotes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.map(quote => 
        quote.id === id ? { ...quote, status: newStatus } : quote
      ));

      toast({
        title: "Success",
        description: "Quote status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      });
    }
  };

  const calculateWebsitePrice = (website: WebsiteData): number => {
    let basePrice = 0;
    
    // Base price by type
    if (website.isLandingPage === 'yes') {
      basePrice = 800;
    } else {
      basePrice = 1200 + (website.pageCount - 1) * 200; // $200 per additional page
    }
    
    // Add-ons
    if (website.hasContent === 'no') basePrice += 300; // Content creation
    if (website.needsLogoCreation === 'yes') basePrice += 500; // Logo design
    if (website.features.length > 0) basePrice += website.features.length * 150; // $150 per feature
    
    // Premium types
    const premiumTypes = ['React', 'Next.js', 'Custom Development'];
    if (website.websiteTypes.some(type => premiumTypes.includes(type))) {
      basePrice += 500;
    }
    
    return basePrice;
  };

  const generateQuoteItems = (quote: WebsiteQuote): QuoteItem[] => {
    const items: QuoteItem[] = [];
    
    quote.websites.forEach((website, index) => {
      const websiteNumber = quote.websites.length > 1 ? ` #${index + 1}` : '';
      
      // Base website
      const isLanding = website.isLandingPage === 'yes';
      const basePrice = isLanding ? 800 : 1200;
      items.push({
        description: `${isLanding ? 'Landing Page' : 'Multi-page Website'} Development${websiteNumber} (${website.domain})`,
        quantity: 1,
        price: basePrice,
        total: basePrice
      });
      
      // Additional pages
      if (!isLanding && website.pageCount > 1) {
        const additionalPages = website.pageCount - 1;
        items.push({
          description: `Additional Pages${websiteNumber} (${additionalPages} pages)`,
          quantity: additionalPages,
          price: 200,
          total: additionalPages * 200
        });
      }
      
      // Content creation
      if (website.hasContent === 'no') {
        items.push({
          description: `Content Creation${websiteNumber}`,
          quantity: 1,
          price: 300,
          total: 300
        });
      }
      
      // Logo design
      if (website.needsLogoCreation === 'yes') {
        items.push({
          description: `Logo Design${websiteNumber}`,
          quantity: 1,
          price: 500,
          total: 500
        });
      }
      
      // Features
      if (website.features.length > 0) {
        items.push({
          description: `Additional Features${websiteNumber} (${website.features.join(', ')})`,
          quantity: website.features.length,
          price: 150,
          total: website.features.length * 150
        });
      }
      
      // Premium development
      const premiumTypes = website.websiteTypes.filter(type => 
        ['React', 'Next.js', 'Custom Development'].includes(type)
      );
      if (premiumTypes.length > 0) {
        items.push({
          description: `Premium Development${websiteNumber} (${premiumTypes.join(', ')})`,
          quantity: 1,
          price: 500,
          total: 500
        });
      }
      
      // Monthly maintenance
      if (website.needsMonthlyMaintenance === 'yes') {
        items.push({
          description: `Monthly Maintenance${websiteNumber} (ongoing)`,
          quantity: 1,
          price: 99,
          total: 99
        });
      }
    });
    
    return items;
  };

  const generatePDF = (quote: WebsiteQuote) => {
    const items = quoteItems.length > 0 ? quoteItems : generateQuoteItems(quote);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const downpayment = subtotal * 0.5;
    const final = subtotal * 0.5;
    
    const pdf = new jsPDF();
    
    // Header - Kreative Theory Logo and Info
    pdf.setFontSize(24);
    pdf.setTextColor(41, 128, 185);
    pdf.text('KREATIVE THEORY', 20, 30);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Creative Digital Solutions', 20, 38);
    pdf.text('Email: info@kreativetheory.com', 20, 45);
    pdf.text('Phone: +1 (555) 123-4567', 20, 52);
    pdf.text('Address: 123 Creative Ave, Design City, DC 12345', 20, 59);
    
    // Quote Title
    pdf.setFontSize(18);
    pdf.setTextColor(52, 73, 94);
    pdf.text('WEBSITE DEVELOPMENT QUOTE', 20, 80);
    
    // Quote Info
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Quote Date: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 95);
    pdf.text(`Quote #: WQ-${quote.id.substring(0, 8).toUpperCase()}`, 20, 102);
    
    // Client Info
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    pdf.text('CLIENT INFORMATION', 20, 120);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${quote.full_name}`, 20, 130);
    pdf.text(`Email: ${quote.email}`, 20, 137);
    if (quote.phone) pdf.text(`Phone: ${quote.phone}`, 20, 144);
    if (quote.company) pdf.text(`Company: ${quote.company}`, 20, 151);
    
    // Project Details
    let yPos = 170;
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    pdf.text('PROJECT DETAILS', 20, yPos);
    yPos += 15;
    
    quote.websites.forEach((website, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      const websiteTitle = quote.websites.length > 1 ? `Website ${index + 1}: ${website.domain}` : `Website: ${website.domain}`;
      pdf.text(websiteTitle, 20, yPos);
      yPos += 10;
      
      pdf.text(`Type: ${website.websiteTypes.join(', ')}`, 25, yPos);
      yPos += 7;
      pdf.text(`Pages: ${website.isLandingPage === 'yes' ? 'Landing Page' : `${website.pageCount} pages`}`, 25, yPos);
      yPos += 7;
      pdf.text(`Deadline: ${website.deadline ? format(new Date(website.deadline), 'MMMM dd, yyyy') : 'TBD'}`, 25, yPos);
      yPos += 7;
      pdf.text(`Content: ${website.hasContent === 'yes' ? 'Client provides' : 'We create'}`, 25, yPos);
      yPos += 7;
      pdf.text(`Logo: ${website.hasLogo === 'yes' ? 'Client provides' : website.needsLogoCreation === 'yes' ? 'We design' : 'Client will provide later'}`, 25, yPos);
      yPos += 7;
      pdf.text(`Monthly Maintenance: ${website.needsMonthlyMaintenance === 'yes' ? 'Yes' : 'No'}`, 25, yPos);
      yPos += 15;
    });
    
    // Quote Items
    if (yPos > 200) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    pdf.text('INVESTMENT BREAKDOWN', 20, yPos);
    yPos += 15;
    
    // Table header
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('DESCRIPTION', 20, yPos);
    pdf.text('QTY', 120, yPos);
    pdf.text('PRICE', 140, yPos);
    pdf.text('TOTAL', 165, yPos);
    yPos += 5;
    
    // Line under header
    pdf.line(20, yPos, 185, yPos);
    yPos += 10;
    
    // Items
    items.forEach(item => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }
      
      const description = item.description.length > 45 ? item.description.substring(0, 45) + '...' : item.description;
      pdf.text(description, 20, yPos);
      pdf.text(item.quantity.toString(), 125, yPos);
      pdf.text(`$${item.price}`, 140, yPos);
      pdf.text(`$${item.total}`, 165, yPos);
      yPos += 10;
    });
    
    // Totals
    yPos += 10;
    pdf.line(140, yPos - 5, 185, yPos - 5);
    
    pdf.setFontSize(10);
    pdf.text('SUBTOTAL:', 140, yPos);
    pdf.text(`$${subtotal.toLocaleString()}`, 165, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(27, 94, 32);
    pdf.text('50% DOWN PAYMENT:', 140, yPos);
    pdf.text(`$${downpayment.toLocaleString()}`, 165, yPos);
    yPos += 8;
    
    pdf.text('50% FINAL PAYMENT:', 140, yPos);
    pdf.text(`$${final.toLocaleString()}`, 165, yPos);
    
    // Terms
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    } else {
      yPos += 20;
    }
    
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    pdf.text('TERMS & CONDITIONS', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    const terms = [
      '• 50% down payment required to begin project',
      '• Remaining 50% due upon project completion',
      '• Project timeline begins after down payment and content/materials are received',
      '• Additional revisions beyond 3 rounds may incur extra charges',
      '• Monthly maintenance packages available separately',
      '• Quote valid for 30 days from issue date'
    ];
    
    terms.forEach(term => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(term, 20, yPos);
      yPos += 8;
    });
    
    if (notes) {
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(52, 73, 94);
      pdf.text('ADDITIONAL NOTES:', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const noteLines = pdf.splitTextToSize(notes, 165);
      pdf.text(noteLines, 20, yPos);
    }
    
    // Save PDF
    pdf.save(`Website-Quote-${quote.full_name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast({
      title: "Success",
      description: "Quote PDF generated successfully",
    });
  };

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { description: '', quantity: 1, price: 0, total: 0 }]);
  };

  const updateQuoteItem = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...quoteItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'price') {
      updated[index].total = updated[index].quantity * updated[index].price;
    }
    setQuoteItems(updated);
  };

  const removeQuoteItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading website quotes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Website Quote Requests</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            Total: {quotes.length}
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Label htmlFor="search">Search Quotes</Label>
        <Input
          id="search"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredQuotes.map((quote) => (
          <Card key={quote.id} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {quote.full_name}
                    {quote.company && <span className="text-muted-foreground">({quote.company})</span>}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {quote.email}
                    </span>
                    {quote.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {quote.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Select
                      value={quote.status}
                      onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Quoted">Quoted</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setQuoteItems(generateQuoteItems(quote));
                            setNotes('');
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Generate Quote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Generate Quote for {quote.full_name}</DialogTitle>
                        </DialogHeader>
                        
                        <Tabs defaultValue="items" className="w-full">
                          <TabsList>
                            <TabsTrigger value="items">Quote Items</TabsTrigger>
                            <TabsTrigger value="preview">Preview & Generate</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="items" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">Quote Items</h3>
                              <Button onClick={addQuoteItem} size="sm">
                                Add Item
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              {quoteItems.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 border rounded">
                                  <Input
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => updateQuoteItem(index, 'description', e.target.value)}
                                    className="col-span-6"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updateQuoteItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                    className="col-span-2"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => updateQuoteItem(index, 'price', parseFloat(e.target.value) || 0)}
                                    className="col-span-2"
                                  />
                                  <span className="col-span-1 text-sm font-medium">
                                    ${item.total}
                                  </span>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeQuoteItem(index)}
                                    className="col-span-1"
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4">
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any additional notes for the quote..."
                                rows={3}
                                className="mt-2"
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="preview" className="space-y-4">
                            <div className="bg-gray-50 p-6 rounded-lg">
                              <h3 className="text-lg font-bold mb-4">Quote Summary</h3>
                              
                              <div className="space-y-2">
                                {quoteItems.map((item, index) => (
                                  <div key={index} className="flex justify-between">
                                    <span>{item.description} ({item.quantity}x)</span>
                                    <span>${item.total}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total:</span>
                                  <span>${quoteItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <div className="flex justify-between">
                                    <span>50% Down Payment:</span>
                                    <span>${(quoteItems.reduce((sum, item) => sum + item.total, 0) * 0.5).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>50% Final Payment:</span>
                                    <span>${(quoteItems.reduce((sum, item) => sum + item.total, 0) * 0.5).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => generatePDF(quote)} 
                              className="w-full"
                              size="lg"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Generate PDF Quote
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.websites.map((website, index) => (
                  <Card key={index} className="bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {quote.websites.length > 1 ? `Website ${index + 1}: ` : 'Website: '}
                          {website.domain}
                        </h4>
                        <Badge variant="outline">
                          ${calculateWebsitePrice(website).toLocaleString()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <div><strong>Type:</strong> {website.websiteTypes.join(', ')}</div>
                          <div><strong>Pages:</strong> {website.isLandingPage === 'yes' ? 'Landing Page' : `${website.pageCount} pages`}</div>
                          {website.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <strong>Deadline:</strong> {format(new Date(website.deadline), 'MMM dd, yyyy')}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div>Content: {website.hasContent === 'yes' ? '✅ Ready' : '❌ Need help'}</div>
                          <div>Logo: {website.hasLogo === 'yes' ? '✅ Have logo' : website.needsLogoCreation === 'yes' ? '🎨 Design needed' : '⏳ Will provide'}</div>
                          <div>Maintenance: {website.needsMonthlyMaintenance === 'yes' ? '✅ Required' : '❌ Not needed'}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div>Landing Page: {website.isLandingPage === 'yes' ? '✅' : '❌'}</div>
                          {website.features.length > 0 && (
                            <div>
                              <strong>Features:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {website.features.map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {website.needsLogoCreation === 'yes' && website.logoPreferences.colors && (
                            <div className="text-xs text-muted-foreground">
                              Logo: {website.logoPreferences.style} • {website.logoPreferences.colors}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Total Estimated: <strong className="text-lg text-primary">
                      ${quote.websites.reduce((sum, website) => sum + calculateWebsitePrice(website), 0).toLocaleString()}
                    </strong>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Updated: {format(new Date(quote.updated_at), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No website quote requests yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Quote requests will appear here when clients submit the form
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminWebsiteQuotes;