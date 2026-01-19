"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Trophy, Medal, TrendingUp, Star, ArrowLeft, Crown, Flame, Target,
    ArrowUp, ArrowDown, Minus, Sparkles
} from 'lucide-react'
import { leaderboardData, mockStudents } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'

const student = mockStudents[0]

export default function StudentLeaderboardPage() {
    const router = useRouter()

    const getRankStyle = (index: number) => {
        switch (index) {
            case 0: return {
                container: 'border-4 border-yellow-400 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-950/50 dark:via-amber-950/50 dark:to-yellow-950/50',
                avatar: 'from-yellow-500 to-amber-600',
                badge: 'bg-gradient-to-r from-yellow-500 to-amber-600',
                text: 'text-yellow-700 dark:text-yellow-400'
            }
            case 1: return {
                container: 'border-2 border-gray-300 bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 dark:from-gray-950/50 dark:via-slate-950/50 dark:to-gray-950/50',
                avatar: 'from-gray-400 to-slate-500',
                badge: 'bg-gradient-to-r from-gray-400 to-slate-500',
                text: 'text-gray-700 dark:text-gray-400'
            }
            case 2: return {
                container: 'border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-amber-950/50',
                avatar: 'from-amber-600 to-orange-700',
                badge: 'bg-gradient-to-r from-amber-600 to-orange-700',
                text: 'text-amber-700 dark:text-amber-400'
            }
            default: return {
                container: 'border-transparent bg-muted/30 hover:border-violet-200',
                avatar: 'from-violet-500 to-purple-600',
                badge: '',
                text: ''
            }
        }
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <ArrowUp className="h-4 w-4" />
            case 'down': return <ArrowDown className="h-4 w-4" />
            default: return <Minus className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/student/dashboard')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                        Class Leaderboard
                    </h1>
                    <p className="text-muted-foreground">See how you rank among your classmates</p>
                </div>
            </div>

            {/* Your Position - Highlighted */}
            <Card className="border-4 border-violet-500 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur font-bold text-3xl animate-pulse-glow">
                                #{student.performance.rank}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <Crown className="h-6 w-6 text-yellow-300" />
                                    Your Current Rank
                                </h3>
                                <p className="text-violet-200 mt-1">Class {student.class}-{student.section} • {student.performance.totalStudents} students</p>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-bold">{student.performance.averageScore}%</p>
                                <Badge variant="success" className="mt-2 bg-green-500 text-white border-0 shadow-lg">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +2 ranks this month
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top 3 Podium */}
            <div className="grid gap-4 md:grid-cols-3">
                {leaderboardData.students.slice(0, 3).map((s, index) => {
                    const style = getRankStyle(index)
                    return (
                        <Card
                            key={s.rank}
                            className={`border-0 shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 ${s.name === student.name ? 'ring-4 ring-violet-500' : ''
                                }`}
                        >
                            <CardContent className={`p-6 ${style.container}`}>
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                            <AvatarFallback className={`text-2xl bg-gradient-to-br ${style.avatar} text-white font-bold`}>
                                                {getInitials(s.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold shadow-lg ${style.badge}`}>
                                            {index === 0 ? <Trophy className="h-5 w-5" /> : index === 1 ? <Medal className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                                <Crown className="h-8 w-8 text-yellow-400 drop-shadow-lg animate-bounce" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-xl mb-1">{s.name}</h3>
                                    <p className="text-sm text-muted-foreground">Class {s.class}</p>
                                    <p className={`text-3xl font-bold mt-3 ${style.text}`}>{s.score}%</p>
                                    {s.name === student.name && (
                                        <Badge variant="default" className="mt-3 bg-gradient-to-r from-violet-500 to-purple-600 border-0">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            That's You!
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Full Leaderboard */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <CardTitle>Full Rankings</CardTitle>
                    </div>
                    <CardDescription>All students in your class</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockStudents.map((s, index) => {
                            const isCurrentUser = s.id === student.id
                            const style = getRankStyle(index)

                            return (
                                <div
                                    key={s.id}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg stagger-${(index % 5) + 1} animate-slide-up ${isCurrentUser
                                            ? 'border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50'
                                            : style.container
                                        }`}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-lg ${index < 3 ? `bg-gradient-to-br ${style.avatar}` : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {index === 0 ? <Medal className="h-6 w-6" /> : index + 1}
                                    </div>
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                        <AvatarFallback className={`bg-gradient-to-br ${isCurrentUser ? 'from-violet-500 to-purple-600' : 'from-slate-400 to-slate-500'} text-white font-bold`}>
                                            {getInitials(s.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-lg">{s.name}</p>
                                            {isCurrentUser && (
                                                <Badge variant="default" className="text-xs bg-gradient-to-r from-violet-500 to-purple-600 border-0">You</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Class {s.class}-{s.section}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${isCurrentUser ? 'text-violet-600 dark:text-violet-400' : index < 3 ? style.text : ''}`}>
                                            {s.performance.averageScore}%
                                        </p>
                                        <Badge
                                            variant={s.grade.startsWith('A') ? 'success' : 'secondary'}
                                            className="text-xs mt-1"
                                        >
                                            Grade {s.grade}
                                        </Badge>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Motivation Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10">
                <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-violet-500" />
                    <h3 className="text-xl font-bold mb-2">Keep Pushing! 🚀</h3>
                    <p className="text-muted-foreground">You're doing great! Stay focused and aim for the top.</p>
                    <Button
                        className="mt-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0"
                        onClick={() => router.push('/student/performance')}
                    >
                        View Your Performance
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
