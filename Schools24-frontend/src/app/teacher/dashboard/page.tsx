"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Users,
    BookOpen,
    ClipboardCheck,
    Clock,
    Calendar,
    Bell,
    Play,
    FileText,
    CheckCircle,
    AlertCircle,
    TrendingUp,
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'
import { dashboardStats, mockQuizzes, mockStudents, mockTimetable } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'

const performanceData = [
    { class: '9-A', avg: 82 },
    { class: '9-B', avg: 78 },
    { class: '10-A', avg: 85 },
    { class: '10-B', avg: 80 },
]

const weeklyProgress = [
    { day: 'Mon', classes: 6, completed: 6 },
    { day: 'Tue', classes: 5, completed: 5 },
    { day: 'Wed', classes: 6, completed: 6 },
    { day: 'Thu', classes: 5, completed: 4 },
    { day: 'Fri', classes: 4, completed: 0 },
]

const quickActions = [
    { icon: <Play className="h-5 w-5" />, label: 'Start Class', href: '/teacher/teach', color: 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/20' },
    { icon: <ClipboardCheck className="h-5 w-5" />, label: 'Take Attendance', href: '/teacher/attendance-upload', color: 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/20' },
    { icon: <FileText className="h-5 w-5" />, label: 'Create Quiz', href: '/teacher/quiz-scheduler', color: 'bg-gradient-to-br from-teal-400 to-cyan-500 shadow-cyan-500/20' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Upload Material', href: '/teacher/materials', color: 'bg-gradient-to-br from-green-500 to-emerald-700 shadow-green-500/20' },
]

export default function TeacherDashboard() {
    const todayClasses = mockTimetable.filter(slot => slot.day === 'Monday').slice(0, 4)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 dark:from-teal-400 dark:to-emerald-200 bg-clip-text text-transparent">Welcome back, Rajesh!</h1>
                    <p className="text-muted-foreground mt-1">Here's what's on your schedule today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="hidden md:flex">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </Button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                    <Card key={index} className="card-hover cursor-pointer" onClick={() => window.location.href = action.href}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.color} text-white mb-3 shadow-lg transition-transform hover:scale-110 duration-300`}>
                                {action.icon}
                            </div>
                            <p className="font-medium">{action.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary">{dashboardStats.teacher.totalClasses} Today</Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{dashboardStats.teacher.totalClasses}</p>
                            <p className="text-sm text-muted-foreground">Total Classes</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                                <Users className="h-5 w-5" />
                            </div>
                            <Badge variant="success">Active</Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{dashboardStats.teacher.totalStudents}</p>
                            <p className="text-sm text-muted-foreground">Total Students</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/20">
                                <ClipboardCheck className="h-5 w-5" />
                            </div>
                            <Badge variant="warning">{dashboardStats.teacher.pendingAssignments} Pending</Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{dashboardStats.teacher.pendingAssignments}</p>
                            <p className="text-sm text-muted-foreground">Pending Reviews</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div className="flex items-center text-yellow-500">
                                {'★'.repeat(Math.floor(dashboardStats.teacher.rating))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{dashboardStats.teacher.rating}</p>
                            <p className="text-sm text-muted-foreground">Your Rating</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Today's Schedule */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription>Your classes for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {todayClasses.map((slot, index) => (
                                <div key={slot.id} className="flex items-center gap-4 p-3 rounded-lg border">
                                    <div className="flex flex-col items-center justify-center w-16 text-center">
                                        <span className="text-sm font-medium">{slot.startTime}</span>
                                        <span className="text-xs text-muted-foreground">to</span>
                                        <span className="text-sm font-medium">{slot.endTime}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{slot.subject}</p>
                                        <p className="text-sm text-muted-foreground">Class {slot.class} • Room {slot.room}</p>
                                    </div>
                                    {index < 2 ? (
                                        <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Done</Badge>
                                    ) : index === 2 ? (
                                        <Badge variant="default"><Clock className="h-3 w-3 mr-1" />Now</Badge>
                                    ) : (
                                        <Badge variant="secondary">Upcoming</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Class Performance Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Class Performance</CardTitle>
                        <CardDescription>Average scores across your classes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full" style={{ minHeight: '300px', minWidth: '0' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis type="number" domain={[0, 100]} className="text-xs" />
                                    <YAxis dataKey="class" type="category" className="text-xs" width={50} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                        cursor={false}
                                    />
                                    <Bar dataKey="avg" fill="#10b981" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Quizzes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Upcoming Quizzes</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockQuizzes.filter(q => q.status === 'upcoming').slice(0, 3).map((quiz) => (
                                <div key={quiz.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{quiz.title}</p>
                                        <p className="text-sm text-muted-foreground">{quiz.subject} • {quiz.class}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{quiz.scheduledDate}</p>
                                        <p className="text-xs text-muted-foreground">{quiz.duration} mins</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Student Activity */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Student Activity</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockStudents.slice(0, 4).map((student) => (
                                <div key={student.id} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">Submitted homework • 2h ago</p>
                                    </div>
                                    <Badge variant="success">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Submitted
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                    <CardDescription>Classes completed this week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full" style={{ minHeight: '250px', minWidth: '0' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyProgress}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="day" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                    cursor={false}
                                />
                                <Line type="monotone" dataKey="classes" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Scheduled" />
                                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Completed" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
