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
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Plus, FileText, Video, Link as LinkIcon, Download, Upload, Eye, Trash2 } from 'lucide-react'
import { mockMaterials } from '@/lib/mockData'

export default function MaterialsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Materials</h1>
                    <p className="text-muted-foreground">Manage and share study materials</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Material
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Study Material</DialogTitle>
                            <DialogDescription>
                                Share study materials with your students.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Enter material title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mathematics">Mathematics</SelectItem>
                                            <SelectItem value="science">Science</SelectItem>
                                            <SelectItem value="english">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="class">Class</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="9">Class 9</SelectItem>
                                            <SelectItem value="10">Class 10</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>File</Label>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, PPT, or video files</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Upload</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Materials Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockMaterials.map((material) => (
                    <Card key={material.id} className="card-hover">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${material.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                        material.type === 'video' ? 'bg-blue-100 text-blue-600' :
                                            material.type === 'document' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                    }`}>
                                    {material.type === 'pdf' ? <FileText className="h-6 w-6" /> :
                                        material.type === 'video' ? <Video className="h-6 w-6" /> :
                                            material.type === 'link' ? <LinkIcon className="h-6 w-6" /> :
                                                <FileText className="h-6 w-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{material.title}</h3>
                                    <p className="text-sm text-muted-foreground">{material.subject} • Class {material.class}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                <span>Uploaded: {material.uploadedDate}</span>
                                <div className="flex items-center gap-1">
                                    <Download className="h-4 w-4" />
                                    {material.downloads}
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
