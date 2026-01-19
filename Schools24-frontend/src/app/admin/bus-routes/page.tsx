"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Search,
    Plus,
    Bus,
    MapPin,
    Phone,
    User,
    Edit,
    Trash2,
    Clock,
    Users,
    Route,
    Navigation,
    CheckCircle2,
    AlertCircle,
    Download,
    RefreshCw
} from 'lucide-react'
import { mockBusRoutes, BusRoute } from '@/lib/mockData'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface RouteFormData {
    routeNumber: string
    vehicleNumber: string
    driverName: string
    driverPhone: string
    capacity: number
    stops: string
    status: 'active' | 'inactive'
}

const initialFormData: RouteFormData = {
    routeNumber: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    capacity: 40,
    stops: '',
    status: 'active',
}

export default function BusRoutesPage() {
    const [routes, setRoutes] = useState<BusRoute[]>(mockBusRoutes)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Form data
    const [formData, setFormData] = useState<RouteFormData>(initialFormData)
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null)

    const filteredRoutes = routes.filter(route => {
        const matchesSearch = route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || route.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        totalRoutes: routes.length,
        activeRoutes: routes.filter(r => r.status === 'active').length,
        inactiveRoutes: routes.filter(r => r.status === 'inactive').length,
        totalStudents: routes.reduce((sum, r) => sum + r.currentStudents, 0),
        totalCapacity: routes.reduce((sum, r) => sum + r.capacity, 0),
        totalStops: routes.reduce((sum, r) => sum + r.stops.length, 0),
    }

    const parseStops = (stopsText: string): { name: string; time: string }[] => {
        return stopsText
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const parts = line.split('-').map(p => p.trim())
                return {
                    name: parts[0] || '',
                    time: parts[1] || '07:00 AM',
                }
            })
    }

    const stopsToText = (stops: { name: string; time: string }[]): string => {
        return stops.map(s => `${s.name} - ${s.time}`).join('\n')
    }

    const handleAddRoute = () => {
        if (!formData.routeNumber || !formData.vehicleNumber || !formData.driverName) {
            toast.error('Please fill in all required fields', {
                description: 'Route number, vehicle number, and driver name are required.',
            })
            return
        }

        const newRoute: BusRoute = {
            id: String(routes.length + 1),
            routeNumber: formData.routeNumber,
            vehicleNumber: formData.vehicleNumber,
            driverName: formData.driverName,
            driverPhone: formData.driverPhone,
            capacity: formData.capacity,
            currentStudents: 0,
            stops: parseStops(formData.stops),
            status: formData.status,
        }

        setRoutes([...routes, newRoute])
        setFormData(initialFormData)
        setIsAddDialogOpen(false)

        toast.success('Route added successfully', {
            description: `Route ${newRoute.routeNumber} has been created.`,
        })
    }

    const handleEditRoute = () => {
        if (!selectedRoute) return

        if (!formData.routeNumber || !formData.vehicleNumber || !formData.driverName) {
            toast.error('Please fill in all required fields', {
                description: 'Route number, vehicle number, and driver name are required.',
            })
            return
        }

        const updatedRoute: BusRoute = {
            ...selectedRoute,
            routeNumber: formData.routeNumber,
            vehicleNumber: formData.vehicleNumber,
            driverName: formData.driverName,
            driverPhone: formData.driverPhone,
            capacity: formData.capacity,
            stops: parseStops(formData.stops),
            status: formData.status,
        }

        setRoutes(routes.map(r => r.id === selectedRoute.id ? updatedRoute : r))
        setFormData(initialFormData)
        setSelectedRoute(null)
        setIsEditDialogOpen(false)

        toast.success('Route updated successfully', {
            description: `Route ${updatedRoute.routeNumber} has been updated.`,
        })
    }

    const handleDeleteRoute = () => {
        if (!selectedRoute) return

        setRoutes(routes.filter(r => r.id !== selectedRoute.id))
        setSelectedRoute(null)
        setIsDeleteDialogOpen(false)

        toast.success('Route deleted successfully', {
            description: `Route ${selectedRoute.routeNumber} has been removed.`,
        })
    }

    const openEditDialog = (route: BusRoute) => {
        setSelectedRoute(route)
        setFormData({
            routeNumber: route.routeNumber,
            vehicleNumber: route.vehicleNumber,
            driverName: route.driverName,
            driverPhone: route.driverPhone,
            capacity: route.capacity,
            stops: stopsToText(route.stops),
            status: route.status,
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (route: BusRoute) => {
        setSelectedRoute(route)
        setIsDeleteDialogOpen(true)
    }

    const handleExport = () => {
        const csvContent = [
            ['Route Number', 'Vehicle Number', 'Driver Name', 'Driver Phone', 'Capacity', 'Current Students', 'Stops', 'Status'].join(','),
            ...routes.map(r => [
                r.routeNumber,
                r.vehicleNumber,
                r.driverName,
                r.driverPhone,
                r.capacity,
                r.currentStudents,
                r.stops.map(s => `${s.name} (${s.time})`).join('; '),
                r.status
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'bus-routes.csv'
        a.click()

        toast.success('Export completed', {
            description: 'Bus routes data has been exported to CSV.',
        })
    }

    const toggleRouteStatus = (route: BusRoute) => {
        const newStatus = route.status === 'active' ? 'inactive' : 'active'
        setRoutes(routes.map(r => r.id === route.id ? { ...r, status: newStatus } : r))

        toast.success('Status updated', {
            description: `Route ${route.routeNumber} is now ${newStatus}.`,
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Bus Routes Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage school bus routes, drivers, and schedules</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 border-0 shadow-lg shadow-indigo-500/25">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Route
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Bus className="h-5 w-5 text-indigo-500" />
                                    Add New Bus Route
                                </DialogTitle>
                                <DialogDescription>
                                    Create a new bus route with driver and stop details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-routeNumber">Route Number *</Label>
                                        <Input
                                            id="add-routeNumber"
                                            placeholder="e.g., R-001"
                                            value={formData.routeNumber}
                                            onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-vehicleNumber">Vehicle Number *</Label>
                                        <Input
                                            id="add-vehicleNumber"
                                            placeholder="e.g., DL-01-AB-1234"
                                            value={formData.vehicleNumber}
                                            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-driverName">Driver Name *</Label>
                                        <Input
                                            id="add-driverName"
                                            placeholder="Enter driver name"
                                            value={formData.driverName}
                                            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-driverPhone">Driver Phone</Label>
                                        <Input
                                            id="add-driverPhone"
                                            placeholder="Enter phone number"
                                            value={formData.driverPhone}
                                            onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-capacity">Capacity</Label>
                                        <Input
                                            id="add-capacity"
                                            type="number"
                                            placeholder="Enter bus capacity"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="add-stops">Stops (one per line: Stop Name - Time)</Label>
                                    <Textarea
                                        id="add-stops"
                                        placeholder="Green Park - 07:00 AM&#10;Hauz Khas - 07:15 AM&#10;Saket - 07:30 AM"
                                        rows={4}
                                        value={formData.stops}
                                        onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
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
                                <Button
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600"
                                    onClick={handleAddRoute}
                                >
                                    Create Route
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                    <CardContent className="p-6">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <Bus className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">{stats.totalRoutes}</p>
                                <p className="text-sm text-indigo-100">Total Routes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <CardContent className="p-6">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <CheckCircle2 className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">{stats.activeRoutes}</p>
                                <p className="text-sm text-emerald-100">Active Routes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600">
                    <CardContent className="p-6">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                                <p className="text-sm text-amber-100">Total Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-500 to-violet-600">
                    <CardContent className="p-6">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <MapPin className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">{stats.totalStops}</p>
                                <p className="text-sm text-violet-100">Total Stops</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by route number, driver name, or vehicle..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'active' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('active')}
                                className={statusFilter === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                            >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Active
                            </Button>
                            <Button
                                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('inactive')}
                                className={statusFilter === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
                            >
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Inactive
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery('')
                                    setStatusFilter('all')
                                }}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Routes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoutes.map((route, index) => (
                    <Card
                        key={route.id}
                        className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden stagger-${index + 1} animate-slide-up`}
                    >
                        {/* Card Header with gradient */}
                        <div className={`p-4 ${route.status === 'active' ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-gradient-to-r from-slate-400 to-slate-500'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                        <Bus className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Route {route.routeNumber}</h3>
                                        <p className="text-sm text-white/80">{route.vehicleNumber}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => toggleRouteStatus(route)}
                                >
                                    <Badge
                                        variant={route.status === 'active' ? 'success' : 'destructive'}
                                        className="px-3 py-1 cursor-pointer"
                                    >
                                        {route.status === 'active' ? (
                                            <><CheckCircle2 className="mr-1 h-3 w-3" /> Active</>
                                        ) : (
                                            <><AlertCircle className="mr-1 h-3 w-3" /> Inactive</>
                                        )}
                                    </Badge>
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-5 space-y-5">
                            {/* Driver Info */}
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                    <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{route.driverName}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        <span>{route.driverPhone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Capacity
                                    </span>
                                    <span className="text-sm font-bold">
                                        {route.currentStudents}/{route.capacity} students
                                    </span>
                                </div>
                                <div className="relative">
                                    <Progress
                                        value={(route.currentStudents / route.capacity) * 100}
                                        className="h-3 rounded-full"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                    {Math.round((route.currentStudents / route.capacity) * 100)}% filled
                                </p>
                            </div>

                            {/* Stops Timeline */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Route className="h-4 w-4 text-muted-foreground" />
                                        Stops
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                        {route.stops.length} stops
                                    </Badge>
                                </div>
                                <div className="space-y-0 max-h-40 overflow-auto pr-2">
                                    {route.stops.map((stop, stopIndex) => (
                                        <div key={stopIndex} className="relative pl-6 pb-3 last:pb-0">
                                            {/* Timeline line */}
                                            {stopIndex !== route.stops.length - 1 && (
                                                <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-violet-500" />
                                            )}
                                            {/* Timeline dot */}
                                            <div className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${stopIndex === 0
                                                    ? 'bg-indigo-500 border-indigo-500'
                                                    : stopIndex === route.stops.length - 1
                                                        ? 'bg-violet-500 border-violet-500'
                                                        : 'bg-white dark:bg-slate-900 border-indigo-400'
                                                }`} />
                                            {/* Stop info */}
                                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{stop.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{stop.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                                    onClick={() => openEditDialog(route)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                    onClick={() => openDeleteDialog(route)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty state */}
            {filteredRoutes.length === 0 && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                            <Bus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No routes found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('')
                                setStatusFilter('all')
                            }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Clear filters
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Summary Footer */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/30 dark:via-violet-950/30 dark:to-purple-950/30">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                <Navigation className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Fleet Overview</p>
                                <p className="text-sm text-muted-foreground">
                                    {stats.totalStudents} students across {stats.totalRoutes} routes
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalCapacity > 0 ? Math.round((stats.totalStudents / stats.totalCapacity) * 100) : 0}%</p>
                                <p className="text-xs text-muted-foreground">Fleet Utilization</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.activeRoutes}</p>
                                <p className="text-xs text-muted-foreground">Routes Active</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.totalStops}</p>
                                <p className="text-xs text-muted-foreground">Total Stops</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-indigo-500" />
                            Edit Bus Route
                        </DialogTitle>
                        <DialogDescription>
                            Update the route details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-routeNumber">Route Number *</Label>
                                <Input
                                    id="edit-routeNumber"
                                    placeholder="e.g., R-001"
                                    value={formData.routeNumber}
                                    onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-vehicleNumber">Vehicle Number *</Label>
                                <Input
                                    id="edit-vehicleNumber"
                                    placeholder="e.g., DL-01-AB-1234"
                                    value={formData.vehicleNumber}
                                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-driverName">Driver Name *</Label>
                                <Input
                                    id="edit-driverName"
                                    placeholder="Enter driver name"
                                    value={formData.driverName}
                                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-driverPhone">Driver Phone</Label>
                                <Input
                                    id="edit-driverPhone"
                                    placeholder="Enter phone number"
                                    value={formData.driverPhone}
                                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-capacity">Capacity</Label>
                                <Input
                                    id="edit-capacity"
                                    type="number"
                                    placeholder="Enter bus capacity"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-stops">Stops (one per line: Stop Name - Time)</Label>
                            <Textarea
                                id="edit-stops"
                                placeholder="Green Park - 07:00 AM&#10;Hauz Khas - 07:15 AM&#10;Saket - 07:30 AM"
                                rows={4}
                                value={formData.stops}
                                onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setFormData(initialFormData)
                            setSelectedRoute(null)
                            setIsEditDialogOpen(false)
                        }}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-indigo-600 to-violet-600"
                            onClick={handleEditRoute}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Delete Route
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold">Route {selectedRoute?.routeNumber}</span>?
                            This action cannot be undone and will affect {selectedRoute?.currentStudents} students currently assigned to this route.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setSelectedRoute(null)
                            setIsDeleteDialogOpen(false)
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDeleteRoute}
                        >
                            Delete Route
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
