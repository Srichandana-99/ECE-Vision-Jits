
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented
    console.log('Contact form submitted:', formData);
  };

  const faqs = [
    {
      question: "How do I post a new idea?",
      answer: "After logging in to your student dashboard, navigate to the 'Post New Idea' tab, fill in the required details including title, description, and skills, then submit for review."
    },
    {
      question: "Can I edit my idea after posting?",
      answer: "Yes, you can edit your ideas from your dashboard. Go to the 'My Ideas' section and click the edit button on any of your submitted ideas."
    },
    {
      question: "How does the upvoting system work?",
      answer: "Students and faculty can upvote ideas they find innovative. Each user can vote once per idea. Ideas with higher votes get more visibility and priority for funding consideration."
    },
    {
      question: "Who can provide mentorship?",
      answer: "Faculty members, industry experts, and senior students with relevant experience can provide mentorship. You'll be matched based on your project's domain and requirements."
    },
    {
      question: "How do I get notified about placement opportunities?",
      answer: "Placement notifications are sent to all registered students via email and displayed in the dashboard. Make sure your profile is complete and your email notifications are enabled."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help! Reach out to us with any questions, suggestions, or technical support needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Jyothishmathi Institute of Technology and Science<br />
                    ECE Department<br />
                    Karimnagar, Telangana 505481
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Main Office: +91 878-2249999<br />
                    ECE Dept: +91 878-2249988
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    General: info@jits.ac.in<br />
                    ECE Dept: ece@jits.ac.in<br />
                    Innovation Platform: innovation@jits.ac.in
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday: Closed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form and FAQ */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contact" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Form
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQ
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact" className="mt-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Send us a Message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you within 24 hours.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                              Name *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                              Email *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Your email address"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                            Subject *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="Brief subject of your message"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-gray-700">
                            Message *
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Your detailed message..."
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={6}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faq" className="mt-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>
                        Find answers to common questions about using the ECE-INnovation platform.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {faqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {faq.question}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
