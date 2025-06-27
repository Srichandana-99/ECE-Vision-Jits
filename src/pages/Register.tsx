import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, FileText, Eye, EyeOff, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const { signUp, user, getUserRole } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    hallTicketNumber: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    skills: [] as string[],
  });

  useEffect(() => {
    if (user) {
      // Check user role and redirect accordingly
      checkUserRoleAndRedirect();
    }
  }, [user, navigate]);

  const checkUserRoleAndRedirect = async () => {
    if (!user) return;
    
    try {
      const role = await getUserRole(user.id);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      // Fallback to home page if role check fails
      navigate('/');
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    const userData = {
      full_name: formData.fullName,
      hall_ticket_number: formData.hallTicketNumber,
      mobile: formData.mobile,
      skills: formData.skills,
      email: formData.email,
    };

    const { error } = await signUp(formData.email, formData.password, userData);
    
    if (!error) {
      // Store profile data for auto-update after first login
      localStorage.setItem('pendingProfile', JSON.stringify({
        hallTicketNumber: formData.hallTicketNumber,
        mobile: formData.mobile,
          skills: formData.skills
        }));
      setLoading(false);
      navigate('/');
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join ECE-Vision Hub</h1>
            <p className="text-gray-600">Create your account and start sharing your innovative ideas</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Student Registration</CardTitle>
              <CardDescription>
                Fill in your details to create your ECE-Vision Hub account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="hallTicketNumber" className="text-sm font-medium text-gray-700">
                        Hall Ticket Number
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="hallTicketNumber"
                          name="hallTicketNumber"
                          placeholder="Enter hall ticket number"
                          value={formData.hallTicketNumber}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          placeholder="Enter mobile number"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pr-10"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password *
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills and Ideas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Skills & Initial Ideas
                  </h3>
                  
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
                        disabled={loading}
                      />
                      <Button type="button" onClick={addSkill} size="sm" disabled={loading}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-gray-300"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
