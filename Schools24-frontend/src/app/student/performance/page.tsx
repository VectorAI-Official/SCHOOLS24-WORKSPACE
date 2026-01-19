"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Trophy, TrendingUp, Star, Award, Medal, ArrowLeft, Target, Zap,
    BookOpen, CheckCircle, ArrowRight, Sparkles
} from 'lucide-react'
import { mockStudents, leaderboardData } from '@/lib/mockData'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from 'recharts'

const student = mockStudents[0]

export default function StudentPerformancePage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const radarData = student.performance.subjects.map(s => ({
        subject: s.name,
        score: s.score,
        fullMark: 100,
    }))

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'from-green-500 to-emerald-600'
        if (grade.startsWith('B')) return 'from-blue-500 to-cyan-600'
        if (grade.startsWith('C')) return 'from-yellow-500 to-amber-600'
        return 'from-red-500 to-rose-600'
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/student/dashboard')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        My Performance
                    </h1>
                    <p className="text-muted-foreground">Track your academic progress</p>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30 mb-3">
                                <Trophy className="h-8 w-8" />
                            </div>
                            <p className="text-4xl font-bold text-yellow-700 dark:text-yellow-400">#{student.performance.rank}</p>
                            <p className="text-sm text-muted-foreground">Class Rank</p>
                            <p className="text-xs text-muted-foreground mt-1">of {student.performance.totalStudents} students</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 mb-3">
                                <Target className="h-8 w-8" />
                            </div>
                            <p className="text-4xl font-bold text-violet-700 dark:text-violet-400">{student.performance.averageScore}%</p>
                            <p className="text-sm text-muted-foreground">Average Score</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 mb-3">
                                <Award className="h-8 w-8" />
                            </div>
                            <p className="text-4xl font-bold text-green-700 dark:text-green-400">{student.grade}</p>
                            <p className="text-sm text-muted-foreground">Overall Grade</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 mb-3">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap className="h-5 w-5 text-blue-500" />
                                <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">+5%</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Improvement</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Radar & Subject Details */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Radar Chart */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-violet-500" />
                            <CardTitle>Performance Overview</CardTitle>
                        </div>
                        <CardDescription>Your strength areas across subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mounted && (
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="hsl(var(--muted))" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        />
                                        <PolarRadiusAxis
                                            angle={30}
                                            domain={[0, 100]}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        />
                                        <Radar
                                            name="Score"
                                            dataKey="score"
                                            stroke="hsl(var(--primary))"
                                            fill="hsl(var(--primary))"
                                            fillOpacity={0.3}
                                            strokeWidth={2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-violet-500" />
                            <CardTitle>Subject-wise Performance</CardTitle>
                        </div>
                        <CardDescription>Your scores across all subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {student.performance.subjects.map((subject, index) => (
                                <div key={subject.name} className={`space-y-2 stagger-${index + 1} animate-slide-up`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getGradeColor(subject.grade)}`} />
                                            <span className="font-semibold">{subject.name}</span>
                                            <Badge
                                                variant={subject.grade.startsWith('A') ? 'success' : subject.grade.startsWith('B') ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {subject.grade}
                                            </Badge>
                                        </div>
                                        <span className="font-bold text-lg">{subject.score}%</span>
                                    </div>
                                    <Progress value={subject.score} className="h-3" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Class Leaderboard */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <CardTitle>Class Leaderboard</CardTitle>
                            </div>
                            <CardDescription>Top performers in your class</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/student/leaderboard')}
                        >
                            View Full <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaderboardData.students.slice(0, 5).map((s, index) => (
                            <div
                                key={s.rank}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg stagger-${index + 1} animate-slide-up ${s.name === student.name
                                        ? 'border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50'
                                        : 'border-transparent bg-muted/30 hover:border-violet-200'
                                    }`}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-700' : 'bg-muted text-foreground'
                                    }`}>
                                    {index === 0 ? <Medal className="h-6 w-6" /> : s.rank}
                                </div>
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold">
                                        {getInitials(s.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold">{s.name}</p>
                                        {s.name === student.name && (
                                            <Badge variant="default" className="text-xs bg-gradient-to-r from-violet-500 to-purple-600 border-0">You</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Class {s.class}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{s.score}%</p>
                                    <Badge
                                        variant={s.trend === 'up' ? 'success' : s.trend === 'down' ? 'destructive' : 'secondary'}
                                        className="text-xs"
                                    >
                                        {s.trend === 'up' ? '↑ Rising' : s.trend === 'down' ? '↓ Declining' : '→ Stable'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        <CardTitle>Achievements</CardTitle>
                    </div>
                    <CardDescription>Your academic achievements and badges</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-800/30 border-2 border-yellow-200 dark:border-yellow-700 transition-transform hover:scale-105">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30 mb-3">
                                <Trophy className="h-8 w-8" />
                            </div>
                            <p className="font-bold text-lg">Top 5</p>
                            <p className="text-sm text-muted-foreground">Class Rank</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-2 border-green-200 dark:border-green-700 transition-transform hover:scale-105">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 mb-3">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <p className="font-bold text-lg">Perfect Attendance</p>
                            <p className="text-sm text-muted-foreground">December 2025</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-800/30 border-2 border-blue-200 dark:border-blue-700 transition-transform hover:scale-105">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 mb-3">
                                <Award className="h-8 w-8" />
                            </div>
                            <p className="font-bold text-lg">Math Champion</p>
                            <p className="text-sm text-muted-foreground">95% in Unit Test</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-800/30 border-2 border-purple-200 dark:border-purple-700 transition-transform hover:scale-105">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30 mb-3">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <p className="font-bold text-lg">Most Improved</p>
                            <p className="text-sm text-muted-foreground">+15% in Science</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
