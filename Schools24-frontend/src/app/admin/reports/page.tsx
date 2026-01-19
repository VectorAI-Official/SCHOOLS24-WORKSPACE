"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Download, FileText, BarChart3, Users, DollarSign, GraduationCap } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { revenueChartData, attendanceChartData, mockStudents, mockTeachers } from '@/lib/mockData'
import { toast } from 'sonner'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const gradeDistribution = [
    { name: 'A+', value: 15 },
    { name: 'A', value: 25 },
    { name: 'B+', value: 30 },
    { name: 'B', value: 18 },
    { name: 'C', value: 12 },
]

export default function ReportsPage() {
    const [selectedYear, setSelectedYear] = useState('2025-26')

    const handleExportAll = () => {
        toast.success('Exporting all reports', { description: `Generating reports for ${selectedYear}...` })
        setTimeout(() => {
            toast.success('Export completed', { description: 'All reports have been downloaded.' })
        }, 1500)
    }

    const handleReportClick = (reportType: string) => {
        toast.success(`Generating ${reportType}`, { description: `Creating ${reportType.toLowerCase()} for ${selectedYear}...` })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="text-muted-foreground">Generate and view school reports</p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025-26">2025-26</SelectItem>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2023-24">2023-24</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExportAll}>
                        <Download className="mr-2 h-4 w-4" />
                        Export All Reports
                    </Button>
                </div>
            </div>

            {/* Quick Reports */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="card-hover cursor-pointer" onClick={() => handleReportClick('Student Report')}>
                    <CardContent className="p-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white mx-auto mb-3">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <p className="font-medium">Student Report</p>
                        <p className="text-sm text-muted-foreground">Generate student reports</p>
                    </CardContent>
                </Card>
                <Card className="card-hover cursor-pointer" onClick={() => handleReportClick('Attendance Report')}>
                    <CardContent className="p-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white mx-auto mb-3">
                            <Users className="h-6 w-6" />
                        </div>
                        <p className="font-medium">Attendance Report</p>
                        <p className="text-sm text-muted-foreground">Monthly attendance stats</p>
                    </CardContent>
                </Card>
                <Card className="card-hover cursor-pointer" onClick={() => handleReportClick('Financial Report')}>
                    <CardContent className="p-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white mx-auto mb-3">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <p className="font-medium">Financial Report</p>
                        <p className="text-sm text-muted-foreground">Fee collection status</p>
                    </CardContent>
                </Card>
                <Card className="card-hover cursor-pointer" onClick={() => handleReportClick('Performance Report')}>
                    <CardContent className="p-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white mx-auto mb-3">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <p className="font-medium">Performance Report</p>
                        <p className="text-sm text-muted-foreground">Academic performance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue vs Expenses</CardTitle>
                        <CardDescription>Monthly financial comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueChartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                        cursor={false}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Grade Distribution</CardTitle>
                        <CardDescription>Student grades across school</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gradeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}%`}
                                    >
                                        {gradeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip cursor={false} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Attendance Trends</CardTitle>
                    <CardDescription>Present vs Absent students</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceChartData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="day" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                    cursor={false}
                                />
                                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present %" />
                                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
