"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Download, Printer, Calendar, Plus, Edit, Trash2, Save } from 'lucide-react'
import { mockTeachers, mockTimetable, TimetableSlot } from '@/lib/mockData'
import { toast } from 'sonner'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = [
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:45 - 10:30',
    '10:30 - 11:15',
    '11:30 - 12:15',
    '12:15 - 01:00',
]

const classes = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B']

export default function TeachersTimetablePage() {
    const [selectedTeacherId, setSelectedTeacherId] = useState('1')
    const [timetable, setTimetable] = useState<TimetableSlot[]>(mockTimetable)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string, entry: TimetableSlot | undefined } | null>(null)
    const [formData, setFormData] = useState({
        class: '',
        subject: '',
        room: ''
    })

    const selectedTeacher = useMemo(() => mockTeachers.find(t => t.id === selectedTeacherId), [selectedTeacherId])

    const handlePrint = () => {
        window.print()
        toast.success('Print dialog opened', { description: `Printing timetable for ${selectedTeacher?.name}` })
    }

    const handleExport = () => {
        const csvContent = [
            ['Time', ...days].join(','),
            ...timeSlots.map(slot =>
                [slot, ...days.map(day => {
                    const entry = timetable.find(t => t.day === day && t.startTime === slot.split(' - ')[0] && t.teacher === selectedTeacher?.name)
                    return entry ? `${entry.subject} - Class ${entry.class}` : 'Free'
                })].join(',')
            )
        ].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `timetable-${selectedTeacher?.name?.replace(' ', '-')}.csv`
        a.click()
        toast.success('Export completed', { description: `Timetable for ${selectedTeacher?.name} exported to CSV` })
    }

    const handleSlotClick = (day: string, time: string, entry: TimetableSlot | undefined) => {
        if (time === '12:15 - 01:00') return // Lunch break

        setSelectedSlot({ day, time, entry })
        setFormData({
            class: entry?.class || '',
            subject: entry?.subject || '',
            room: entry?.room || ''
        })
        setIsEditDialogOpen(true)
    }

    const handleSaveSlot = () => {
        if (!selectedSlot || !selectedTeacher) return

        const [startTime, endTime] = selectedSlot.time.split(' - ')

        let newTimetable = [...timetable]

        // Remove existing entry for this slot if it exists
        if (selectedSlot.entry) {
            newTimetable = newTimetable.filter(t => t.id !== selectedSlot.entry!.id)
        }

        // Add new entry if fields are filled
        if (formData.subject && formData.class) {
            const newEntry: TimetableSlot = {
                id: Math.random().toString(36).substr(2, 9),
                day: selectedSlot.day,
                startTime: startTime,
                endTime: endTime,
                subject: formData.subject,
                teacher: selectedTeacher.name, // Assign to the currently selected teacher
                class: formData.class,
                room: formData.room || 'TBD'
            }
            newTimetable.push(newEntry)
            toast.success('Timetable updated', { description: 'Slot successfully updated' })
        } else if (selectedSlot.entry) {
            toast.success('Slot cleared', { description: 'Timetable entry removed' })
        }

        setTimetable(newTimetable)
        setIsEditDialogOpen(false)
    }

    const handleDeleteSlot = () => {
        if (!selectedSlot?.entry) return

        setTimetable(timetable.filter(t => t.id !== selectedSlot.entry!.id))
        setIsEditDialogOpen(false)
        toast.success('Slot cleared', { description: 'Timetable entry removed' })
    }

    // Stats calculations
    const stats = useMemo(() => {
        const teacherEntries = timetable.filter(t => t.teacher === selectedTeacher?.name)
        const classesPerWeek = teacherEntries.length
        const totalSlots = days.length * (timeSlots.length - 1) // Excluding lunch
        const freePeriods = totalSlots - classesPerWeek
        const classesAssigned = new Set(teacherEntries.map(t => t.class)).size
        const subjects = new Set(teacherEntries.map(t => t.subject)).size

        return { classesPerWeek, freePeriods, classesAssigned, subjects }
    }, [timetable, selectedTeacher])


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Teachers Timetable</h1>
                    <p className="text-muted-foreground">View and manage teacher schedules</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select Teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockTeachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Academic Year 2025-26
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-3 bg-muted text-left font-medium">Time</th>
                                    {days.map((day) => (
                                        <th key={day} className="border p-3 bg-muted text-center font-medium min-w-[120px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, slotIndex) => (
                                    <tr key={slot}>
                                        <td className="border p-3 bg-muted/50 font-medium text-sm">{slot}</td>
                                        {days.map((day) => {
                                            const timetableEntry = timetable.find(
                                                t => t.day === day && t.startTime === slot.split(' - ')[0] && t.teacher === selectedTeacher?.name
                                            )

                                            if (slot === '12:15 - 01:00') {
                                                return (
                                                    <td key={`${day}-${slot}`} className="border p-3 text-center bg-green-50 dark:bg-green-950">
                                                        <span className="text-green-600 font-medium">Lunch Break</span>
                                                    </td>
                                                )
                                            }

                                            return (
                                                <td
                                                    key={`${day}-${slot}`}
                                                    className={`border p-3 cursor-pointer hover:bg-muted/50 transition-colors relative group ${!timetableEntry ? 'hover:bg-blue-50/50' : ''}`}
                                                    onClick={() => handleSlotClick(day, slot, timetableEntry)}
                                                >
                                                    {timetableEntry ? (
                                                        <div className="text-center">
                                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Edit className="h-3 w-3 text-muted-foreground" />
                                                            </div>
                                                            <p className="font-medium text-primary">{timetableEntry.subject}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">Class {timetableEntry.class}</p>
                                                            <Badge variant="outline" className="mt-1 text-xs">
                                                                Room {timetableEntry.room}
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center h-full absolute inset-0">
                                                                <div className="flex items-center gap-1 text-xs text-blue-500 font-medium">
                                                                    <Plus className="h-3 w-3" /> Assign
                                                                </div>
                                                            </div>
                                                            {!timetableEntry && <Badge variant="secondary" className="text-xs group-hover:opacity-0 transition-opacity">Free</Badge>}
                                                        </div>
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

            {/* Teacher Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-primary">{stats.classesPerWeek}</p>
                        <p className="text-sm text-muted-foreground">Classes/Week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-green-500">{stats.freePeriods}</p>
                        <p className="text-sm text-muted-foreground">Free Periods</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-blue-500">{stats.classesAssigned}</p>
                        <p className="text-sm text-muted-foreground">Classes Assigned</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-purple-500">{stats.subjects}</p>
                        <p className="text-sm text-muted-foreground">Subjects</p>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedSlot?.entry ? 'Edit Timetable Slot' : 'Assign Class'}</DialogTitle>
                        <DialogDescription>
                            {selectedSlot?.day} • {selectedSlot?.time} • {selectedTeacher?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="class">Class</Label>
                            <Select
                                value={formData.class}
                                onValueChange={(value) => setFormData({ ...formData, class: value })}
                            >
                                <SelectTrigger id="class">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="e.g. Mathematics"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="room">Room Number</Label>
                            <Input
                                id="room"
                                placeholder="e.g. 101"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {selectedSlot?.entry && (
                            <Button
                                variant="destructive"
                                onClick={handleDeleteSlot}
                                type="button"
                                className="sm:mr-auto"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear Slot
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveSlot}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
