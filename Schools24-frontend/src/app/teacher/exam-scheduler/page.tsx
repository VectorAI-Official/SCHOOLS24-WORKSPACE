"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Calendar, Clock, FileText, Users, Edit, Trash2 } from 'lucide-react'
import { mockQuizzes } from '@/lib/mockData'

export default function ExamSchedulerPage() {
    const exams = [
        { id: '1', title: 'Mid-Term Examination', subject: 'Mathematics', class: '10-A', date: '2026-02-15', time: '09:00 AM', duration: 180, type: 'exam' },
        { id: '2', title: 'Unit Test 3', subject: 'Physics', class: '10-B', date: '2026-01-25', time: '10:00 AM', duration: 90, type: 'test' },
        { id: '3', title: 'Practical Exam', subject: 'Chemistry', class: '10-A', date: '2026-02-10', time: '11:00 AM', duration: 120, type: 'practical' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Exam Scheduler</h1>
                    <p className="text-muted-foreground">Schedule and manage examinations</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" />Schedule Exam</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Schedule New Exam</DialogTitle>
                            <DialogDescription>Set up a new examination.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2"><Label>Exam Title</Label><Input placeholder="Enter exam title" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2"><Label>Subject</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="math">Mathematics</SelectItem><SelectItem value="science">Science</SelectItem></SelectContent></Select></div>
                                <div className="grid gap-2"><Label>Class</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="10-A">10-A</SelectItem><SelectItem value="10-B">10-B</SelectItem></SelectContent></Select></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2"><Label>Date</Label><Input type="date" /></div>
                                <div className="grid gap-2"><Label>Time</Label><Input type="time" /></div>
                                <div className="grid gap-2"><Label>Duration (mins)</Label><Input type="number" placeholder="180" /></div>
                            </div>
                        </div>
                        <DialogFooter><Button variant="outline">Cancel</Button><Button>Schedule</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exams.map((exam) => (
                    <Card key={exam.id} className="card-hover">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Badge variant={exam.type === 'exam' ? 'destructive' : exam.type === 'test' ? 'default' : 'secondary'}>{exam.type}</Badge>
                                <div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></div>
                            </div>
                            <CardTitle className="text-lg">{exam.title}</CardTitle>
                            <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /><span>Class {exam.class}</span></div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>{exam.date}</span></div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>{exam.time} • {exam.duration} mins</span></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
