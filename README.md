# ECE-Vision Hub

A comprehensive platform for ECE students to share innovative ideas, connect with mentors, and build portfolios. Built with React, TypeScript, Supabase, and modern web technologies.

## 🚀 Features

- **User Authentication**: Secure login/registration with Supabase Auth
- **Idea Management**: Submit, edit, and manage innovative project ideas
- **Social Features**: Connect with other users, follow mentors
- **Upvoting System**: Vote on ideas and suggestions with real-time updates
- **Achievement System**: Automatic milestone tracking and badges
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark/Light Mode**: Theme switching with next-themes
- **Admin Dashboard**: Comprehensive admin panel for platform management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router DOM
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form + Zod validation
- **Theming**: next-themes for dark/light mode

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd jits-innovate-connect-thrive-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🚀 Deployment

### Quick Deploy with Vercel

1. **Using the deployment script**:
   ```bash
   ./deploy.sh
   ```

2. **Manual deployment**:
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy!

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── ...
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── Login.tsx       # Authentication pages
│   ├── Ideas.tsx       # Ideas listing
│   └── ...
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── layouts/            # Layout components
├── lib/                # Utility functions
└── main.tsx           # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `./deploy.sh` - Deploy to Vercel

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Your app's URL | No |

## 🎯 Key Features Explained

### Authentication System
- Email/password registration and login
- Password reset functionality
- Automatic profile creation
- Session management

### Idea Management
- Submit new project ideas
- Edit existing ideas (owner only)
- Add suggestions to ideas
- Upvote system with real-time updates

### Social Features
- User profiles with avatars
- Follow/unfollow system
- Connection management
- Activity tracking

### Achievement System
- Automatic milestone detection
- Badge awarding for:
  - First idea submission
  - Community building
  - Mentorship activities
  - Engagement milestones

### Admin Dashboard
- User management
- Content moderation
- Analytics and insights
- System configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the [deployment guide](./DEPLOYMENT.md)
2. Review Supabase documentation
3. Check browser console for errors
4. Verify environment variables are set correctly

## 🔗 Links

- [Live Demo](https://your-app.vercel.app)
- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

Built with ❤️ for ECE students and innovators
