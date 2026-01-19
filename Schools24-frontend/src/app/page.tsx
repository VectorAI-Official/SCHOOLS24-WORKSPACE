"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Shield,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Smartphone,
} from 'lucide-react'

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Multi-Role Access',
    description: 'Separate dashboards for admins, teachers, and students with role-based permissions.',
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Learning Materials',
    description: 'Upload, organize, and share educational resources effortlessly.',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Smart Scheduling',
    description: 'Automated timetables, exam schedules, and event management.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Analytics & Reports',
    description: 'Comprehensive insights into student performance and school metrics.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security to protect sensitive school data.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Attendance Tracking',
    description: 'Digital attendance with instant notifications to parents.',
  },
]

const stats = [
  { value: '500+', label: 'Schools Trust Us' },
  { value: '1M+', label: 'Students Managed' },
  { value: '50K+', label: 'Teachers Connected' },
  { value: '99.9%', label: 'Uptime Guarantee' },
]

const testimonials = [
  {
    quote: "School24 transformed how we manage our school. The admin dashboard is incredibly intuitive.",
    author: "Dr. Priya Sharma",
    role: "Principal, Delhi Public School",
    rating: 5,
  },
  {
    quote: "The teaching tools and student monitoring features have made my job so much easier.",
    author: "Rajesh Kumar",
    role: "Senior Teacher",
    rating: 5,
  },
  {
    quote: "I can track my attendance, grades, and assignments all in one place. Love it!",
    author: "Amit Singh",
    role: "Class 10 Student",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">School24</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 border-0">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-mesh">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Now with AI-powered features</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up tracking-tight">
            Revolutionize Your
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">School Management</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
            The all-in-one platform that connects administrators, teachers, and students
            for seamless educational excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 border-0 text-lg px-8 h-12 rounded-full">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 h-12 rounded-full hover:bg-slate-50">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline school operations and enhance the educational experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Showcase */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tailored for <span className="text-gradient">Every User</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated portals designed specifically for each user role.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Card */}
            <Card className="overflow-hidden card-hover">
              <div className="h-2 gradient-primary" />
              <CardContent className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4 shadow-lg shadow-indigo-500/20">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Admin Portal</h3>
                <p className="text-muted-foreground mb-4">
                  Complete control over school operations, staff, students, and resources.
                </p>
                <ul className="space-y-2">
                  {['User Management', 'Fee Collection', 'Resource Inventory', 'Analytics Dashboard'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Teacher Card */}
            <Card className="overflow-hidden card-hover">
              <div className="h-2 gradient-success" />
              <CardContent className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white mb-4 shadow-lg shadow-teal-500/20">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Teacher Portal</h3>
                <p className="text-muted-foreground mb-4">
                  Powerful teaching tools and student management capabilities.
                </p>
                <ul className="space-y-2">
                  {['Interactive Whiteboard', 'Quiz Creator', 'Attendance Tracking', 'Performance Reports'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="overflow-hidden card-hover">
              <div className="h-2 gradient-warning" />
              <CardContent className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white mb-4 shadow-lg shadow-orange-500/20">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Student Portal</h3>
                <p className="text-muted-foreground mb-4">
                  Engaging learning experience with progress tracking.
                </p>
                <ul className="space-y-2">
                  {['Online Quizzes', 'Study Materials', 'Fee Status', 'Performance Analytics'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with School24.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 p-12 md:p-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
                  Ready to Transform Your School?
                </h2>
                <p className="text-indigo-100 max-w-2xl mx-auto mb-8 relative z-10">
                  Join thousands of schools already using School24 to streamline their operations
                  and enhance educational outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link href="/login">
                    <Button size="lg" variant="secondary" className="text-lg px-8 rounded-full shadow-xl hover:shadow-2xl transition-all">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 rounded-full">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">School24</span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Empowering schools with modern technology for better education.
              </p>
              <div className="flex gap-4 mt-4">
                <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                <Smartphone className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
                <li><Link href="#" className="hover:text-foreground">Updates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 School24. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
