"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreHorizontal, Edit, Trash2, Download, Upload, Eye, UserCog } from 'lucide-react'
import { mockTeachers, Teacher } from '@/lib/mockData'
import { getInitials, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function StaffPage() {
    const [staff, setStaff] = useState<Teacher[]>(mockTeachers)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredStaff = staff.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Email', 'Employee ID', 'Department', 'Subjects', 'Salary', 'Rating', 'Status'].join(','),
            ...staff.map(s => [s.name, s.email, s.employeeId, s.department, s.subjects.join(';'), s.salary, s.rating, s.status].join(','))
        ].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'staff.csv'
        a.click()
        toast.success('Export completed', { description: 'Staff data exported to CSV.' })
    }

    const handleDelete = (member: Teacher) => {
        setStaff(staff.filter(s => s.id !== member.id))
        toast.success('Staff member removed', { description: `${member.name} has been removed.` })
    }

    const handleView = (member: Teacher) => {
        toast.info('Staff Details', { description: `Viewing ${member.name}'s profile.` })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Staff Management</h1>
                    <p className="text-muted-foreground">Manage teaching and non-teaching staff</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => document.getElementById('import-staff')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <input
                        id="import-staff"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                toast.success('Import started', {
                                    description: `Importing ${e.target.files[0].name}...`,
                                })
                            }
                        }}
                    />
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                                <UserCog className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{staff.length}</p>
                                <p className="text-sm text-muted-foreground">Total Staff</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
                                <UserCog className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{staff.filter(t => t.status === 'active').length}</p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
                                <UserCog className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{staff.filter(t => t.status === 'on-leave').length}</p>
                                <p className="text-sm text-muted-foreground">On Leave</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white">
                                <UserCog className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(staff.reduce((sum, t) => sum + t.salary, 0))}</p>
                                <p className="text-sm text-muted-foreground">Total Salary</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Member</TableHead>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Subjects</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.employeeId}</TableCell>
                                    <TableCell>{member.department}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {member.subjects.slice(0, 2).map((subject, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {subject}
                                                </Badge>
                                            ))}
                                            {member.subjects.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{member.subjects.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(member.salary)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span>{member.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            member.status === 'active' ? 'success' :
                                                member.status === 'on-leave' ? 'warning' : 'destructive'
                                        }>
                                            {member.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleView(member)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toast.info('Edit functionality coming soon')}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(member)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
