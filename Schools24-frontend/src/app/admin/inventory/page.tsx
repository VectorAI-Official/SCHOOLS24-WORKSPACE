"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, Package, AlertTriangle, CheckCircle, XCircle, Download, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { mockInventory, InventoryItem } from '@/lib/mockData'
import { toast } from 'sonner'

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', category: 'Stationery', quantity: 0, unit: 'pcs', minStock: 10, location: '' })

    const categories = [...new Set(inventory.map(item => item.category))]

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const lowStockItems = inventory.filter(item => item.status === 'low-stock').length
    const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Category', 'Quantity', 'Unit', 'Min Stock', 'Location', 'Status'].join(','),
            ...inventory.map(i => [i.name, i.category, i.quantity, i.unit, i.minStock, i.location, i.status].join(','))
        ].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'inventory.csv'
        a.click()
        toast.success('Export completed', { description: 'Inventory exported to CSV.' })
    }

    const handleAddItem = () => {
        if (!newItem.name) { toast.error('Please enter item name'); return }
        const status = newItem.quantity === 0 ? 'out-of-stock' : newItem.quantity <= newItem.minStock ? 'low-stock' : 'in-stock'
        const item: InventoryItem = { id: String(inventory.length + 1), ...newItem, lastUpdated: new Date().toISOString().split('T')[0], status }
        setInventory([...inventory, item])
        setNewItem({ name: '', category: 'Stationery', quantity: 0, unit: 'pcs', minStock: 10, location: '' })
        setIsAddDialogOpen(false)
        toast.success('Item added', { description: `${item.name} added to inventory.` })
    }

    const handleDeleteItem = (item: InventoryItem) => {
        setInventory(inventory.filter(i => i.id !== item.id))
        toast.success('Item deleted', { description: `${item.name} removed from inventory.` })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Resource Inventory</h1>
                    <p className="text-muted-foreground">Manage school resources and supplies</p>
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
                                Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Item</DialogTitle>
                                <DialogDescription>Add a new item to inventory.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Item Name *</Label>
                                    <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Enter item name" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Stationery">Stationery</SelectItem>
                                                <SelectItem value="Electronics">Electronics</SelectItem>
                                                <SelectItem value="Furniture">Furniture</SelectItem>
                                                <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Location</Label>
                                        <Input value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} placeholder="Store Room A" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Quantity</Label>
                                        <Input type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Unit</Label>
                                        <Select value={newItem.unit} onValueChange={(v) => setNewItem({ ...newItem, unit: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pcs">pcs</SelectItem>
                                                <SelectItem value="boxes">boxes</SelectItem>
                                                <SelectItem value="sets">sets</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Min Stock</Label>
                                        <Input type="number" value={newItem.minStock} onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddItem}>Add Item</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{mockInventory.length}</p>
                                <p className="text-sm text-muted-foreground">Total Items</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{mockInventory.filter(i => i.status === 'in-stock').length}</p>
                                <p className="text-sm text-muted-foreground">In Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{lowStockItems}</p>
                                <p className="text-sm text-muted-foreground">Low Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white">
                                <XCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{outOfStockItems}</p>
                                <p className="text-sm text-muted-foreground">Out of Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Min Stock</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>{item.quantity} {item.unit}</TableCell>
                                    <TableCell>{item.minStock} {item.unit}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>{item.lastUpdated}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.status === 'in-stock' ? 'success' :
                                                item.status === 'low-stock' ? 'warning' : 'destructive'
                                        }>
                                            {item.status === 'in-stock' ? 'In Stock' :
                                                item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
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
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteItem(item)}>
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
