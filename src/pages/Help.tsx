
import { useState } from 'react';
import { HelpCircle, Send, MessageSquare, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Help = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a help request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('queries')
        .insert({
          subject: formData.subject,
          message: formData.message,
          user_id: user.id,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your help request has been submitted. We'll get back to you soon.",
      });

      setFormData({ subject: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting help request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit help request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "How do I submit a new project idea?",
      answer: "Go to the 'Submit Idea' page from the navigation menu. Fill out the form with your project details, skills, and any relevant links. Your idea will be reviewed before being published."
    },
    {
      question: "How long does it take for my idea to be approved?",
      answer: "Ideas are typically reviewed within 1-3 business days. You'll receive a notification once your idea is approved or if any changes are needed."
    },
    {
      question: "Can I edit my submitted ideas?",
      answer: "Yes, you can edit your own ideas from your profile or the ideas page. However, if your idea is already approved, major changes may require re-approval."
    },
    {
      question: "How do I connect with mentors?",
      answer: "Mentors can be contacted through the contact form or by participating in community discussions. We also organize regular mentorship sessions and workshops."
    },
    {
      question: "What happens if I forget my password?",
      answer: "Click on 'Forgot Password' on the login page. You'll receive an email with instructions to reset your password."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div>
              <Card className="shadow-lg border-0 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Alternative ways to reach us
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Email Support</p>
                        <p className="text-sm text-gray-600">support@ece-visionhub.edu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Phone Support</p>
                        <p className="text-sm text-gray-600">+91 9876543210</p>
                        <p className="text-xs text-gray-500">Mon-Fri, 9AM-5PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Form */}
            <div>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Submit Help Request
                  </CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <Alert>
                      <AlertDescription>
                        Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to submit a help request.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Brief description of your issue"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Describe your issue or question in detail..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;
