"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, CalendarDays, Clock, MapPin, Edit, Trash2, Download } from 'lucide-react'
import { mockEvents, Event } from '@/lib/mockData'
import { toast } from 'sonner'

interface EventFormData {
    title: string
    type: 'event' | 'exam' | 'holiday' | 'meeting' | 'sports'
    date: string
    time: string
    location: string
    description: string
}

const initialFormData: EventFormData = {
    title: '',
    type: 'event',
    date: '',
    time: '',
    location: '',
    description: '',
}

export default function EventsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [events, setEvents] = useState<Event[]>(mockEvents)
    const [formData, setFormData] = useState<EventFormData>(initialFormData)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const eventTypes = [
        { value: 'event', label: 'Event', color: 'bg-purple-500' },
        { value: 'exam', label: 'Exam', color: 'bg-red-500' },
        { value: 'holiday', label: 'Holiday', color: 'bg-green-500' },
        { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
        { value: 'sports', label: 'Sports', color: 'bg-yellow-500' },
    ]

    const handleAddEvent = () => {
        if (!formData.title || !formData.date) {
            toast.error('Please fill in required fields', {
                description: 'Title and date are required.',
            })
            return
        }

        const newEvent: Event = {
            id: String(events.length + 1),
            title: formData.title,
            type: formData.type,
            date: formData.date,
            time: formData.time || '09:00 AM',
            location: formData.location,
            description: formData.description,
        }

        setEvents([...events, newEvent])
        setFormData(initialFormData)
        setIsAddDialogOpen(false)
        toast.success('Event created successfully', {
            description: `${newEvent.title} has been added to the calendar.`,
        })
    }

    const handleEditEvent = () => {
        if (!selectedEvent) return

        if (!formData.title || !formData.date) {
            toast.error('Please fill in required fields', {
                description: 'Title and date are required.',
            })
            return
        }

        const updatedEvent: Event = {
            ...selectedEvent,
            title: formData.title,
            type: formData.type,
            date: formData.date,
            time: formData.time || '09:00 AM',
            location: formData.location,
            description: formData.description,
        }

        setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e))
        setFormData(initialFormData)
        setSelectedEvent(null)
        setIsEditDialogOpen(false)
        toast.success('Event updated successfully', {
            description: `${updatedEvent.title} has been updated.`,
        })
    }

    const handleDeleteEvent = () => {
        if (!selectedEvent) return

        setEvents(events.filter(e => e.id !== selectedEvent.id))
        setSelectedEvent(null)
        setIsDeleteDialogOpen(false)
        toast.success('Event deleted successfully', {
            description: `${selectedEvent.title} has been removed.`,
        })
    }

    const openEditDialog = (event: Event) => {
        setSelectedEvent(event)
        setFormData({
            title: event.title,
            type: event.type as EventFormData['type'],
            date: event.date,
            time: event.time,
            location: event.location || '',
            description: event.description,
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (event: Event) => {
        setSelectedEvent(event)
        setIsDeleteDialogOpen(true)
    }

    const handleExport = () => {
        const csvContent = [
            ['Title', 'Type', 'Date', 'Time', 'Location', 'Description'].join(','),
            ...events.map(e => [
                e.title,
                e.type,
                e.date,
                e.time,
                e.location || '',
                e.description
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'events.csv'
        a.click()
        toast.success('Export completed', {
            description: 'Events data has been exported to CSV.',
        })
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'exam': return 'bg-red-500'
            case 'holiday': return 'bg-green-500'
            case 'meeting': return 'bg-blue-500'
            case 'sports': return 'bg-yellow-500'
            default: return 'bg-purple-500'
        }
    }

    const getBadgeVariant = (type: string): "destructive" | "success" | "default" | "warning" | "secondary" => {
        switch (type) {
            case 'exam': return 'destructive'
            case 'holiday': return 'success'
            case 'meeting': return 'default'
            case 'sports': return 'warning'
            default: return 'secondary'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Event Calendar</h1>
                    <p className="text-muted-foreground">Manage school events and activities</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Event</DialogTitle>
                                <DialogDescription>
                                    Add a new event to the school calendar.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Event Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter event title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Event Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value: EventFormData['type']) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eventTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date *</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="Enter location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter event description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => {
                                    setFormData(initialFormData)
                                    setIsAddDialogOpen(false)
                                }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddEvent}>Create Event</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar */}
                <Card className="lg:col-span-1 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Calendar</CardTitle>
                                <p className="text-white/80 text-sm mt-1">
                                    {date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Select a date'}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <CalendarDays className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-2 border shadow-inner">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="w-full"
                            />
                        </div>

                        {/* Selected Date Display */}
                        {date && (
                            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Selected Date</p>
                                <p className="text-lg font-semibold text-primary">
                                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        )}

                        {/* Event Types Legend */}
                        <div className="mt-4 space-y-3">
                            <p className="text-sm font-semibold text-foreground">Event Types</p>
                            <div className="grid grid-cols-2 gap-2">
                                {eventTypes.map((type) => (
                                    <div
                                        key={type.value}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                                    >
                                        <div className={`h-3 w-3 rounded-full ${type.color} ring-2 ring-offset-2 ring-transparent group-hover:ring-${type.color.replace('bg-', '')}/30 transition-all`} />
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                                    <p className="text-2xl font-bold text-blue-600">{events.length}</p>
                                    <p className="text-xs text-muted-foreground">Total Events</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                                    <p className="text-2xl font-bold text-green-600">{events.filter(e => e.type === 'holiday').length}</p>
                                    <p className="text-xs text-muted-foreground">Holidays</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Events List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Events scheduled for this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {events.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No events scheduled. Click "Add Event" to create one.
                                </div>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="flex gap-4 p-4 rounded-lg border hover:bg-muted transition-colors group">
                                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${getTypeColor(event.type)}`}>
                                            <CalendarDays className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{event.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getBadgeVariant(event.type)}>
                                                        {event.type}
                                                    </Badge>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => openEditDialog(event)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            onClick={() => openDeleteDialog(event)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {event.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {event.time}
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Update the event details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Event Title *</Label>
                            <Input
                                id="edit-title"
                                placeholder="Enter event title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-type">Event Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: EventFormData['type']) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-date">Date *</Label>
                                <Input
                                    id="edit-date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-time">Time</Label>
                                <Input
                                    id="edit-time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-location">Location</Label>
                            <Input
                                id="edit-location"
                                placeholder="Enter location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Enter event description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setFormData(initialFormData)
                            setSelectedEvent(null)
                            setIsEditDialogOpen(false)
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditEvent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setSelectedEvent(null)
                            setIsDeleteDialogOpen(false)
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteEvent}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Event
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
