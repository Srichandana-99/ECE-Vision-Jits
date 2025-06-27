import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/394a25c9-ef4f-40ca-b62a-16bc894aaf24.png" 
                alt="ECE-Vision Hub Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-blue-400">ECE-Vision Hub</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering ECE students to share innovative ideas, connect with mentors, 
              and transform their vision into reality.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/jyothishmathigroupofinstitutions/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <a href="https://www.instagram.com/jyothishmathi.institutions/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
              <a href="https://www.linkedin.com/school/jyothisamithi-institute-of-technological-technology-&-science/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/ideas" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Ideas
              </Link>
              <Link to="/explore" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Explore
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">For Students</h3>
            <div className="space-y-2">
              <Link to="/register" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Join Community
              </Link>
              <Link to="/submit-idea" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Submit Idea
              </Link>
              <Link to="/help" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Help & Support
              </Link>
              <Link to="/achievements" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Achievements
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">info@ece-visionhub.edu</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">ECE Department, University Campus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025-E-Vision Hub. All rights reserved. | 
            <Link to="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-white ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
