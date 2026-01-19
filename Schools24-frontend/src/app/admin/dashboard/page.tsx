"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
    Users,
    GraduationCap,
    BookOpen,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Clock,
    Bell,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Activity,
    Target,
    Award,
    School,
    UserCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import { dashboardStats, mockStudents, mockTeachers, mockEvents, revenueChartData, attendanceChartData, leaderboardData, mockFeeRecords } from '@/lib/mockData'
import { formatCurrency, getInitials } from '@/lib/utils'
import Link from 'next/link'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts'

const stats = dashboardStats.admin

const quickActions = [
    { title: 'Add Student', icon: GraduationCap, href: '/admin/students-details', color: 'bg-blue-500' },
    { title: 'Add Teacher', icon: BookOpen, href: '/admin/teachers-details', color: 'bg-green-500' },
    { title: 'Manage Fees', icon: DollarSign, href: '/admin/fees', color: 'bg-yellow-500' },
    { title: 'View Reports', icon: BarChart3, href: '/admin/reports', color: 'bg-purple-500' },
]

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444']

const feeStatusData = [
    { name: 'Paid', value: 65, color: '#22c55e' },
    { name: 'Partial', value: 20, color: '#f59e0b' },
    { name: 'Pending', value: 10, color: '#ef4444' },
    { name: 'Overdue', value: 5, color: '#dc2626' },
]

export default function AdminDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('month')
    const [mounted, setMounted] = useState(false)

    const upcomingEvents = mockEvents.slice(0, 4)
    const topStudents = leaderboardData.students.slice(0, 5)
    const recentFees = mockFeeRecords.slice(0, 5)

    // Ensure charts only render after component is mounted and DOM is ready
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])



    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Welcome back, Admin!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening at your school today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-blue-100">Total Students</p>
                                <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                                <div className="flex items-center gap-1 text-blue-100 text-xs">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+12% from last month</span>
                                </div>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-green-100">Total Teachers</p>
                                <p className="text-3xl font-bold text-white">{stats.totalTeachers}</p>
                                <div className="flex items-center gap-1 text-green-100 text-xs">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+3 new hires</span>
                                </div>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-500 to-violet-600">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-violet-100">Total Revenue</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                                <div className="flex items-center gap-1 text-violet-100 text-xs">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+8.5% from last month</span>
                                </div>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                                <DollarSign className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-amber-100">Pending Fees</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(stats.pendingFees)}</p>
                                <div className="flex items-center gap-1 text-amber-100 text-xs">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+5.3% from last month</span>
                                </div>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                                <AlertCircle className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-3 md:grid-cols-4">
                {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                        <Link key={index} href={action.href}>
                            <Card className="card-hover cursor-pointer group">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium">{action.title}</span>
                                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Monthly revenue and expenses</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {['week', 'month', 'year'].map((period) => (
                                <Button
                                    key={period}
                                    variant={selectedPeriod === period ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedPeriod(period)}
                                    className="capitalize"
                                >
                                    {period}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full overflow-hidden">
                            {mounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueChartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="month" className="text-xs" />
                                        <YAxis className="text-xs" tickFormatter={(value) => `₹${value / 100000}L`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value: number | undefined) => [formatCurrency(value ?? 0), '']}
                                            cursor={false}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#6366f1"
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            name="Revenue"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="expenses"
                                            stroke="#ef4444"
                                            fillOpacity={1}
                                            fill="url(#colorExpenses)"
                                            name="Expenses"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    Loading chart...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Fee Status Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Collection Status</CardTitle>
                        <CardDescription>Current month breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full overflow-hidden">
                            {mounted ? (
                                <PieChart width={300} height={200} style={{ width: '100%', height: '100%', margin: '0 auto' }}>
                                    <Pie
                                        data={feeStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {feeStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip cursor={false} />
                                </PieChart>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    Loading chart...
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {feeStatusData.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                    <span className="text-sm font-medium ml-auto">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance & Performance */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Weekly Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Student attendance this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full overflow-hidden">
                            {mounted ? (
                                <BarChart width={500} height={250} data={attendanceChartData} style={{ width: '100%', height: '100%' }}>
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
                                    <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present" />
                                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                                </BarChart>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    Loading chart...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Top Performers</CardTitle>
                            <CardDescription>Students with highest scores</CardDescription>
                        </div>
                        <Link href="/admin/students-leaderboard">
                            <Button variant="outline" size="sm">
                                View All
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topStudents.map((student, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-amber-600' : 'bg-slate-500'
                                        }`}>
                                        {student.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.class}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{student.score}%</p>
                                        <div className="flex items-center justify-end gap-1">
                                            {student.trend === 'up' ? (
                                                <TrendingUp className="h-3 w-3 text-green-500" />
                                            ) : student.trend === 'down' ? (
                                                <TrendingDown className="h-3 w-3 text-red-500" />
                                            ) : (
                                                <Activity className="h-3 w-3 text-gray-500" />
                                            )}
                                            <span className={`text-xs ${student.trend === 'up' ? 'text-green-500' :
                                                student.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                                }`}>
                                                {student.trend}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Events & Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Events */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Upcoming Events</CardTitle>
                            <CardDescription>Events scheduled for this month</CardDescription>
                        </div>
                        <Link href="/admin/events">
                            <Button variant="outline" size="sm">
                                View All
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${event.type === 'exam' ? 'bg-red-500' :
                                        event.type === 'holiday' ? 'bg-green-500' :
                                            event.type === 'meeting' ? 'bg-blue-500' :
                                                event.type === 'sports' ? 'bg-yellow-500' : 'bg-purple-500'
                                        }`}>
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{event.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {event.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {event.time}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant={
                                        event.type === 'exam' ? 'destructive' :
                                            event.type === 'holiday' ? 'success' :
                                                event.type === 'meeting' ? 'default' :
                                                    event.type === 'sports' ? 'warning' : 'secondary'
                                    }>
                                        {event.type}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Fee Payments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Fee Activity</CardTitle>
                            <CardDescription>Latest fee transactions</CardDescription>
                        </div>
                        <Link href="/admin/fees">
                            <Button variant="outline" size="sm">
                                View All
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentFees.map((fee) => (
                                <div key={fee.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <Avatar>
                                        <AvatarFallback>{getInitials(fee.studentName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{fee.studentName}</p>
                                        <p className="text-sm text-muted-foreground">{fee.feeType} • {fee.class}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(fee.amount)}</p>
                                        <Badge variant={
                                            fee.status === 'paid' ? 'success' :
                                                fee.status === 'pending' ? 'warning' : 'destructive'
                                        } className="mt-1">
                                            {fee.status === 'paid' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                            {fee.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                            {fee.status === 'overdue' && <XCircle className="mr-1 h-3 w-3" />}
                                            {fee.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <School className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.activeClasses}</p>
                                <p className="text-sm text-muted-foreground">Active Classes</p>
                            </div>
                        </div>
                        <Progress value={75} className="mt-4 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">75% classes in session</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(stats.pendingFees)}</p>
                                <p className="text-sm text-muted-foreground">Pending Fees</p>
                            </div>
                        </div>
                        <Progress value={35} className="mt-4 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">35% fees pending collection</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                            </div>
                        </div>
                        <Progress value={80} className="mt-4 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">80% events planned</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
