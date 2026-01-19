"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, Calendar, ArrowLeft, Clock, BookOpen, User, MapPin } from 'lucide-react'
import { mockTimetable } from '@/lib/mockData'
import { toast } from 'sonner'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15', '11:30 - 12:15', '12:15 - 01:00']

export default function StudentTimetablePage() {
    const router = useRouter()
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    const handlePrint = () => {
        toast.success('Preparing print view...', {
            description: 'Your timetable will open in print dialog.',
        })
        setTimeout(() => window.print(), 500)
    }

    const handleDownload = () => {
        toast.success('Downloading timetable...', {
            description: 'Your timetable PDF will be downloaded shortly.',
        })
    }

    const getSubjectColor = (subject: string) => {
        const colors: { [key: string]: string } = {
            'Mathematics': 'from-blue-500 to-cyan-500',
            'Physics': 'from-violet-500 to-purple-500',
            'Chemistry': 'from-green-500 to-emerald-500',
            'English': 'from-orange-500 to-amber-500',
            'History': 'from-red-500 to-rose-500',
            'Computer Science': 'from-slate-500 to-gray-500',
        }
        return colors[subject] || 'from-gray-500 to-slate-500'
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            My Timetable
                        </h1>
                        <p className="text-muted-foreground">Your class schedule for this week</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-0 shadow-lg shadow-blue-500/20"
                        onClick={handleDownload}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            {/* Main Timetable */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <CardTitle className="text-white">Class 10-A Schedule</CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            <Calendar className="mr-2 h-4 w-4" />
                            Academic Year 2025-26
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-r border-b p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-left font-semibold sticky left-0">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            Time
                                        </div>
                                    </th>
                                    {days.map((day) => (
                                        <th
                                            key={day}
                                            className={`border-r border-b p-4 text-center font-semibold min-w-[140px] ${day === 'Monday' ? 'bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900' : 'bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
                                                }`}
                                        >
                                            <span className={day === 'Monday' ? 'text-blue-700 dark:text-blue-300' : ''}>{day}</span>
                                            {day === 'Monday' && (
                                                <Badge variant="default" className="ml-2 text-xs bg-blue-500">Today</Badge>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, slotIndex) => (
                                    <tr key={slot} className="hover:bg-muted/30 transition-colors">
                                        <td className="border-r border-b p-4 bg-slate-50 dark:bg-slate-900 font-medium text-sm sticky left-0">
                                            {slot}
                                        </td>
                                        {days.map((day) => {
                                            const entry = mockTimetable.find(t => t.day === day && t.startTime === slot.split(' - ')[0])

                                            if (slot === '12:15 - 01:00') {
                                                return (
                                                    <td key={`${day}-${slot}`} className="border-r border-b p-3 text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className="text-2xl">🍽️</span>
                                                            <span className="text-green-600 dark:text-green-400 font-medium">Lunch Break</span>
                                                        </div>
                                                    </td>
                                                )
                                            }

                                            if (slotIndex === 2 && day !== 'Monday') {
                                                return (
                                                    <td key={`${day}-${slot}`} className="border-r border-b p-3 text-center bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className="text-2xl">☕</span>
                                                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Break</span>
                                                        </div>
                                                    </td>
                                                )
                                            }

                                            return (
                                                <td key={`${day}-${slot}`} className="border-r border-b p-3">
                                                    {entry ? (
                                                        <div className={`text-center p-3 rounded-xl bg-gradient-to-br ${getSubjectColor(entry.subject)} text-white shadow-sm transition-transform hover:scale-105`}>
                                                            <p className="font-semibold mb-1">{entry.subject}</p>
                                                            <div className="flex items-center justify-center gap-1 text-xs opacity-90">
                                                                <User className="h-3 w-3" />
                                                                <span>{entry.teacher}</span>
                                                            </div>
                                                            <Badge variant="outline" className="mt-2 text-xs border-white/50 text-white">
                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                Room {entry.room}
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-muted-foreground text-sm">-</div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-500" />
                                <CardTitle>Today's Classes</CardTitle>
                            </div>
                            <CardDescription>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/student/calendar')}
                        >
                            View Calendar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockTimetable.filter(t => t.day === 'Monday').slice(0, 5).map((slot, index) => (
                            <div
                                key={slot.id}
                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg stagger-${index + 1} animate-slide-up ${index === 2 ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50' : 'border-transparent bg-muted/30 hover:border-blue-200'
                                    }`}
                            >
                                <div className="text-center min-w-[90px]">
                                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{slot.startTime}</p>
                                    <p className="text-xs text-muted-foreground">{slot.endTime}</p>
                                </div>
                                <div className={`h-14 w-1.5 rounded-full bg-gradient-to-b ${getSubjectColor(slot.subject)}`} />
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{slot.subject}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <User className="h-3 w-3" />
                                        <span>{slot.teacher}</span>
                                    </div>
                                </div>
                                <Badge variant="outline" className="px-3 py-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Room {slot.room}
                                </Badge>
                                {index === 2 && (
                                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-1 animate-pulse">
                                        🔴 Current
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gradient-to-r from-blue-500 to-cyan-500" />
                            <span className="text-sm">Mathematics</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gradient-to-r from-violet-500 to-purple-500" />
                            <span className="text-sm">Physics</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
                            <span className="text-sm">Chemistry</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gradient-to-r from-orange-500 to-amber-500" />
                            <span className="text-sm">English</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gradient-to-r from-red-500 to-rose-500" />
                            <span className="text-sm">History</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
