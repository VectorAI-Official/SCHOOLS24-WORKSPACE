"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Download, FileText, BarChart3, GraduationCap, TrendingUp, Award, ArrowLeft,
    Printer, Share2, CheckCircle, Calendar, Star
} from 'lucide-react'
import { mockStudents } from '@/lib/mockData'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import { toast } from 'sonner'

const student = mockStudents[0]

const COLORS = ['#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const reports = [
    { name: 'Mid-Term Report Card', date: '2025-10-15', status: 'available', type: 'report' },
    { name: 'Progress Report Q1', date: '2025-09-01', status: 'available', type: 'progress' },
    { name: 'Attendance Certificate', date: '2025-12-20', status: 'available', type: 'certificate' },
    { name: 'Character Certificate', date: '2025-12-20', status: 'pending', type: 'certificate' },
]

export default function StudentReportsPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleDownloadReport = (reportName: string) => {
        toast.success(`Downloading ${reportName}...`, {
            description: 'Your report will be downloaded shortly.',
        })
    }

    const handlePrintReport = () => {
        toast.info('Preparing print view...', {
            description: 'Opening print dialog.',
        })
        setTimeout(() => window.print(), 500)
    }

    const handleShareReport = () => {
        toast.success('Share link copied!', {
            description: 'You can now share your report card.',
        })
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            My Reports
                        </h1>
                        <p className="text-muted-foreground">Academic and performance reports</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handlePrintReport}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={handleShareReport}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-0 shadow-lg shadow-blue-500/20"
                        onClick={() => handleDownloadReport('Full Report Card')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Report Card
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 mb-3">
                                <GraduationCap className="h-7 w-7" />
                            </div>
                            <p className="text-3xl font-bold text-violet-700 dark:text-violet-400">{student.grade}</p>
                            <p className="text-sm text-muted-foreground">Overall Grade</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 mb-3">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400">{student.performance.averageScore}%</p>
                            <p className="text-sm text-muted-foreground">Average Score</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30 mb-3">
                                <Award className="h-7 w-7" />
                            </div>
                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">#{student.performance.rank}</p>
                            <p className="text-sm text-muted-foreground">Class Rank</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 mb-3">
                                <BarChart3 className="h-7 w-7" />
                            </div>
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{student.attendance}%</p>
                            <p className="text-sm text-muted-foreground">Attendance</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subject Performance Chart */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        <CardTitle className="text-white">Subject Performance</CardTitle>
                    </div>
                    <CardDescription className="text-blue-100">Your scores across all subjects</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {mounted && (
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={student.performance.subjects}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" />
                                    <YAxis className="text-xs" domain={[0, 100]} />
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
                </CardContent>
            </Card>

            {/* Subject Details */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <CardTitle>Subject-wise Breakdown</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-5">
                        {student.performance.subjects.map((subject, index) => (
                            <div key={subject.name} className={`space-y-2 stagger-${index + 1} animate-slide-up`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-4 w-4 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="font-semibold">{subject.name}</span>
                                        <Badge variant={subject.grade.startsWith('A') ? 'success' : 'secondary'}>
                                            {subject.grade}
                                        </Badge>
                                    </div>
                                    <span className="font-bold text-lg">{subject.score}%</span>
                                </div>
                                <div className="relative">
                                    <Progress value={subject.score} className="h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Available Reports */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <CardTitle>Available Reports</CardTitle>
                    </div>
                    <CardDescription>Download your academic reports</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {reports.map((report, index) => (
                            <div
                                key={report.name}
                                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg stagger-${index + 1} animate-slide-up ${report.status === 'available'
                                    ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 hover:border-green-300'
                                    : 'border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.status === 'available'
                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                        : 'bg-gradient-to-br from-yellow-500 to-amber-600'
                                        } text-white shadow-lg`}>
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="font-semibold block">{report.name}</span>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{report.date}</span>
                                        </div>
                                    </div>
                                </div>
                                {report.status === 'available' ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadReport(report.name)}
                                        className="hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                ) : (
                                    <Badge variant="warning" className="px-3 py-1">
                                        Processing
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Report Summary Banner */}
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white overflow-hidden">
                <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                                <CheckCircle className="h-7 w-7" />
                                Great Academic Progress!
                            </h3>
                            <p className="text-blue-100">You're performing above average in {student.performance.subjects.filter(s => s.score >= 80).length} out of {student.performance.subjects.length} subjects</p>
                        </div>
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl px-8"
                            onClick={() => router.push('/student/performance')}
                        >
                            <TrendingUp className="mr-2 h-5 w-5" />
                            View Full Performance
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
