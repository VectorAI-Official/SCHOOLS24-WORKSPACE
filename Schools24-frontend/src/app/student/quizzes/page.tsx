"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Play, Clock, FileText, CheckCircle, Trophy, ArrowLeft,
    ArrowRight, Sparkles, Target, Award, Timer, BookOpen
} from 'lucide-react'
import { mockQuizzes } from '@/lib/mockData'
import { toast } from 'sonner'

export default function StudentQuizzesPage() {
    const router = useRouter()
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)

    const completedQuizzes = [
        { id: 'c1', title: 'Algebra Basics', subject: 'Mathematics', score: 85, totalMarks: 100, date: '2026-01-05', grade: 'A', duration: 45 },
        { id: 'c2', title: 'Chemical Reactions', subject: 'Chemistry', score: 78, totalMarks: 100, date: '2026-01-02', grade: 'B+', duration: 30 },
        { id: 'c3', title: 'English Grammar', subject: 'English', score: 92, totalMarks: 100, date: '2025-12-28', grade: 'A+', duration: 25 },
    ]

    const avgScore = Math.round(completedQuizzes.reduce((sum, q) => sum + q.score, 0) / completedQuizzes.length)
    const upcomingQuizzes = mockQuizzes.filter(q => q.status === 'upcoming')

    const handleStartQuiz = (quizId: string, quizTitle: string) => {
        toast.info(`Starting quiz: ${quizTitle}`, {
            description: 'Preparing quiz environment...',
        })
        setSelectedQuiz(quizId)
        // In a real app, this would navigate to the quiz taking page
        setTimeout(() => {
            toast.success('Quiz Started!', {
                description: 'Good luck! You have limited time.',
            })
        }, 1000)
    }

    const handleViewResults = (quizId: string) => {
        toast.info('Loading quiz results...', {
            description: 'Fetching your detailed performance report.',
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            My Quizzes
                        </h1>
                        <p className="text-muted-foreground">Take quizzes and view your results</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                <Timer className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-violet-700 dark:text-violet-400">{upcomingQuizzes.length}</p>
                                <p className="text-sm text-muted-foreground">Upcoming</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-700 dark:text-green-400">{completedQuizzes.length}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                                <Target className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{avgScore}%</p>
                                <p className="text-sm text-muted-foreground">Avg Score</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30">
                                <Trophy className="h-7 w-7" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <Sparkles className="h-5 w-5 text-yellow-500" />
                                    <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">Top 10%</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Performance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Quizzes */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                    <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5" />
                        <CardTitle className="text-white">Upcoming Quizzes</CardTitle>
                    </div>
                    <CardDescription className="text-violet-100">Quizzes scheduled for you</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingQuizzes.map((quiz, index) => (
                            <Card
                                key={quiz.id}
                                className={`border-2 transition-all duration-300 hover:shadow-xl hover:border-violet-300 ${selectedQuiz === quiz.id ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30' : 'border-transparent bg-muted/30'
                                    } stagger-${index + 1} animate-slide-up`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                                            Upcoming
                                        </Badge>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{quiz.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{quiz.subject}</p>
                                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-violet-500" />
                                            <span>{quiz.scheduledDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-violet-500" />
                                            <span>{quiz.questions} questions • {quiz.duration} mins</span>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 shadow-lg shadow-violet-500/20"
                                        onClick={() => handleStartQuiz(quiz.id, quiz.title)}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Start Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Completed Quizzes */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <CardTitle>Completed Quizzes</CardTitle>
                            </div>
                            <CardDescription>Your quiz history and scores</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {completedQuizzes.map((quiz, index) => (
                            <div
                                key={quiz.id}
                                className={`flex items-center gap-6 p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:border-green-300 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 stagger-${index + 1} animate-slide-up`}
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{quiz.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <span>{quiz.subject}</span>
                                        <span>•</span>
                                        <span>{quiz.date}</span>
                                        <span>•</span>
                                        <span>{quiz.duration} mins</span>
                                    </div>
                                </div>
                                <div className="text-center px-6">
                                    <div className="flex items-center gap-3">
                                        <Progress value={quiz.score} className="w-28 h-3" />
                                        <span className="font-bold text-lg text-green-600 dark:text-green-400">{quiz.score}%</span>
                                    </div>
                                </div>
                                <Badge
                                    variant={quiz.grade.startsWith('A') ? 'success' : 'secondary'}
                                    className="text-lg px-4 py-2 font-bold"
                                >
                                    {quiz.grade}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewResults(quiz.id)}
                                    className="hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                >
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-blue-500/10">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                                <Award className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Keep up the great work!</h3>
                                <p className="text-muted-foreground">You're in the top 10% of your class</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/student/performance')}
                            >
                                View Performance
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0"
                                onClick={() => router.push('/student/leaderboard')}
                            >
                                View Leaderboard
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
