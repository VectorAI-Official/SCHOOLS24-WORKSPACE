"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Printer, Calendar, Plus, Edit, Trash2, Save } from 'lucide-react'
import { mockTimetable, TimetableSlot } from '@/lib/mockData'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15', '11:30 - 12:15', '12:15 - 01:00']
const classes = ['9-A', '9-B', '10-A', '10-B']

export default function TeacherStudentsTimetablePage() {
    const [selectedClass, setSelectedClass] = useState('10-A')
    const [timetable, setTimetable] = useState<TimetableSlot[]>(mockTimetable)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string, entry: TimetableSlot | undefined } | null>(null)
    const [formData, setFormData] = useState({
        subject: '',
        teacher: '',
        room: ''
    })

    const handlePrint = () => {
        window.print()
        toast.success('Print dialog opened', { description: `Printing timetable for Class ${selectedClass}` })
    }

    const handleExport = () => {
        const csvContent = [
            ['Time', ...days].join(','),
            ...timeSlots.map(slot =>
                [slot, ...days.map(day => {
                    const entry = timetable.find(t => t.day === day && t.startTime === slot.split(' - ')[0] && t.class === selectedClass)
                    return entry ? `${entry.subject} - ${entry.teacher}` : '-'
                })].join(',')
            )
        ].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `timetable-${selectedClass}.csv`
        a.click()
        toast.success('Export completed', { description: `Timetable for Class ${selectedClass} exported to CSV` })
    }

    const handleSlotClick = (day: string, time: string, entry: TimetableSlot | undefined) => {
        if (time === '12:15 - 01:00') return // Lunch break

        setSelectedSlot({ day, time, entry })
        setFormData({
            subject: entry?.subject || '',
            teacher: entry?.teacher || '',
            room: entry?.room || ''
        })
        setIsEditDialogOpen(true)
    }

    const handleSaveSlot = () => {
        if (!selectedSlot) return

        const [startTime, endTime] = selectedSlot.time.split(' - ')

        let newTimetable = [...timetable]

        // Remove existing entry for this slot if it exists
        if (selectedSlot.entry) {
            newTimetable = newTimetable.filter(t => t.id !== selectedSlot.entry!.id)
        }

        // Add new entry if fields are filled
        if (formData.subject && formData.teacher) {
            const newEntry: TimetableSlot = {
                id: Math.random().toString(36).substr(2, 9),
                day: selectedSlot.day,
                startTime: startTime,
                endTime: endTime,
                subject: formData.subject,
                teacher: formData.teacher,
                class: selectedClass,
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Students Timetable</h1>
                    <p className="text-muted-foreground">View and manage class timetables</p>
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
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
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
                                    {days.map((day) => (<th key={day} className="border p-3 bg-muted text-center font-medium min-w-[120px]">{day}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, slotIndex) => (
                                    <tr key={slot}>
                                        <td className="border p-3 bg-muted/50 font-medium text-sm">{slot}</td>
                                        {days.map((day) => {
                                            const timetableEntry = timetable.find(
                                                t => t.day === day && t.startTime === slot.split(' - ')[0] && (t.class === selectedClass || (!t.class && selectedClass === '10-A'))
                                            )

                                            if (slot === '12:15 - 01:00') return (<td key={`${day}-${slot}`} className="border p-3 text-center bg-green-50 dark:bg-green-950"><span className="text-green-600 font-medium">Lunch Break</span></td>)

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
                                                            <p className="text-xs text-muted-foreground mt-1">{timetableEntry.teacher}</p>
                                                            <Badge variant="outline" className="mt-1 text-xs">Room {timetableEntry.room}</Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-muted-foreground text-sm h-full flex items-center justify-center min-h-[60px]">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-blue-500 font-medium">
                                                                <Plus className="h-3 w-3" /> Add
                                                            </div>
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedSlot?.entry ? 'Edit Timetable Slot' : 'Add Timetable Slot'}</DialogTitle>
                        <DialogDescription>
                            {selectedSlot?.day} • {selectedSlot?.time}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                            <Label htmlFor="teacher">Teacher</Label>
                            <Input
                                id="teacher"
                                placeholder="e.g. Rajesh Kumar"
                                value={formData.teacher}
                                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
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
