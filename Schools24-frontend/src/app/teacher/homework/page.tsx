"use client"

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
import { Plus, BookOpen, Calendar, Upload, Eye, Edit, Trash2 } from 'lucide-react'

const homeworks = [
    { id: '1', title: 'Algebra Practice Set', subject: 'Mathematics', class: '10-A', dueDate: '2026-01-15', status: 'active', submissions: 28, total: 45 },
    { id: '2', title: 'Essay Writing', subject: 'English', class: '9-A', dueDate: '2026-01-12', status: 'expired', submissions: 40, total: 42 },
    { id: '3', title: 'Chemistry Lab Report', subject: 'Science', class: '10-B', dueDate: '2026-01-18', status: 'active', submissions: 12, total: 44 },
]

export default function HomeworkPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Homework</h1>
                    <p className="text-muted-foreground">Create and manage homework assignments</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Assign Homework
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Assign New Homework</DialogTitle>
                            <DialogDescription>
                                Create a new homework assignment for your students.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Enter homework title" />
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
                                            <SelectItem value="10-A">Class 10-A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input id="dueDate" type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Enter homework description and instructions" rows={4} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Attachments</Label>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Assign Homework</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-primary">{homeworks.filter(h => h.status === 'active').length}</p>
                        <p className="text-sm text-muted-foreground">Active Assignments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-green-500">{homeworks.reduce((sum, h) => sum + h.submissions, 0)}</p>
                        <p className="text-sm text-muted-foreground">Total Submissions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-yellow-500">{homeworks.reduce((sum, h) => sum + (h.total - h.submissions), 0)}</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Homework List */}
            <div className="space-y-4">
                {homeworks.map((homework) => (
                    <Card key={homework.id} className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <BookOpen className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-lg">{homework.title}</h3>
                                        <Badge variant={homework.status === 'active' ? 'success' : 'secondary'}>
                                            {homework.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{homework.subject}</span>
                                        <span>•</span>
                                        <span>{homework.class}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Due: {homework.dueDate}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center px-6">
                                    <p className="text-2xl font-bold">{homework.submissions}/{homework.total}</p>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
