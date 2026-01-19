"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Star, Users, Award } from 'lucide-react'
import { leaderboardData, mockTeachers } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function TeacherLeaderboardPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Ranking</h1>
                    <p className="text-muted-foreground">Your position among all teachers</p>
                </div>
            </div>

            {/* Your Position */}
            <Card className="border-primary border-2">
                <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-bold text-2xl">
                            #2
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">Your Current Rank</h3>
                            <p className="text-muted-foreground">Based on student ratings and performance</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-6 w-6 ${i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} />
                            ))}
                            <span className="ml-2 text-xl font-bold">4.8</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">180</p>
                        <p className="text-sm text-muted-foreground">Total Students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <p className="text-2xl font-bold">4.8</p>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold">Top 10%</p>
                        <p className="text-sm text-muted-foreground">Percentile</p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Teachers */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Teachers</CardTitle>
                    <CardDescription>Leading performers this month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockTeachers.map((teacher, index) => (
                            <div key={teacher.id} className={`flex items-center gap-4 p-4 rounded-lg border ${index === 1 ? 'border-primary bg-primary/5' : ''}`}>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                                        index === 1 ? 'bg-gray-400 text-white' :
                                            index === 2 ? 'bg-amber-600 text-white' : 'bg-muted'
                                    }`}>
                                    {index === 0 ? <Trophy className="h-5 w-5" /> : index + 1}
                                </div>
                                <Avatar>
                                    <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{teacher.name}</p>
                                        {index === 1 && <Badge variant="default" className="text-xs">You</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{teacher.department}</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium">{teacher.rating}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
