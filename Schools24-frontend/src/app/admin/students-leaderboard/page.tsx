"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, TrendingUp, TrendingDown, Minus, Medal } from 'lucide-react'
import { leaderboardData, mockStudents } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'

export default function StudentsLeaderboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Students Leaderboard</h1>
                    <p className="text-muted-foreground">Top performing students based on academic scores</p>
                </div>
            </div>

            {/* Top 3 Students */}
            <div className="grid gap-6 md:grid-cols-3">
                {leaderboardData.students.slice(0, 3).map((student, index) => (
                    <Card key={student.rank} className={`card-hover ${index === 0 ? 'border-yellow-500 border-2' : ''}`}>
                        <CardContent className="p-6 text-center">
                            <div className="relative inline-block">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className={`text-xl ${index === 0 ? 'bg-yellow-500 text-white' :
                                            index === 1 ? 'bg-gray-400 text-white' : 'bg-amber-600 text-white'
                                        }`}>
                                        {getInitials(student.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                                    }`}>
                                    {index === 0 ? <Trophy className="h-4 w-4" /> : student.rank}
                                </div>
                            </div>
                            <h3 className="mt-4 font-semibold text-lg">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">Class {student.class}</p>
                            <div className="mt-3">
                                <p className="text-3xl font-bold text-primary">{student.score}%</p>
                                <p className="text-sm text-muted-foreground">Average Score</p>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-2">
                                {student.trend === 'up' ? (
                                    <Badge variant="success"><TrendingUp className="h-3 w-3 mr-1" />Rising</Badge>
                                ) : student.trend === 'down' ? (
                                    <Badge variant="destructive"><TrendingDown className="h-3 w-3 mr-1" />Declining</Badge>
                                ) : (
                                    <Badge variant="secondary"><Minus className="h-3 w-3 mr-1" />Stable</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Full Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle>Full Rankings</CardTitle>
                    <CardDescription>All students ranked by academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockStudents.map((student, index) => (
                            <div key={student.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                                        index === 1 ? 'bg-gray-400 text-white' :
                                            index === 2 ? 'bg-amber-600 text-white' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {index + 1}
                                </div>
                                <Avatar>
                                    <AvatarImage src={student.avatar} />
                                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">Class {student.class}-{student.section} • Roll No: {student.rollNumber}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-primary">{student.performance.averageScore}%</p>
                                    <p className="text-xs text-muted-foreground">Avg. Score</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold">{student.attendance}%</p>
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                </div>
                                <Badge variant={student.grade.startsWith('A') ? 'success' : student.grade.startsWith('B') ? 'default' : 'secondary'}>
                                    Grade {student.grade}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
