"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    CalendarDays, Clock, MapPin, ArrowLeft, ChevronLeft, ChevronRight,
    BookOpen, PartyPopper, Trophy, Sparkles, Bell
} from 'lucide-react'
import { mockEvents } from '@/lib/mockData'
import { toast } from 'sonner'

export default function StudentCalendarPage() {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const getEventColor = (type: string) => {
        switch (type) {
            case 'exam': return 'from-red-500 to-rose-600'
            case 'holiday': return 'from-green-500 to-emerald-600'
            case 'sports': return 'from-yellow-500 to-amber-600'
            case 'cultural': return 'from-purple-500 to-violet-600'
            default: return 'from-blue-500 to-cyan-600'
        }
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'exam': return <BookOpen className="h-5 w-5" />
            case 'holiday': return <PartyPopper className="h-5 w-5" />
            case 'sports': return <Trophy className="h-5 w-5" />
            case 'cultural': return <Sparkles className="h-5 w-5" />
            default: return <CalendarDays className="h-5 w-5" />
        }
    }

    const handleSetReminder = (eventTitle: string) => {
        toast.success(`Reminder set for ${eventTitle}`, {
            description: 'You will be notified before the event.',
        })
    }

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
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
                            My Calendar
                        </h1>
                        <p className="text-muted-foreground">View your schedule and upcoming events</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/student/events')}
                >
                    View All Events
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar Widget */}
                <Card className="lg:col-span-1 border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={handlePreviousMonth}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-white">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={handleNextMonth}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            className="rounded-md"
                            classNames={{
                                selected: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:bg-blue-600",
                                today: "bg-blue-100 text-blue-600 font-bold",
                            }}
                        />

                        {/* Legend */}
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-3">Event Types</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600" />
                                    <span>Exams</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
                                    <span>Holidays</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600" />
                                    <span>Sports</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-600" />
                                    <span>Cultural</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-blue-500" />
                            <CardTitle>Upcoming Events</CardTitle>
                        </div>
                        <CardDescription>Your schedule for this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockEvents.map((event, index) => (
                                <div
                                    key={event.id}
                                    className={`p-5 rounded-2xl border-2 border-transparent transition-all duration-300 hover:shadow-lg bg-gradient-to-r ${event.type === 'exam' ? 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 hover:border-red-300' :
                                        event.type === 'holiday' ? 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:border-green-300' :
                                            event.type === 'sports' ? 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 hover:border-yellow-300' :
                                                event.type === 'cultural' ? 'from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 hover:border-violet-300' :
                                                    'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:border-blue-300'
                                        } stagger-${(index % 5) + 1} animate-slide-up`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getEventColor(event.type)} text-white shadow-lg`}>
                                            {getEventIcon(event.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                                </div>
                                                <Badge variant={
                                                    event.type === 'exam' ? 'destructive' :
                                                        event.type === 'holiday' ? 'success' :
                                                            event.type === 'sports' ? 'warning' : 'secondary'
                                                } className="capitalize">
                                                    {event.type}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border">
                                                    <CalendarDays className="h-4 w-4 text-blue-500" />
                                                    <span>{event.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border">
                                                    <Clock className="h-4 w-4 text-violet-500" />
                                                    <span>{event.time}</span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border">
                                                        <MapPin className="h-4 w-4 text-green-500" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSetReminder(event.title)}
                                                    className="ml-auto hover:bg-blue-100 hover:text-blue-700"
                                                >
                                                    <Bell className="h-4 w-4 mr-1" />
                                                    Remind me
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Highlight */}
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white overflow-hidden">
                <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-blue-100 mb-1">Today</p>
                            <h3 className="text-3xl font-bold mb-2">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="text-blue-100">Stay organized and never miss an important event!</p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
                                onClick={() => router.push('/student/timetable')}
                            >
                                View Today's Schedule
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
