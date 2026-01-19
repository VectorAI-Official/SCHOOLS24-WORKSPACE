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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Plus, DollarSign, Download, TrendingUp, AlertCircle, CheckCircle, Send, Receipt, CreditCard } from 'lucide-react'
import { mockFeeRecords, FeeRecord } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface FeeFormData {
    studentName: string
    studentId: string
    class: string
    feeType: string
    amount: number
    dueDate: string
}

const initialFormData: FeeFormData = {
    studentName: '',
    studentId: '',
    class: '',
    feeType: 'Tuition Fee',
    amount: 0,
    dueDate: '',
}

export default function FeesPage() {
    const [fees, setFees] = useState<FeeRecord[]>(mockFeeRecords)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [formData, setFormData] = useState<FeeFormData>(initialFormData)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
    const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
    const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)
    const [paymentAmount, setPaymentAmount] = useState<number>(0)

    const filteredFees = fees.filter(fee => {
        const matchesSearch = fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fee.studentId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || fee.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
    const paidFees = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0)
    const pendingFees = fees.filter(f => f.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0)
    const overdueFees = fees.filter(f => f.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0)

    const handleAddFee = () => {
        if (!formData.studentName || !formData.studentId || !formData.amount) {
            toast.error('Please fill in required fields', {
                description: 'Student name, ID, and amount are required.',
            })
            return
        }

        const newFee: FeeRecord = {
            id: String(fees.length + 1),
            studentName: formData.studentName,
            studentId: formData.studentId,
            class: formData.class,
            feeType: formData.feeType,
            amount: formData.amount,
            dueDate: formData.dueDate,
            paidDate: undefined,
            status: 'pending',
        }

        setFees([...fees, newFee])
        setFormData(initialFormData)
        setIsAddDialogOpen(false)
        toast.success('Fee entry added', {
            description: `Fee of ${formatCurrency(newFee.amount)} added for ${newFee.studentName}.`,
        })
    }

    const handleRecordPayment = () => {
        if (!selectedFee) return

        if (paymentAmount <= 0) {
            toast.error('Invalid amount', {
                description: 'Please enter a valid payment amount.',
            })
            return
        }

        const updatedFee: FeeRecord = {
            ...selectedFee,
            status: paymentAmount >= selectedFee.amount ? 'paid' : 'pending',
            paidDate: new Date().toISOString().split('T')[0],
        }

        setFees(fees.map(f => f.id === selectedFee.id ? updatedFee : f))
        setSelectedFee(null)
        setPaymentAmount(0)
        setIsPaymentDialogOpen(false)
        toast.success('Payment recorded', {
            description: `Payment of ${formatCurrency(paymentAmount)} recorded for ${selectedFee.studentName}.`,
        })
    }

    const openPaymentDialog = (fee: FeeRecord) => {
        setSelectedFee(fee)
        setPaymentAmount(fee.amount)
        setIsPaymentDialogOpen(true)
    }

    const openReceiptDialog = (fee: FeeRecord) => {
        setSelectedFee(fee)
        setIsReceiptDialogOpen(true)
    }

    const handleSendReminders = () => {
        const pendingCount = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length
        toast.success('Reminders sent', {
            description: `Payment reminders sent to ${pendingCount} students with pending fees.`,
        })
    }

    const handleExport = () => {
        const csvContent = [
            ['Student Name', 'Student ID', 'Class', 'Fee Type', 'Amount', 'Due Date', 'Paid Date', 'Status'].join(','),
            ...fees.map(f => [
                f.studentName,
                f.studentId,
                f.class,
                f.feeType,
                f.amount,
                f.dueDate,
                f.paidDate || '',
                f.status
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'fee-records.csv'
        a.click()
        toast.success('Export completed', {
            description: 'Fee records have been exported to CSV.',
        })
    }

    const handlePrintReceipt = () => {
        toast.success('Receipt generated', {
            description: 'Receipt is ready for printing.',
        })
        setIsReceiptDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Fee Management</h1>
                    <p className="text-muted-foreground">Manage student fees and payments</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" onClick={handleSendReminders}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reminders
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Fee Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Fee Entry</DialogTitle>
                                <DialogDescription>
                                    Create a new fee record for a student.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="studentName">Student Name *</Label>
                                        <Input
                                            id="studentName"
                                            placeholder="Enter student name"
                                            value={formData.studentName}
                                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="studentId">Student ID *</Label>
                                        <Input
                                            id="studentId"
                                            placeholder="e.g., STU001"
                                            value={formData.studentId}
                                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="class">Class</Label>
                                        <Select
                                            value={formData.class}
                                            onValueChange={(value) => setFormData({ ...formData, class: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B'].map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="feeType">Fee Type</Label>
                                        <Select
                                            value={formData.feeType}
                                            onValueChange={(value) => setFormData({ ...formData, feeType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select fee type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                                                <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                                                <SelectItem value="Lab Fee">Lab Fee</SelectItem>
                                                <SelectItem value="Library Fee">Library Fee</SelectItem>
                                                <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                                                <SelectItem value="Sports Fee">Sports Fee</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Amount (₹) *</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={formData.amount || ''}
                                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="dueDate">Due Date</Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => {
                                    setFormData(initialFormData)
                                    setIsAddDialogOpen(false)
                                }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddFee}>Add Fee Entry</Button>
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
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(totalFees)}</p>
                                <p className="text-sm text-muted-foreground">Total Fees</p>
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
                                <p className="text-2xl font-bold">{formatCurrency(paidFees)}</p>
                                <p className="text-sm text-muted-foreground">Collected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(pendingFees)}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(overdueFees)}</p>
                                <p className="text-sm text-muted-foreground">Overdue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'paid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('paid')}
                                className={statusFilter === 'paid' ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                                Paid
                            </Button>
                            <Button
                                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('pending')}
                                className={statusFilter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === 'overdue' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('overdue')}
                                className={statusFilter === 'overdue' ? 'bg-red-500 hover:bg-red-600' : ''}
                            >
                                Overdue
                            </Button>
                        </div>
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by student name..."
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
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Fee Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Paid Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No fee records found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredFees.map((fee) => (
                                    <TableRow key={fee.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{fee.studentName}</p>
                                                <p className="text-sm text-muted-foreground">ID: {fee.studentId}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{fee.class}</TableCell>
                                        <TableCell>{fee.feeType}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(fee.amount)}</TableCell>
                                        <TableCell>{fee.dueDate}</TableCell>
                                        <TableCell>{fee.paidDate || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                fee.status === 'paid' ? 'success' :
                                                    fee.status === 'pending' ? 'warning' : 'destructive'
                                            }>
                                                {fee.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {fee.status !== 'paid' ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openPaymentDialog(fee)}
                                                >
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Record Payment
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => openReceiptDialog(fee)}
                                                >
                                                    <Receipt className="mr-2 h-4 w-4" />
                                                    View Receipt
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Payment Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            Record a payment for {selectedFee?.studentName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="flex justify-between mb-2">
                                <span className="text-muted-foreground">Fee Type:</span>
                                <span className="font-medium">{selectedFee?.feeType}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-muted-foreground">Total Amount:</span>
                                <span className="font-medium">{formatCurrency(selectedFee?.amount || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Due Date:</span>
                                <span className="font-medium">{selectedFee?.dueDate}</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
                            <Input
                                id="paymentAmount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setSelectedFee(null)
                            setPaymentAmount(0)
                            setIsPaymentDialogOpen(false)
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleRecordPayment}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Receipt Dialog */}
            <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Receipt</DialogTitle>
                        <DialogDescription>
                            Receipt for {selectedFee?.studentName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="border rounded-lg p-6 space-y-4">
                            <div className="text-center border-b pb-4">
                                <h3 className="text-xl font-bold">Academify School</h3>
                                <p className="text-sm text-muted-foreground">Payment Receipt</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Receipt No:</p>
                                    <p className="font-medium">RCP-{selectedFee?.id?.padStart(4, '0')}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Date:</p>
                                    <p className="font-medium">{selectedFee?.paidDate}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Student Name:</p>
                                    <p className="font-medium">{selectedFee?.studentName}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Student ID:</p>
                                    <p className="font-medium">{selectedFee?.studentId}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Class:</p>
                                    <p className="font-medium">{selectedFee?.class}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Fee Type:</p>
                                    <p className="font-medium">{selectedFee?.feeType}</p>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Amount Paid:</span>
                                    <span className="text-green-600">{formatCurrency(selectedFee?.amount || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={handlePrintReceipt}>
                            <Download className="mr-2 h-4 w-4" />
                            Print Receipt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
