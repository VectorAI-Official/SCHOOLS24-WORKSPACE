"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, Calendar } from 'lucide-react'
import { mockTimetable } from '@/lib/mockData'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15', '11:30 - 12:15', '12:15 - 01:00']

export default function TeachersTimetablePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Timetable</h1>
                    <p className="text-muted-foreground">Your teaching schedule</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Print</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-primary">24</p><p className="text-sm text-muted-foreground">Classes/Week</p></CardContent></Card>
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-green-500">6</p><p className="text-sm text-muted-foreground">Free Periods</p></CardContent></Card>
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-blue-500">4</p><p className="text-sm text-muted-foreground">Classes Assigned</p></CardContent></Card>
                <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-purple-500">2</p><p className="text-sm text-muted-foreground">Subjects</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader>
                    <Badge variant="secondary" className="w-fit"><Calendar className="mr-2 h-4 w-4" />Academic Year 2025-26</Badge>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-3 bg-muted text-left font-medium">Time</th>
                                    {days.map((day) => (<th key={day} className="border p-3 bg-muted text-center font-medium min-w-[120px]">{day}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot) => (
                                    <tr key={slot}>
                                        <td className="border p-3 bg-muted/50 font-medium text-sm">{slot}</td>
                                        {days.map((day) => {
                                            const entry = mockTimetable.find(t => t.day === day && t.startTime === slot.split(' - ')[0])
                                            if (slot === '12:15 - 01:00') return (<td key={`${day}-${slot}`} className="border p-3 text-center bg-green-50 dark:bg-green-950"><span className="text-green-600 font-medium">Lunch Break</span></td>)
                                            return (<td key={`${day}-${slot}`} className="border p-3">
                                                {entry ? (<div className="text-center"><p className="font-medium text-primary">{entry.subject}</p><p className="text-xs text-muted-foreground mt-1">Class {entry.class}</p><Badge variant="outline" className="mt-1 text-xs">Room {entry.room}</Badge></div>) : (<div className="text-center"><Badge variant="secondary" className="text-xs">Free</Badge></div>)}
                                            </td>)
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
