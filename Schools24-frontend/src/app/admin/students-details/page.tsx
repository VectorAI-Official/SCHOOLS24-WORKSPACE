"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
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
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Download,
    Upload,
    Eye,
    GraduationCap,
    Users,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    TrendingUp,
    Award,
    BookOpen,
    Filter,
    RefreshCw,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react'
import { mockStudents, Student } from '@/lib/mockData'
import { getInitials, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function StudentsDetailsPage() {
    const [students, setStudents] = useState<Student[]>(mockStudents)
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [feeFilter, setFeeFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        phone: '',
        class: '',
        section: '',
        rollNumber: '',
        parentName: '',
        parentPhone: '',
        address: '',
        dateOfBirth: '',
    })

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || student.class === classFilter
        const matchesFee = feeFilter === 'all' || student.fees.status === feeFilter
        return matchesSearch && matchesClass && matchesFee
    })

    const stats = {
        total: students.length,
        classWise: {
            '9': students.filter(s => s.class === '9').length,
            '10': students.filter(s => s.class === '10').length,
        },
        feesPaid: students.filter(s => s.fees.status === 'paid').length,
        feesPartial: students.filter(s => s.fees.status === 'partial').length,
        feesPending: students.filter(s => s.fees.status === 'pending').length,
        averageAttendance: Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length),
    }

    const classes = [...new Set(students.map(s => s.class))].sort()

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.email || !newStudent.class) {
            toast.error('Please fill in all required fields')
            return
        }

        const student: Student = {
            id: String(students.length + 1),
            ...newStudent,
            admissionDate: new Date().toISOString().split('T')[0],
            attendance: 0,
            grade: 'N/A',
            fees: { total: 120000, paid: 0, pending: 120000, status: 'pending' },
            performance: {
                rank: students.length + 1,
                totalStudents: students.length + 1,
                averageScore: 0,
                subjects: [],
            },
        }
        setStudents([...students, student])
        setNewStudent({
            name: '',
            email: '',
            phone: '',
            class: '',
            section: '',
            rollNumber: '',
            parentName: '',
            parentPhone: '',
            address: '',
            dateOfBirth: '',
        })
        setIsAddDialogOpen(false)
        toast.success('Student added successfully', {
            description: `${student.name} has been enrolled in Class ${student.class}-${student.section}`,
        })
    }

    const handleEditStudent = () => {
        if (!selectedStudent) return

        setStudents(students.map(s => s.id === selectedStudent.id ? selectedStudent : s))
        setIsEditDialogOpen(false)
        toast.success('Student updated successfully', {
            description: `${selectedStudent.name}'s details have been updated`,
        })
    }

    const handleDeleteStudent = () => {
        if (!selectedStudent) return

        setStudents(students.filter(s => s.id !== selectedStudent.id))
        setIsDeleteDialogOpen(false)
        toast.success('Student removed successfully', {
            description: `${selectedStudent.name} has been removed from the system`,
        })
    }

    const handleImport = () => {
        toast.info('Importing students...', {
            description: 'Parsing CSV file and updating records'
        })

        setTimeout(() => {
            toast.success('Import completed', {
                description: 'Successfully imported 25 new students'
            })
        }, 1500)
    }

    const handleToggleFeeStatus = (student: Student) => {
        const statuses: ('paid' | 'pending' | 'partial')[] = ['pending', 'partial', 'paid']
        const checkStatus = (s: string): s is 'paid' | 'pending' | 'partial' => {
            return statuses.includes(s as any)
        }

        const currentStatus = checkStatus(student.fees.status) ? student.fees.status : 'pending'
        const currentIndex = statuses.indexOf(currentStatus)
        const newStatus = statuses[(currentIndex + 1) % statuses.length]

        setStudents(students.map(s =>
            s.id === student.id
                ? { ...s, fees: { ...s.fees, status: newStatus } }
                : s
        ))

        toast.success('Fee status updated', {
            description: `${student.name}'s fee status is now ${newStatus}`,
        })
    }

    const exportStudents = () => {
        const csvContent = [
            ['Name', 'Email', 'Phone', 'Class', 'Section', 'Roll No', 'Parent Name', 'Attendance', 'Grade', 'Fee Status'].join(','),
            ...filteredStudents.map(s =>
                [s.name, s.email, s.phone, s.class, s.section, s.rollNumber, s.parentName, s.attendance, s.grade, s.fees.status].join(',')
            )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'students.csv'
        a.click()
        toast.success('Export completed', {
            description: 'Students data has been exported to CSV',
        })
    }

    const getFeesBadgeVariant = (status: string) => {
        switch (status) {
            case 'paid':
                return 'success'
            case 'partial':
                return 'warning'
            case 'pending':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Students Details</h1>
                    <p className="text-muted-foreground">View and manage all student records</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleImport}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>

                    <Button variant="outline" onClick={exportStudents}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add New Student</DialogTitle>
                                <DialogDescription>
                                    Enroll a new student in the school.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter full name"
                                            value={newStudent.name}
                                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={newStudent.email}
                                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="class">Class *</Label>
                                        <Select
                                            value={newStudent.class}
                                            onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['6', '7', '8', '9', '10', '11', '12'].map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="section">Section *</Label>
                                        <Select
                                            value={newStudent.section}
                                            onValueChange={(value) => setNewStudent({ ...newStudent, section: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['A', 'B', 'C', 'D'].map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="rollNumber">Roll Number *</Label>
                                        <Input
                                            id="rollNumber"
                                            placeholder="e.g., 1001"
                                            value={newStudent.rollNumber}
                                            onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="Enter phone"
                                            value={newStudent.phone}
                                            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            value={newStudent.dateOfBirth}
                                            onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="parentName">Parent Name</Label>
                                        <Input
                                            id="parentName"
                                            placeholder="Enter parent name"
                                            value={newStudent.parentName}
                                            onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="parentPhone">Parent Phone</Label>
                                        <Input
                                            id="parentPhone"
                                            placeholder="Enter parent phone"
                                            value={newStudent.parentPhone}
                                            onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Enter full address"
                                        value={newStudent.address}
                                        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddStudent}>Enroll Student</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">{stats.total}</p>
                                <p className="text-sm text-blue-100">Total Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.feesPaid}</p>
                                <p className="text-sm text-muted-foreground">Fees Paid</p>
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
                                <p className="text-3xl font-bold">{stats.feesPartial}</p>
                                <p className="text-sm text-muted-foreground">Partial Paid</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.feesPending}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.averageAttendance}%</p>
                                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map(c => (
                                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={feeFilter} onValueChange={setFeeFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Fee Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery('')
                                    setClassFilter('all')
                                    setFeeFilter('all')
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
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Roll No</TableHead>
                                    <TableHead>Parent</TableHead>
                                    <TableHead>Attendance</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Fees</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No students found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={student.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                                            {getInitials(student.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{student.name}</p>
                                                        <p className="text-sm text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium">
                                                    {student.class}-{student.section}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono">{student.rollNumber}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm">{student.parentName}</p>
                                                    <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={student.attendance}
                                                        className="w-16 h-2"
                                                    />
                                                    <span className="text-sm font-medium">{student.attendance}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    student.grade.includes('A') ? 'success' :
                                                        student.grade.includes('B') ? 'warning' : 'secondary'
                                                }>
                                                    {student.grade}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Badge
                                                        variant={getFeesBadgeVariant(student.fees.status) as any}
                                                        className="cursor-pointer"
                                                        onClick={() => handleToggleFeeStatus(student)}
                                                    >
                                                        {student.fees.status}
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatCurrency(student.fees.paid)} / {formatCurrency(student.fees.total)}
                                                    </p>
                                                </div>
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
                                                                setSelectedStudent(student)
                                                                setIsViewDialogOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedStudent(student)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            Generate Report
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedStudent(student)
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
                            Showing {filteredStudents.length} of {students.length} students
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="academic">Academic</TabsTrigger>
                                <TabsTrigger value="fees">Fees</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile" className="space-y-4 mt-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={selectedStudent.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
                                            {getInitials(selectedStudent.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                                        <p className="text-muted-foreground">{selectedStudent.email}</p>
                                        <Badge variant="outline" className="mt-2">
                                            Class {selectedStudent.class}-{selectedStudent.section} | Roll: {selectedStudent.rollNumber}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone</p>
                                            <p className="font-medium">{selectedStudent.phone}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Date of Birth</p>
                                            <p className="font-medium">{selectedStudent.dateOfBirth}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Parent</p>
                                            <p className="font-medium">{selectedStudent.parentName}</p>
                                            <p className="text-xs text-muted-foreground">{selectedStudent.parentPhone}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Admission Date</p>
                                            <p className="font-medium">{selectedStudent.admissionDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Address</p>
                                        <p className="font-medium">{selectedStudent.address}</p>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="academic" className="space-y-4 mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-center">
                                        <Award className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">#{selectedStudent.performance.rank}</p>
                                        <p className="text-sm opacity-90">Class Rank</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white text-center">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">{selectedStudent.performance.averageScore}%</p>
                                        <p className="text-sm opacity-90">Average Score</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-center">
                                        <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">{selectedStudent.attendance}%</p>
                                        <p className="text-sm opacity-90">Attendance</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Subject-wise Performance</h4>
                                    {selectedStudent.performance.subjects.map((subject, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span>{subject.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Progress value={subject.score} className="w-24 h-2" />
                                                <span className="font-medium w-12 text-right">{subject.score}%</span>
                                                <Badge variant={subject.grade.includes('A') ? 'success' : subject.grade.includes('B') ? 'warning' : 'secondary'}>
                                                    {subject.grade}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="fees" className="space-y-4 mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg border text-center">
                                        <p className="text-sm text-muted-foreground">Total Fees</p>
                                        <p className="text-2xl font-bold">{formatCurrency(selectedStudent.fees.total)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg border text-center bg-green-50 dark:bg-green-900/20">
                                        <p className="text-sm text-muted-foreground">Paid</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedStudent.fees.paid)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg border text-center bg-red-50 dark:bg-red-900/20">
                                        <p className="text-sm text-muted-foreground">Pending</p>
                                        <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedStudent.fees.pending)}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-muted-foreground">Payment Progress</span>
                                        <Badge variant={getFeesBadgeVariant(selectedStudent.fees.status) as any}>
                                            {selectedStudent.fees.status}
                                        </Badge>
                                    </div>
                                    <Progress
                                        value={(selectedStudent.fees.paid / selectedStudent.fees.total) * 100}
                                        className="h-3"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2 text-right">
                                        {Math.round((selectedStudent.fees.paid / selectedStudent.fees.total) * 100)}% paid
                                    </p>
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
                        <DialogTitle>Edit Student</DialogTitle>
                        <DialogDescription>
                            Update student information.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={selectedStudent.name}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={selectedStudent.email}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-class">Class</Label>
                                    <Select
                                        value={selectedStudent.class}
                                        onValueChange={(value) => setSelectedStudent({ ...selectedStudent, class: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['6', '7', '8', '9', '10', '11', '12'].map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-section">Section</Label>
                                    <Select
                                        value={selectedStudent.section}
                                        onValueChange={(value) => setSelectedStudent({ ...selectedStudent, section: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['A', 'B', 'C', 'D'].map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-roll">Roll Number</Label>
                                    <Input
                                        id="edit-roll"
                                        value={selectedStudent.rollNumber}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, rollNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                        id="edit-phone"
                                        value={selectedStudent.phone}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-dob">Date of Birth</Label>
                                    <Input
                                        id="edit-dob"
                                        type="date"
                                        value={selectedStudent.dateOfBirth}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, dateOfBirth: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-parent">Parent Name</Label>
                                    <Input
                                        id="edit-parent"
                                        value={selectedStudent.parentName}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, parentName: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-parent-phone">Parent Phone</Label>
                                    <Input
                                        id="edit-parent-phone"
                                        value={selectedStudent.parentPhone}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, parentPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-address">Address</Label>
                                <Input
                                    id="edit-address"
                                    value={selectedStudent.address}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, address: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditStudent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove{' '}
                            <span className="font-semibold">{selectedStudent?.name}</span> from the system
                            and delete all associated records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteStudent}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Remove Student
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
