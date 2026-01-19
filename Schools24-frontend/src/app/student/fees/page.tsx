"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    DollarSign, CheckCircle, Clock, AlertCircle, CreditCard, Receipt, Download,
    ArrowLeft, ArrowRight, Wallet, TrendingUp, Calendar, CreditCardIcon,
    FileText, Sparkles
} from 'lucide-react'
import { mockStudents } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const student = mockStudents[0]

const feeBreakdown = [
    { name: 'Tuition Fee', amount: 45000, paid: 45000, status: 'paid', icon: '📚' },
    { name: 'Lab Fee', amount: 5000, paid: 5000, status: 'paid', icon: '🔬' },
    { name: 'Library Fee', amount: 2000, paid: 2000, status: 'paid', icon: '📖' },
    { name: 'Sports Fee', amount: 3000, paid: 1500, status: 'partial', icon: '⚽' },
    { name: 'Transport Fee', amount: 15000, paid: 7500, status: 'partial', icon: '🚌' },
]

const paymentHistory = [
    { id: '1', date: '2025-12-15', amount: 25000, method: 'Online', status: 'success', receipt: 'REC-2025-001' },
    { id: '2', date: '2025-10-10', amount: 20000, method: 'Cash', status: 'success', receipt: 'REC-2025-002' },
    { id: '3', date: '2025-08-01', amount: 15000, method: 'UPI', status: 'success', receipt: 'REC-2025-003' },
]

export default function StudentFeesPage() {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    const totalFees = feeBreakdown.reduce((sum, fee) => sum + fee.amount, 0)
    const paidFees = feeBreakdown.reduce((sum, fee) => sum + fee.paid, 0)
    const pendingFees = totalFees - paidFees

    const handlePayNow = () => {
        setIsProcessing(true)
        toast.loading('Opening payment gateway...', {
            description: 'Please wait while we connect to the payment provider.',
        })
        setTimeout(() => {
            setIsProcessing(false)
            toast.success('Payment gateway opened!', {
                description: 'Complete your payment securely.',
            })
        }, 1500)
    }

    const handleDownloadReceipt = (receiptId: string) => {
        toast.success(`Downloading ${receiptId}...`, {
            description: 'Your receipt will be downloaded shortly.',
        })
    }

    const handleViewStatement = () => {
        toast.info('Generating fee statement...', {
            description: 'Your complete fee statement is being prepared.',
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/student/dashboard')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Fee Details
                        </h1>
                        <p className="text-muted-foreground">View and pay your school fees</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleViewStatement}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Statement
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 shadow-lg shadow-emerald-500/20"
                        onClick={handlePayNow}
                        disabled={isProcessing}
                    >
                        <CreditCard className="mr-2 h-4 w-4" />
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </Button>
                </div>
            </div>

            {/* Fee Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                                <Wallet className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(totalFees)}</p>
                                <p className="text-sm text-muted-foreground">Total Fees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-12 translate-x-12" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatCurrency(paidFees)}</p>
                                <p className="text-sm text-muted-foreground">Paid</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -translate-y-12 translate-x-12" />
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30">
                                <AlertCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-red-700 dark:text-red-400">{formatCurrency(pendingFees)}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Progress */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <CardTitle className="text-white">Payment Progress</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-100">Academic Year 2025-26</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Overall Payment Status</span>
                            <Badge variant={pendingFees === 0 ? 'success' : 'warning'} className="text-sm px-4 py-1">
                                {pendingFees === 0 ? '✓ Fully Paid' : `${Math.round((paidFees / totalFees) * 100)}% Paid`}
                            </Badge>
                        </div>
                        <div className="relative">
                            <Progress value={(paidFees / totalFees) * 100} className="h-6 rounded-full" />
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow">
                                {formatCurrency(paidFees)} / {formatCurrency(totalFees)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-green-600">Paid: {formatCurrency(paidFees)}</span>
                            <span className="text-red-600">Pending: {formatCurrency(pendingFees)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Fee Breakdown */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle>Fee Breakdown</CardTitle>
                            </div>
                            <CardDescription>Individual fee components</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {feeBreakdown.map((fee, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${fee.status === 'paid' ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20 hover:border-green-300' :
                                        fee.status === 'partial' ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 hover:border-yellow-300' :
                                            'border-red-200 bg-red-50/50 dark:bg-red-950/20 hover:border-red-300'
                                    } stagger-${index + 1} animate-slide-up`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                                        {fee.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{fee.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(fee.paid)} / {formatCurrency(fee.amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatCurrency(fee.amount - fee.paid)}</p>
                                        <p className="text-xs text-muted-foreground">Remaining</p>
                                    </div>
                                    <Badge variant={
                                        fee.status === 'paid' ? 'success' :
                                            fee.status === 'partial' ? 'warning' : 'destructive'
                                    } className="px-4 py-1.5 text-sm font-medium">
                                        {fee.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                                        {fee.status === 'partial' && <Clock className="h-3 w-3 mr-1" />}
                                        {fee.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-primary" />
                                <CardTitle>Payment History</CardTitle>
                            </div>
                            <CardDescription>Your recent transactions</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {paymentHistory.map((payment, index) => (
                            <div
                                key={payment.id}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:shadow-md bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 stagger-${index + 1} animate-slide-up`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20">
                                        <Receipt className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>{payment.date}</span>
                                            <span>•</span>
                                            <CreditCardIcon className="h-3 w-3" />
                                            <span>{payment.method}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="success" className="px-3 py-1">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Success
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadReceipt(payment.receipt)}
                                        className="hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Receipt
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment CTA */}
            {pendingFees > 0 && (
                <Card className="border-0 shadow-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white overflow-hidden">
                    <CardContent className="p-8 relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold mb-2">Complete Your Payment</h3>
                                <p className="text-emerald-100">Pay the remaining {formatCurrency(pendingFees)} to avoid late fees</p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl px-8"
                                onClick={handlePayNow}
                                disabled={isProcessing}
                            >
                                <CreditCard className="mr-2 h-5 w-5" />
                                {isProcessing ? 'Processing...' : `Pay ${formatCurrency(pendingFees)}`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
