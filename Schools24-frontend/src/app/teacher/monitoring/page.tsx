"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Eye, Monitor, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { mockStudents } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export default function MonitoringPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Student Monitoring</h1>
                    <p className="text-muted-foreground">Monitor student activity and engagement</p>
                </div>
                <Select defaultValue="10-A">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="9-A">Class 9-A</SelectItem>
                        <SelectItem value="9-B">Class 9-B</SelectItem>
                        <SelectItem value="10-A">Class 10-A</SelectItem>
                        <SelectItem value="10-B">Class 10-B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">42</p>
                                <p className="text-sm text-muted-foreground">Online Now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                                <Eye className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">38</p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">4</p>
                                <p className="text-sm text-muted-foreground">Idle</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-sm text-muted-foreground">Offline</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Student Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {mockStudents.map((student, index) => (
                    <Card key={student.id} className="card-hover">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${index < 3 ? 'bg-green-500' : index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Engagement</span>
                                    <span className="font-medium">{80 + index * 2}%</span>
                                </div>
                                <Progress value={80 + index * 2} className="h-2" />
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <Badge variant={index < 3 ? 'success' : index === 3 ? 'warning' : 'destructive'}>
                                    {index < 3 ? 'Active' : index === 3 ? 'Idle' : 'Offline'}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                    <Monitor className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
