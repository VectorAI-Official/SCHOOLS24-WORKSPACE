"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Download, CheckCircle, XCircle, Clock, Users, Save } from 'lucide-react'
import { mockStudents, mockAttendance } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AttendanceUploadPage() {
    const [attendance, setAttendance] = useState<Record<string, string>>({})

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Attendance Upload</h1>
                    <p className="text-muted-foreground">Mark and manage student attendance</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Import</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
                    <Button><Save className="mr-2 h-4 w-4" />Save Attendance</Button>
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                <Select defaultValue="10-A"><SelectTrigger className="w-[150px]"><SelectValue placeholder="Class" /></SelectTrigger><SelectContent><SelectItem value="9-A">Class 9-A</SelectItem><SelectItem value="10-A">Class 10-A</SelectItem></SelectContent></Select>
                <Select defaultValue="2026-01-09"><SelectTrigger className="w-[180px]"><SelectValue placeholder="Date" /></SelectTrigger><SelectContent><SelectItem value="2026-01-09">January 9, 2026</SelectItem><SelectItem value="2026-01-08">January 8, 2026</SelectItem></SelectContent></Select>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white"><CheckCircle className="h-6 w-6" /></div><div><p className="text-2xl font-bold">42</p><p className="text-sm text-muted-foreground">Present</p></div></div></CardContent></Card>
                <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white"><XCircle className="h-6 w-6" /></div><div><p className="text-2xl font-bold">3</p><p className="text-sm text-muted-foreground">Absent</p></div></div></CardContent></Card>
                <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white"><Clock className="h-6 w-6" /></div><div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Late</p></div></div></CardContent></Card>
                <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white"><Users className="h-6 w-6" /></div><div><p className="text-2xl font-bold">45</p><p className="text-sm text-muted-foreground">Total</p></div></div></CardContent></Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Mark Attendance</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Mark All Present</Button>
                            <Button variant="outline" size="sm">Mark All Absent</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {mockStudents.map((student) => (
                            <div key={student.id} className="flex items-center gap-4 p-3 rounded-lg border">
                                <Avatar><AvatarFallback>{getInitials(student.name)}</AvatarFallback></Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                                </div>
                                <Select defaultValue="present">
                                    <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="present">Present</SelectItem>
                                        <SelectItem value="absent">Absent</SelectItem>
                                        <SelectItem value="late">Late</SelectItem>
                                        <SelectItem value="excused">Excused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
