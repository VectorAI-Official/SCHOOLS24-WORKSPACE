"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, FileText, Clock, Calendar, Users, Edit, Trash2 } from 'lucide-react'
import { mockQuizzes } from '@/lib/mockData'

export default function QuizSchedulerPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quiz Scheduler</h1>
                    <p className="text-muted-foreground">Create and schedule quizzes for your classes</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Quiz
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Quiz</DialogTitle>
                            <DialogDescription>
                                Set up a new quiz for your students.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input id="title" placeholder="Enter quiz title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mathematics">Mathematics</SelectItem>
                                            <SelectItem value="science">Science</SelectItem>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="history">History</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="class">Class</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="9-A">Class 9-A</SelectItem>
                                            <SelectItem value="9-B">Class 9-B</SelectItem>
                                            <SelectItem value="10-A">Class 10-A</SelectItem>
                                            <SelectItem value="10-B">Class 10-B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration (mins)</Label>
                                    <Input id="duration" type="number" placeholder="30" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="marks">Total Marks</Label>
                                    <Input id="marks" type="number" placeholder="50" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Instructions</Label>
                                <Textarea id="description" placeholder="Enter quiz instructions" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Quiz</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-primary">{mockQuizzes.filter(q => q.status === 'upcoming').length}</p>
                        <p className="text-sm text-muted-foreground">Upcoming</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-green-500">{mockQuizzes.filter(q => q.status === 'active').length}</p>
                        <p className="text-sm text-muted-foreground">Active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-blue-500">{mockQuizzes.filter(q => q.status === 'completed').length}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-purple-500">{mockQuizzes.length}</p>
                        <p className="text-sm text-muted-foreground">Total Quizzes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quizzes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="card-hover">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Badge variant={
                                    quiz.status === 'upcoming' ? 'default' :
                                        quiz.status === 'active' ? 'success' : 'secondary'
                                }>
                                    {quiz.status}
                                </Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <CardDescription>{quiz.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{quiz.class}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{quiz.scheduledDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{quiz.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span>{quiz.questions} questions • {quiz.totalMarks} marks</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Button variant="outline" className="w-full">
                                    {quiz.status === 'upcoming' ? 'Add Questions' :
                                        quiz.status === 'active' ? 'View Submissions' : 'View Results'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
