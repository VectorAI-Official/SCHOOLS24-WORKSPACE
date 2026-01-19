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
import {
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Download,
    Eye,
    Shield,
    GraduationCap,
    BookOpen,
    Users,
    CheckCircle2,
    XCircle,
    Filter,
    RefreshCw,
    Plus,
    Upload,
} from 'lucide-react'
import { mockUsers, User } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(mockUsers)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [newUser, setNewUser] = useState<Partial<User>>({
        name: '',
        email: '',
        role: 'student',
        status: 'active',
        phone: '',
        department: '',
        avatar: '/avatars/01.png'
    })

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
    })

    const userStats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        students: users.filter(u => u.role === 'student').length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
    }



    const handleEditUser = () => {
        if (!selectedUser) return

        setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
        setIsEditDialogOpen(false)
        toast.success('User updated successfully', {
            description: `${selectedUser.name}'s details have been updated`,
        })
    }

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast.error('Missing fields', {
                description: 'Please fill in Name and Email'
            })
            return
        }

        const user: User = {
            id: `usr-${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as 'admin' | 'teacher' | 'student',
            status: newUser.status as 'active' | 'inactive',
            phone: newUser.phone,
            department: newUser.department,
            avatar: newUser.avatar || '/avatars/01.png'
        }

        setUsers([user, ...users])
        setIsAddDialogOpen(false)
        setNewUser({
            name: '',
            email: '',
            role: 'student',
            status: 'active',
            phone: '',
            department: '',
            avatar: '/avatars/01.png'
        })
        toast.success('User added successfully', {
            description: `${user.name} has been added to the system`,
        })
    }

    const handleImport = () => {
        toast.info('Importing users...', {
            description: 'Parsing CSV file and updating records'
        })

        setTimeout(() => {
            toast.success('Import completed', {
                description: 'Successfully imported 15 new users'
            })
        }, 1500)
    }

    const handleDeleteUser = () => {
        if (!selectedUser) return

        setUsers(users.filter(u => u.id !== selectedUser.id))
        setIsDeleteDialogOpen(false)
        toast.success('User deleted successfully', {
            description: `${selectedUser.name} has been removed from the system`,
        })
    }

    const handleToggleStatus = (user: User) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active'
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`, {
            description: `${user.name} is now ${newStatus}`,
        })
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-4 w-4" />
            case 'teacher':
                return <BookOpen className="h-4 w-4" />
            case 'student':
                return <GraduationCap className="h-4 w-4" />
            default:
                return <Users className="h-4 w-4" />
        }
    }

    const getRoleBadgeVariant = (role: string): "default" | "success" | "warning" | "secondary" => {
        switch (role) {
            case 'admin':
                return 'default'
            case 'teacher':
                return 'success'
            case 'student':
                return 'warning'
            default:
                return 'secondary'
        }
    }

    const exportUsers = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Phone', 'Department', 'Status'].join(','),
            ...filteredUsers.map(u =>
                [u.name, u.email, u.role, u.phone || '', u.department || '', u.status].join(',')
            )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'users.csv'
        a.click()
        toast.success('Export completed', {
            description: 'Users data has been exported to CSV',
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage all users in the system</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleImport}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button variant="outline" onClick={exportUsers}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{userStats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{userStats.admins}</p>
                                <p className="text-xs text-muted-foreground">Admins</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{userStats.teachers}</p>
                                <p className="text-xs text-muted-foreground">Teachers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{userStats.students}</p>
                                <p className="text-xs text-muted-foreground">Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{userStats.active}</p>
                                <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{userStats.inactive}</p>
                                <p className="text-xs text-muted-foreground">Inactive</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery('')
                                    setRoleFilter('all')
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
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                                                    {getRoleIcon(user.role)}
                                                    <span className="capitalize">{user.role}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{user.phone || '-'}</TableCell>
                                            <TableCell>{user.department || '-'}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.status === 'active' ? 'success' : 'destructive'}
                                                    className="cursor-pointer"
                                                    onClick={() => handleToggleStatus(user)}
                                                >
                                                    {user.status === 'active' ? (
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                    )}
                                                    {user.status}
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
                                                                setSelectedUser(user)
                                                                setIsViewDialogOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
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
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={selectedUser.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xl">
                                        {getInitials(selectedUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                    <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="mt-2 gap-1">
                                        {getRoleIcon(selectedUser.role)}
                                        <span className="capitalize">{selectedUser.role}</span>
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted">
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={selectedUser.status === 'active' ? 'success' : 'destructive'}>
                                        {selectedUser.status}
                                    </Badge>
                                </div>
                                {selectedUser.department && (
                                    <div className="p-3 rounded-lg bg-muted col-span-2">
                                        <p className="text-sm text-muted-foreground">Department</p>
                                        <p className="font-medium">{selectedUser.department}</p>
                                    </div>
                                )}
                            </div>
                        </div>
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                    id="edit-name"
                                    value={selectedUser.name}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email Address</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                        value={selectedUser.role}
                                        onValueChange={(value: 'admin' | 'teacher' | 'student') =>
                                            setSelectedUser({ ...selectedUser, role: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="student">Student</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                        value={selectedUser.status}
                                        onValueChange={(value: 'active' | 'inactive') =>
                                            setSelectedUser({ ...selectedUser, status: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-phone">Phone Number</Label>
                                <Input
                                    id="edit-phone"
                                    value={selectedUser.phone || ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditUser}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete{' '}
                            <span className="font-semibold">{selectedUser?.name}</span>'s account and
                            remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {/* Add User Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Full Name</Label>
                            <Input
                                id="add-name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-email">Email Address</Label>
                            <Input
                                id="add-email"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="john@school.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="add-role">Role</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-status">Status</Label>
                                <Select
                                    value={newUser.status}
                                    onValueChange={(value) => setNewUser({ ...newUser, status: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-phone">Phone Number</Label>
                            <Input
                                id="add-phone"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddUser}>Create User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
