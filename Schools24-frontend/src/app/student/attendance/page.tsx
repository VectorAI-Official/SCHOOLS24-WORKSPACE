"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, Download, ArrowLeft, CalendarDays } from 'lucide-react'
import { mockStudents } from '@/lib/mockData'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

const student = mockStudents[0]

const monthlyData = [
    { month: 'Aug', present: 22, absent: 2, total: 24 },
    { month: 'Sep', present: 20, absent: 1, total: 21 },
    { month: 'Oct', present: 23, absent: 0, total: 23 },
    { month: 'Nov', present: 19, absent: 2, total: 21 },
    { month: 'Dec', present: 15, absent: 1, total: 16 },
    { month: 'Jan', present: 7, absent: 0, total: 7 },
]

const recentAttendance = [
    { date: '2026-01-17', day: 'Friday', status: 'present' },
    { date: '2026-01-16', day: 'Thursday', status: 'present' },
    { date: '2026-01-15', day: 'Wednesday', status: 'present' },
    { date: '2026-01-14', day: 'Tuesday', status: 'late' },
    { date: '2026-01-13', day: 'Monday', status: 'present' },
    { date: '2026-01-10', day: 'Friday', status: 'absent' },
    { date: '2026-01-09', day: 'Thursday', status: 'present' },
]

export default function StudentAttendancePage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'from-green-500 to-emerald-600'
            case 'absent': return 'from-red-500 to-rose-600'
            case 'late': return 'from-yellow-500 to-amber-600'
            default: return 'from-blue-500 to-cyan-600'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircle className="h-4 w-4" />
            case 'absent': return <XCircle className="h-4 w-4" />
            case 'late': return <Clock className="h-4 w-4" />
            default: return <CalendarDays className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/student/dashboard')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            My Attendance
                        </h1>
                        <p className="text-muted-foreground">Track your attendance record</p>
                    </div>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg shadow-green-500/20">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-700 dark:text-green-400">156</p>
                                <p className="text-sm text-muted-foreground">Days Present</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30">
                                <XCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-red-700 dark:text-red-400">8</p>
                                <p className="text-sm text-muted-foreground">Days Absent</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">4</p>
                                <p className="text-sm text-muted-foreground">Late Arrivals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                                <Calendar className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{student.attendance}%</p>
                                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Progress */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <CardTitle className="text-white">Attendance Overview</CardTitle>
                    </div>
                    <CardDescription className="text-blue-100">Your attendance rate must be above 75% for exam eligibility</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Current Attendance Rate</span>
                            <Badge variant={student.attendance >= 75 ? 'success' : 'destructive'} className="text-sm px-3 py-1">
                                {student.attendance >= 75 ? '✓ Eligible' : '✗ Not Eligible'} • {student.attendance}%
                            </Badge>
                        </div>
                        <div className="relative">
                            <Progress value={student.attendance} className="h-6 rounded-full" />
                            <div className="absolute top-0 left-[75%] h-6 w-0.5 bg-yellow-500" />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>0%</span>
                            <span className="text-yellow-600 font-medium">75% (Minimum Required)</span>
                            <span>100%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Chart */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle>Monthly Attendance</CardTitle>
                    </div>
                    <CardDescription>Your attendance trend over the academic year</CardDescription>
                </CardHeader>
                <CardContent>
                    {mounted && (
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 40px -15px rgba(0,0,0,0.2)',
                                        }}
                                        cursor={false}
                                    />
                                    <Legend />
                                    <Bar dataKey="present" fill="url(#presentGradient)" name="Present" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="absent" fill="url(#absentGradient)" name="Absent" radius={[4, 4, 0, 0]} />
                                    <defs>
                                        <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                        <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="100%" stopColor="#dc2626" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                <CardTitle>Recent Attendance</CardTitle>
                            </div>
                            <CardDescription>Last 7 school days</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push('/student/calendar')}>
                            View Calendar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentAttendance.map((record, index) => (
                            <div
                                key={record.date}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md stagger-${index + 1} animate-slide-up ${record.status === 'present' ? 'border-green-200 hover:border-green-300 bg-green-50/50 dark:bg-green-950/20' :
                                    record.status === 'absent' ? 'border-red-200 hover:border-red-300 bg-red-50/50 dark:bg-red-950/20' :
                                        record.status === 'late' ? 'border-yellow-200 hover:border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20' :
                                            'border-blue-200 hover:border-blue-300 bg-blue-50/50 dark:bg-blue-950/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${getStatusColor(record.status)} text-white shadow-lg`}>
                                        {getStatusIcon(record.status)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{record.day}</p>
                                        <p className="text-sm text-muted-foreground">{record.date}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        record.status === 'present' ? 'success' :
                                            record.status === 'absent' ? 'destructive' :
                                                record.status === 'late' ? 'warning' : 'secondary'
                                    }
                                    className="px-4 py-1.5 text-sm font-medium"
                                >
                                    {record.status === 'present' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {record.status === 'absent' && <XCircle className="h-3 w-3 mr-1" />}
                                    {record.status === 'late' && <Clock className="h-3 w-3 mr-1" />}
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
