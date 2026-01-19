"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, TrendingUp, TrendingDown, Minus, Star, Users, Award } from 'lucide-react'
import { leaderboardData, mockTeachers } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'

export default function TeachersLeaderboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Teachers Leaderboard</h1>
                    <p className="text-muted-foreground">Top performing teachers based on ratings and performance</p>
                </div>
            </div>

            {/* Top 3 Teachers */}
            <div className="grid gap-6 md:grid-cols-3">
                {leaderboardData.teachers.slice(0, 3).map((teacher, index) => (
                    <Card key={teacher.rank} className={`card-hover ${index === 0 ? 'border-yellow-500 border-2' : ''}`}>
                        <CardContent className="p-6 text-center">
                            <div className="relative inline-block">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className={`text-xl ${index === 0 ? 'bg-yellow-500 text-white' :
                                            index === 1 ? 'bg-gray-400 text-white' : 'bg-amber-600 text-white'
                                        }`}>
                                        {getInitials(teacher.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                                    }`}>
                                    {index === 0 ? <Trophy className="h-4 w-4" /> : teacher.rank}
                                </div>
                            </div>
                            <h3 className="mt-4 font-semibold text-lg">{teacher.name}</h3>
                            <p className="text-sm text-muted-foreground">{teacher.department}</p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} />
                                ))}
                                <span className="ml-1 font-medium">{teacher.rating}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{teacher.students} students</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Full Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle>Full Rankings</CardTitle>
                    <CardDescription>All teachers ranked by performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockTeachers.map((teacher, index) => (
                            <div key={teacher.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                                        index === 1 ? 'bg-gray-400 text-white' :
                                            index === 2 ? 'bg-amber-600 text-white' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {index + 1}
                                </div>
                                <Avatar>
                                    <AvatarImage src={teacher.avatar} />
                                    <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{teacher.name}</p>
                                    <p className="text-sm text-muted-foreground">{teacher.department} • {teacher.subjects.join(', ')}</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(teacher.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium mt-1">{teacher.rating}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-primary">{teacher.classes.length * 45}</p>
                                    <p className="text-xs text-muted-foreground">Students</p>
                                </div>
                                <Badge variant={
                                    index === 0 ? 'success' :
                                        index < 3 ? 'default' : 'secondary'
                                }>
                                    {index === 0 ? (
                                        <><Trophy className="h-3 w-3 mr-1" />Top Performer</>
                                    ) : (
                                        `Rank #${index + 1}`
                                    )}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
