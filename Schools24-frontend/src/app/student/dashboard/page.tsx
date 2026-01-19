"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Trophy,
    BookOpen,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    FileText,
    Play,
    ArrowRight,
    Sparkles,
    Target,
    Zap,
    Medal,
    Bus,
    MessageSquare,
} from 'lucide-react'
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts'
import { dashboardStats, mockQuizzes, mockTimetable, mockStudents } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

const attendanceData = [{ name: 'Attendance', value: dashboardStats.student.attendance, fill: '#10b981' }]

const COLORS = ['#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function StudentDashboard() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const student = mockStudents[0]
    const todayClasses = mockTimetable.filter(slot => slot.day === 'Monday').slice(0, 3)
    const upcomingQuizzes = mockQuizzes.filter(q => q.status === 'upcoming').slice(0, 3)

    useEffect(() => {
        setMounted(true)
    }, [])

    const quickLinks = [
        { icon: <Play className="h-5 w-5" />, label: 'Join Class', href: '/student/timetable', color: 'from-orange-500 to-rose-500', shadow: 'shadow-orange-500/25' },
        { icon: <FileText className="h-5 w-5" />, label: 'Take Quiz', href: '/student/quizzes', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/25' },
        { icon: <BookOpen className="h-5 w-5" />, label: 'Study Material', href: '/student/materials', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
        { icon: <Calendar className="h-5 w-5" />, label: 'View Schedule', href: '/student/timetable', color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/25' },
    ]

    const handleQuickLinkClick = (href: string) => {
        router.push(href)
    }

    const handleViewAllQuizzes = () => {
        router.push('/student/quizzes')
    }

    const handlePayNow = () => {
        router.push('/student/fees')
    }

    const handleViewAttendance = () => {
        router.push('/student/attendance')
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner with Premium Gradient */}
            <Card className="overflow-hidden border-0 shadow-2xl">
                <CardContent className="p-0">
                    <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 text-white overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
                        <div className="absolute top-1/2 right-1/4 animate-float">
                            <Sparkles className="h-8 w-8 text-white/30" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white/80 text-sm">Good Morning!</span>
                                    <Zap className="h-4 w-4 text-yellow-200 animate-pulse" />
                                </div>
                                <h1 className="text-4xl font-bold mb-3">Welcome back, {student.name.split(' ')[0]}! 👋</h1>
                                <p className="text-white/90 text-lg">Class {student.class}-{student.section} • Roll No: {student.rollNumber}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 transition-transform hover:scale-105">
                                    <div className="flex items-center justify-center gap-1">
                                        <Medal className="h-5 w-5 text-yellow-200" />
                                        <p className="text-4xl font-bold">{student.performance.rank}</p>
                                    </div>
                                    <p className="text-sm text-white/80 mt-1">Class Rank</p>
                                </div>
                                <div className="text-center px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 transition-transform hover:scale-105">
                                    <p className="text-4xl font-bold">{student.grade}</p>
                                    <p className="text-sm text-white/80 mt-1">Grade</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links with Vibrant Colors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickLinks.map((link, index) => (
                    <Card
                        key={index}
                        className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        onClick={() => handleQuickLinkClick(link.href)}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center relative">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${link.color} text-white mb-4 shadow-lg ${link.shadow} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                {link.icon}
                            </div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
                            <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stats Grid with Enhanced Design */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-700 dark:text-green-400">{student.attendance}%</p>
                                <p className="text-sm text-muted-foreground">Attendance</p>
                            </div>
                        </div>
                        <Progress value={student.attendance} className="mt-4 h-2" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-3 w-full text-green-600 hover:text-green-700 hover:bg-green-100/50"
                            onClick={handleViewAttendance}
                        >
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                                <Trophy className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">#{student.performance.rank}</p>
                                <p className="text-sm text-muted-foreground">of {student.performance.totalStudents} students</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 w-full text-amber-600 hover:text-amber-700 hover:bg-amber-100/50"
                            onClick={() => router.push('/student/leaderboard')}
                        >
                            View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-violet-700 dark:text-violet-400">{dashboardStats.student.upcomingQuizzes}</p>
                                <p className="text-sm text-muted-foreground">Upcoming Quizzes</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 w-full text-violet-600 hover:text-violet-700 hover:bg-violet-100/50"
                            onClick={handleViewAllQuizzes}
                        >
                            Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className={`card-hover border-0 shadow-lg ${student.fees.status === 'paid' ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50' : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${student.fees.status === 'paid' ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'} text-white shadow-lg`}>
                                <DollarSign className="h-7 w-7" />
                            </div>
                            <div>
                                <p className={`text-3xl font-bold ${student.fees.status === 'paid' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{formatCurrency(student.fees.pending)}</p>
                                <p className="text-sm text-muted-foreground">Pending Fees</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`mt-4 w-full ${student.fees.status === 'paid' ? 'text-green-600 hover:text-green-700 hover:bg-green-100/50' : 'text-red-600 hover:text-red-700 hover:bg-red-100/50'}`}
                            onClick={handlePayNow}
                        >
                            {student.fees.pending > 0 ? 'Pay Now' : 'View Details'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Today's Classes */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <CardTitle className="text-white">Today's Classes</CardTitle>
                        </div>
                        <CardDescription className="text-blue-100">Your schedule for today</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {todayClasses.map((slot, index) => (
                                <div
                                    key={slot.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${index === 0 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-transparent bg-muted/50 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center min-w-[70px] text-center">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{slot.startTime}</span>
                                        <span className="text-xs text-muted-foreground">{slot.endTime}</span>
                                    </div>
                                    <div className="h-12 w-1 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{slot.subject}</p>
                                        <p className="text-sm text-muted-foreground">{slot.teacher}</p>
                                    </div>
                                    <Badge variant={index === 0 ? 'default' : 'secondary'} className={index === 0 ? 'bg-blue-500 animate-pulse' : ''}>
                                        {index === 0 ? '🔴 Live' : `Room ${slot.room}`}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0"
                            onClick={() => router.push('/student/timetable')}
                        >
                            View Full Schedule <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Subject Performance Chart */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    <CardTitle>Subject Performance</CardTitle>
                                </div>
                                <CardDescription>Your scores across subjects</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/student/performance')}
                            >
                                View Details
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {mounted && (
                            <div className="h-[300px] w-full" style={{ minHeight: '300px', minWidth: '0' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={student.performance.subjects}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="name" className="text-xs" />
                                        <YAxis domain={[0, 100]} className="text-xs" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 40px -15px rgba(0,0,0,0.2)',
                                            }}
                                            formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Score']}
                                            cursor={false}
                                        />
                                        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                            {student.performance.subjects.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {student.performance.subjects.map((subject, index) => (
                                <div key={subject.name} className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                    <p className="text-xs font-medium truncate text-muted-foreground">{subject.name}</p>
                                    <p className="text-xl font-bold mt-1" style={{ color: COLORS[index % COLORS.length] }}>{subject.grade}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Quizzes */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-violet-500" />
                                <CardTitle>Upcoming Quizzes</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleViewAllQuizzes}>
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingQuizzes.map((quiz, index) => (
                                <div
                                    key={quiz.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-all duration-300 cursor-pointer stagger-${index + 1} animate-slide-up`}
                                    onClick={handleViewAllQuizzes}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{quiz.title}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{quiz.subject}</span>
                                            <span>•</span>
                                            <span>{quiz.questions} questions</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{quiz.scheduledDate}</p>
                                        <Badge variant="secondary" className="mt-1">{quiz.duration} mins</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Fee Status */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            <CardTitle className="text-white">Fee Status</CardTitle>
                        </div>
                        <CardDescription className="text-emerald-100">Current academic year</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-foreground">{formatCurrency(student.fees.paid)}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Paid out of {formatCurrency(student.fees.total)}</p>
                                </div>
                                <Badge
                                    variant={student.fees.status === 'paid' ? 'success' : student.fees.status === 'partial' ? 'warning' : 'destructive'}
                                    className="text-sm px-4 py-2 font-semibold"
                                >
                                    {student.fees.status === 'paid' ? '✓ Fully Paid' : student.fees.status === 'partial' ? '◐ Partially Paid' : '! Pending'}
                                </Badge>
                            </div>

                            <Progress value={(student.fees.paid / student.fees.total) * 100} className="h-3" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 text-center border border-green-200 dark:border-green-800">
                                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(student.fees.paid)}</p>
                                    <p className="text-sm text-muted-foreground">Paid</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 text-center border border-red-200 dark:border-red-800">
                                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(student.fees.pending)}</p>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>

                            {student.fees.pending > 0 && (
                                <Button
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 shadow-lg shadow-emerald-500/20"
                                    onClick={handlePayNow}
                                >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Pay Now
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Overview */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                <CardTitle>Attendance Overview</CardTitle>
                            </div>
                            <CardDescription>Your attendance statistics</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleViewAttendance}>
                            View Full Report
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-52 h-52" style={{ minHeight: '208px', minWidth: '208px' }}>
                            {mounted && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={attendanceData} startAngle={90} endAngle={-270}>
                                        <RadialBar dataKey="value" cornerRadius={10} fill="url(#attendanceGradient)" background={{ fill: 'hsl(var(--muted))' }} />
                                        <defs>
                                            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-4xl font-bold text-green-600 dark:text-green-400">{student.attendance}%</p>
                                <p className="text-sm text-muted-foreground">Attendance</p>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 transition-transform hover:scale-105">
                                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">156</p>
                                <p className="text-sm text-muted-foreground">Present</p>
                            </div>
                            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border border-red-200 dark:border-red-800 transition-transform hover:scale-105">
                                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">8</p>
                                <p className="text-sm text-muted-foreground">Absent</p>
                            </div>
                            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 border border-yellow-200 dark:border-yellow-800 transition-transform hover:scale-105">
                                <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">4</p>
                                <p className="text-sm text-muted-foreground">Late</p>
                            </div>
                            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200 dark:border-blue-800 transition-transform hover:scale-105">
                                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">2</p>
                                <p className="text-sm text-muted-foreground">Excused</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions Footer */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button variant="outline" className="gap-2" onClick={() => router.push('/student/bus-route')}>
                            <Bus className="h-4 w-4" /> My Bus Route
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => router.push('/student/events')}>
                            <Calendar className="h-4 w-4" /> Events
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => router.push('/student/reports')}>
                            <FileText className="h-4 w-4" /> Reports
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => router.push('/student/feedback')}>
                            <MessageSquare className="h-4 w-4" /> Feedback
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
