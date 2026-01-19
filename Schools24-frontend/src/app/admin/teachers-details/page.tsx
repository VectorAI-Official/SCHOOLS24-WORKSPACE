"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Download,
    Upload,
    Eye,
    BookOpen,
    Users,
    UserPlus,
    Phone,
    Calendar,
    DollarSign,
    Star,
    GraduationCap,
    Filter,
    RefreshCw,
    CheckCircle2,
    Clock,
    Briefcase,
} from 'lucide-react'
import { mockTeachers, Teacher } from '@/lib/mockData'
import { getInitials, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function TeachersDetailsPage() {
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
    const [searchQuery, setSearchQuery] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        department: '',
        subjects: '',
        classes: '',
        qualification: '',
        experience: '',
        salary: 0,
    })

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDepartment = departmentFilter === 'all' || teacher.department === departmentFilter
        const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter
        return matchesSearch && matchesDepartment && matchesStatus
    })

    const departments = [...new Set(teachers.map(t => t.department))].sort()

    const stats = {
        total: teachers.length,
        active: teachers.filter(t => t.status === 'active').length,
        onLeave: teachers.filter(t => t.status === 'on-leave').length,
        inactive: teachers.filter(t => t.status === 'inactive').length,
        totalSalary: teachers.reduce((acc, t) => acc + t.salary, 0),
        avgRating: (teachers.reduce((acc, t) => acc + t.rating, 0) / (teachers.length || 1)).toFixed(1),
    }

    const handleAddTeacher = () => {
        if (!newTeacher.name || !newTeacher.email || !newTeacher.department) {
            toast.error('Please fill in all required fields')
            return
        }

        const teacher: Teacher = {
            id: String(teachers.length + 1),
            name: newTeacher.name,
            email: newTeacher.email,
            phone: newTeacher.phone,
            employeeId: newTeacher.employeeId || `TCH${String(teachers.length + 1).padStart(3, '0')}`,
            department: newTeacher.department,
            subjects: newTeacher.subjects.split(',').map(s => s.trim()).filter(Boolean),
            classes: newTeacher.classes.split(',').map(c => c.trim()).filter(Boolean),
            qualification: newTeacher.qualification,
            experience: newTeacher.experience,
            joinDate: new Date().toISOString().split('T')[0],
            salary: newTeacher.salary,
            rating: 0,
            status: 'active',
        }
        setTeachers([...teachers, teacher])
        setNewTeacher({
            name: '',
            email: '',
            phone: '',
            employeeId: '',
            department: '',
            subjects: '',
            classes: '',
            qualification: '',
            experience: '',
            salary: 0,
        })
        setIsAddDialogOpen(false)
        toast.success('Teacher added successfully', {
            description: `${teacher.name} has been added to ${teacher.department} department`,
        })
    }

    const handleEditTeacher = () => {
        if (!selectedTeacher) return

        setTeachers(teachers.map(t => t.id === selectedTeacher.id ? selectedTeacher : t))
        setIsEditDialogOpen(false)
        toast.success('Teacher updated successfully', {
            description: `${selectedTeacher.name}'s details have been updated`,
        })
    }

    const handleDeleteTeacher = () => {
        if (!selectedTeacher) return

        setTeachers(teachers.filter(t => t.id !== selectedTeacher.id))
        setIsDeleteDialogOpen(false)
        toast.success('Teacher removed successfully', {
            description: `${selectedTeacher.name} has been removed from the system`,
        })
    }

    const handleStatusChange = (teacher: Teacher, newStatus: 'active' | 'on-leave' | 'inactive') => {
        setTeachers(teachers.map(t => t.id === teacher.id ? { ...t, status: newStatus } : t))
        toast.success('Status updated', {
            description: `${teacher.name}'s status changed to ${newStatus}`,
        })
    }

    const handleImport = () => {
        toast.info('Importing teachers...', {
            description: 'Parsing CSV file and updating records'
        })

        setTimeout(() => {
            toast.success('Import completed', {
                description: 'Successfully imported 10 new teachers'
            })
        }, 1500)
    }

    const handleCycleStatus = (teacher: Teacher) => {
        const statuses: ('active' | 'on-leave' | 'inactive')[] = ['active', 'on-leave', 'inactive']
        const checkStatus = (s: string): s is 'active' | 'on-leave' | 'inactive' => {
            return statuses.includes(s as any)
        }

        const currentStatus = checkStatus(teacher.status) ? teacher.status : 'active'
        const currentIndex = statuses.indexOf(currentStatus)
        const newStatus = statuses[(currentIndex + 1) % statuses.length]

        handleStatusChange(teacher, newStatus)
    }

    const exportTeachers = () => {
        const csvContent = [
            ['Name', 'Email', 'Phone', 'Employee ID', 'Department', 'Subjects', 'Salary', 'Rating', 'Status'].join(','),
            ...filteredTeachers.map(t =>
                [t.name, t.email, t.phone, t.employeeId, t.department, t.subjects.join(';'), t.salary, t.rating, t.status].join(',')
            )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'teachers.csv'
        a.click()
        toast.success('Export completed', {
            description: 'Teachers data has been exported to CSV',
        })
    }

    const getStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" | "secondary" => {
        switch (status) {
            case 'active':
                return 'success'
            case 'on-leave':
                return 'warning'
            case 'inactive':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Teachers Details</h1>
                    <p className="text-muted-foreground">View and manage all teaching staff</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleImport}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button variant="outline" onClick={exportTeachers}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Teacher
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add New Teacher</DialogTitle>
                                <DialogDescription>
                                    Add a new teacher to the staff.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter full name"
                                            value={newTeacher.name}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={newTeacher.email}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="Enter phone"
                                            value={newTeacher.phone}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="employeeId">Employee ID</Label>
                                        <Input
                                            id="employeeId"
                                            placeholder="e.g., TCH001"
                                            value={newTeacher.employeeId}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, employeeId: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department *</Label>
                                        <Select
                                            value={newTeacher.department}
                                            onValueChange={(value) => setNewTeacher({ ...newTeacher, department: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts'].map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="salary">Salary (₹)</Label>
                                        <Input
                                            id="salary"
                                            type="number"
                                            placeholder="Enter salary"
                                            value={newTeacher.salary || ''}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, salary: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="subjects">Subjects (comma separated)</Label>
                                    <Input
                                        id="subjects"
                                        placeholder="e.g., Mathematics, Physics"
                                        value={newTeacher.subjects}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, subjects: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="classes">Classes (comma separated)</Label>
                                    <Input
                                        id="classes"
                                        placeholder="e.g., 9-A, 9-B, 10-A"
                                        value={newTeacher.classes}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, classes: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="qualification">Qualification</Label>
                                        <Input
                                            id="qualification"
                                            placeholder="e.g., M.Sc. Mathematics, B.Ed"
                                            value={newTeacher.qualification}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="experience">Experience</Label>
                                        <Input
                                            id="experience"
                                            placeholder="e.g., 5 years"
                                            value={newTeacher.experience}
                                            onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddTeacher}>Add Teacher</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <Card className="bg-gradient-to-br from-green-500 to-teal-600 border-0">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">{stats.total}</p>
                                <p className="text-sm text-green-100">Total Teachers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.active}</p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.onLeave}</p>
                                <p className="text-sm text-muted-foreground">On Leave</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                                <DollarSign className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">{formatCurrency(stats.totalSalary)}</p>
                                <p className="text-sm text-muted-foreground">Total Salary</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.avgRating}</p>
                                <p className="text-sm text-muted-foreground">Avg Rating</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{departments.length}</p>
                                <p className="text-sm text-muted-foreground">Departments</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Teachers Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search teachers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="on-leave">On Leave</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery('')
                                    setDepartmentFilter('all')
                                    setStatusFilter('all')
                                }}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teacher</TableHead>
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
                                {filteredTeachers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No teachers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTeachers.map((teacher) => (
                                        <TableRow key={teacher.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={teacher.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
                                                            {getInitials(teacher.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{teacher.name}</p>
                                                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono">{teacher.employeeId}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium">
                                                    {teacher.department}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {teacher.subjects.slice(0, 2).map((subject, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                    {teacher.subjects.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{teacher.subjects.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{formatCurrency(teacher.salary)}</TableCell>
                                            <TableCell>{renderStars(teacher.rating)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusBadgeVariant(teacher.status)}
                                                    className="cursor-pointer"
                                                    onClick={() => handleCycleStatus(teacher)}
                                                >
                                                    {teacher.status}
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
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedTeacher(teacher)
                                                                setIsViewDialogOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedTeacher(teacher)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleStatusChange(teacher, 'active')}>
                                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                                            Set Active
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(teacher, 'on-leave')}>
                                                            <Clock className="mr-2 h-4 w-4 text-amber-500" />
                                                            Set On Leave
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedTeacher(teacher)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredTeachers.length} of {teachers.length} teachers
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Teacher Details</DialogTitle>
                    </DialogHeader>
                    {selectedTeacher && (
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="academic">Academic</TabsTrigger>
                                <TabsTrigger value="salary">Salary</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile" className="space-y-4 mt-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={selectedTeacher.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-xl">
                                            {getInitials(selectedTeacher.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                                        <p className="text-muted-foreground">{selectedTeacher.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{selectedTeacher.employeeId}</Badge>
                                            <Badge variant={getStatusBadgeVariant(selectedTeacher.status)}>
                                                {selectedTeacher.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone</p>
                                            <p className="font-medium">{selectedTeacher.phone}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Department</p>
                                            <p className="font-medium">{selectedTeacher.department}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Qualification</p>
                                            <p className="font-medium">{selectedTeacher.qualification}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Experience</p>
                                            <p className="font-medium">{selectedTeacher.experience}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Join Date</p>
                                        <p className="font-medium">{selectedTeacher.joinDate}</p>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="academic" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 text-white text-center">
                                        <Star className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">{selectedTeacher.rating}</p>
                                        <p className="text-sm opacity-90">Average Rating</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-center">
                                        <Users className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">{selectedTeacher.classes.length}</p>
                                        <p className="text-sm opacity-90">Classes Assigned</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Subjects</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTeacher.subjects.map((subject, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Assigned Classes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTeacher.classes.map((cls, index) => (
                                            <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                                                {cls}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="salary" className="space-y-4 mt-4">
                                <div className="p-6 rounded-lg border text-center">
                                    <DollarSign className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                    <p className="text-sm text-muted-foreground">Monthly Salary</p>
                                    <p className="text-4xl font-bold text-green-600">{formatCurrency(selectedTeacher.salary)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg border text-center">
                                        <p className="text-sm text-muted-foreground">Annual Salary</p>
                                        <p className="text-xl font-bold">{formatCurrency(selectedTeacher.salary * 12)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg border text-center">
                                        <p className="text-sm text-muted-foreground">Per Class Rate</p>
                                        <p className="text-xl font-bold">{formatCurrency(Math.round(selectedTeacher.salary / (selectedTeacher.classes.length * 20)))}/class</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Teacher</DialogTitle>
                        <DialogDescription>
                            Update teacher information.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTeacher && (
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={selectedTeacher.name}
                                        onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={selectedTeacher.email}
                                        onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                        id="edit-phone"
                                        value={selectedTeacher.phone}
                                        onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Select
                                        value={selectedTeacher.department}
                                        onValueChange={(value) => setSelectedTeacher({ ...selectedTeacher, department: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts'].map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-qualification">Qualification</Label>
                                    <Input
                                        id="edit-qualification"
                                        value={selectedTeacher.qualification}
                                        onChange={(e) => setSelectedTeacher({ ...selectedTeacher, qualification: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-experience">Experience</Label>
                                    <Input
                                        id="edit-experience"
                                        value={selectedTeacher.experience}
                                        onChange={(e) => setSelectedTeacher({ ...selectedTeacher, experience: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-salary">Salary (₹)</Label>
                                <Input
                                    id="edit-salary"
                                    type="number"
                                    value={selectedTeacher.salary}
                                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, salary: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    value={selectedTeacher.status}
                                    onValueChange={(value: 'active' | 'on-leave' | 'inactive') => setSelectedTeacher({ ...selectedTeacher, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="on-leave">On Leave</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditTeacher}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Teacher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove{' '}
                            <span className="font-semibold">{selectedTeacher?.name}</span> from the system
                            and delete all associated records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTeacher}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Remove Teacher
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
