import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Link as LinkIcon, Upload, Plus, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SubmitIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [] as string[],
    links: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLink, setNewLink] = useState('');
  const [category, setCategory] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-12">
          <div className="max-w-md mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to submit an idea.</p>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addLink = () => {
    if (newLink.trim() && !formData.links.includes(newLink.trim())) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink.trim()]
      });
      setNewLink('');
    }
  };

  const removeLink = (linkToRemove: string) => {
    setFormData({
      ...formData,
      links: formData.links.filter(link => link !== linkToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ideas')
        .insert({
          title: formData.title,
          description: formData.description,
          skills: formData.skills,
          links: formData.links,
          user_id: user.id,
          status: 'pending',
          category,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your idea has been submitted for review.",
      });

      navigate('/ideas');
    } catch (error: any) {
      console.error('Error submitting idea:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <Link to="/ideas" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Ideas
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Idea</h1>
            <p className="text-gray-600">Share your innovative project idea with the ECE-Vision Hub community</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Provide detailed information about your innovative idea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter your project title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Project Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your innovative idea, its purpose, and how it works..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Skills & Technologies
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add skill (e.g., Python, IoT, AI)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Related Links (Optional)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Add link (GitHub, demo, research paper, etc.)"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                        className="pl-10"
                      />
                    </div>
                    <Button type="button" onClick={addLink} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                        <span className="flex-1 text-sm truncate">{link}</span>
                        <X 
                          className="h-4 w-4 cursor-pointer hover:text-red-500" 
                          onClick={() => removeLink(link)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="IoT">IoT</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    {/* Add more as needed */}
                  </select>
                </div>

                <Alert>
                  <AlertDescription>
                    Your submitted idea will be reviewed by our team before being published to the community. 
                    You'll be notified once the review is complete.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Idea'}
                  </Button>
                  <Link to="/ideas">
                    <Button type="button" variant="outline" className="px-8">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitIdea;
