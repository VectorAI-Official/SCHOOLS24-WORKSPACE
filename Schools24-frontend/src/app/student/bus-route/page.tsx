"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Bus, MapPin, Phone, User, Clock, ArrowLeft, Navigation,
    AlertTriangle, CheckCircle, PhoneCall, MessageCircle
} from 'lucide-react'
import { mockBusRoutes } from '@/lib/mockData'
import { toast } from 'sonner'

const myRoute = mockBusRoutes[0]

export default function StudentBusRoutePage() {
    const router = useRouter()

    const handleCallDriver = () => {
        toast.success('Initiating call...', {
            description: `Calling ${myRoute.driverName} at ${myRoute.driverPhone}`,
        })
    }

    const handleMessageDriver = () => {
        toast.info('Opening message...', {
            description: 'Opening SMS app to message the driver.',
        })
    }

    const handleCallCoordinator = (name: string, phone: string) => {
        toast.success('Initiating call...', {
            description: `Calling ${name} at ${phone}`,
        })
    }

    const handleReportIssue = () => {
        toast.info('Opening issue form...', {
            description: 'You can report any transport-related issues here.',
        })
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
                            My Bus Route
                        </h1>
                        <p className="text-muted-foreground">View your school bus route and schedule</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={handleReportIssue}
                    className="gap-2"
                >
                    <AlertTriangle className="h-4 w-4" />
                    Report Issue
                </Button>
            </div>

            {/* Route Info Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                                <Bus className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-2xl">Route {myRoute.routeNumber}</CardTitle>
                                <CardDescription className="text-blue-100">{myRoute.vehicleNumber}</CardDescription>
                            </div>
                        </div>
                        <Badge variant="success" className="text-sm px-4 py-2 bg-green-500 text-white border-0 shadow-lg">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {myRoute.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Driver Information
                            </h3>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
                                        <User className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg">{myRoute.driverName}</p>
                                        <p className="text-sm text-muted-foreground">{myRoute.driverPhone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
                                        onClick={handleCallDriver}
                                    >
                                        <PhoneCall className="h-4 w-4 mr-2" />
                                        Call
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleMessageDriver}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Schedule
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                                        <Navigation className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-700 dark:text-green-400">7:00 AM</p>
                                        <p className="text-sm text-muted-foreground">Morning Pickup</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
                                        <Navigation className="h-6 w-6 rotate-180" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-orange-700 dark:text-orange-400">3:30 PM</p>
                                        <p className="text-sm text-muted-foreground">Afternoon Drop</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* My Stop - Highlighted */}
            <Card className="border-4 border-blue-500 shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <CardTitle className="text-white">Your Stop</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl animate-pulse-glow">
                            <MapPin className="h-10 w-10" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-2xl text-blue-700 dark:text-blue-400">{myRoute.stops[1].name}</p>
                            <p className="text-muted-foreground mt-1">Your designated pickup/drop point</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{myRoute.stops[1].time}</p>
                            <p className="text-sm text-muted-foreground">Pickup Time</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Route Stops Timeline */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-blue-500" />
                        <CardTitle>Route Schedule</CardTitle>
                    </div>
                    <CardDescription>All stops on this route</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {myRoute.stops.map((stop, index) => (
                            <div key={index} className={`flex gap-4 pb-6 last:pb-0 stagger-${index + 1} animate-slide-up`}>
                                <div className="flex flex-col items-center">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-3 font-bold ${stop.name === myRoute.stops[1].name
                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                                            : 'bg-background border-muted text-muted-foreground'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    {index < myRoute.stops.length - 1 && (
                                        <div className={`w-1 flex-1 mt-2 rounded-full ${stop.name === myRoute.stops[1].name ? 'bg-gradient-to-b from-blue-500 to-muted' : 'bg-muted'
                                            }`} />
                                    )}
                                </div>
                                <div className={`flex-1 p-4 rounded-2xl transition-all duration-300 ${stop.name === myRoute.stops[1].name
                                        ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50 border-2 border-blue-500 shadow-lg'
                                        : 'bg-muted/50 hover:bg-muted'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-semibold text-lg ${stop.name === myRoute.stops[1].name ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                                                {stop.name}
                                            </p>
                                            {stop.name === myRoute.stops[1].name && (
                                                <Badge variant="default" className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-600 border-0">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    Your Stop
                                                </Badge>
                                            )}
                                        </div>
                                        <p className={`font-bold text-xl ${stop.name === myRoute.stops[1].name ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                            {stop.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-red-500" />
                        <CardTitle>Emergency Contact</CardTitle>
                    </div>
                    <CardDescription>In case of any issues with transport</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-5 rounded-2xl border-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Transport Coordinator</p>
                                    <p className="font-bold text-lg">Mr. Sharma</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">+91 98765 12345</p>
                                </div>
                                <Button
                                    size="icon"
                                    className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
                                    onClick={() => handleCallCoordinator('Mr. Sharma', '+91 98765 12345')}
                                >
                                    <PhoneCall className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl border-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">School Reception</p>
                                    <p className="font-bold text-lg">Main Office</p>
                                    <p className="text-violet-600 dark:text-violet-400 font-medium">+91 11 2345 6789</p>
                                </div>
                                <Button
                                    size="icon"
                                    className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
                                    onClick={() => handleCallCoordinator('School Reception', '+91 11 2345 6789')}
                                >
                                    <PhoneCall className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
