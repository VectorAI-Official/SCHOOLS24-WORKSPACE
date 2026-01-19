"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Search, FileText, Video, Link as LinkIcon, Download, Eye, BookOpen, FolderOpen,
    ArrowLeft, Filter, Star, Clock, ExternalLink, PlayCircle
} from 'lucide-react'
import { mockMaterials } from '@/lib/mockData'
import { toast } from 'sonner'

export default function StudentMaterialsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [viewingMaterial, setViewingMaterial] = useState<string | null>(null)

    const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'English', 'History']

    const filteredMaterials = mockMaterials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject
        return matchesSearch && matchesSubject
    })

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="h-6 w-6" />
            case 'video': return <Video className="h-6 w-6" />
            case 'link': return <LinkIcon className="h-6 w-6" />
            default: return <FileText className="h-6 w-6" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'from-red-500 to-rose-600'
            case 'video': return 'from-blue-500 to-cyan-600'
            case 'link': return 'from-violet-500 to-purple-600'
            default: return 'from-green-500 to-emerald-600'
        }
    }

    const getTypeBg = (type: string) => {
        switch (type) {
            case 'pdf': return 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 hover:border-red-300'
            case 'video': return 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:border-blue-300'
            case 'link': return 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 hover:border-violet-300'
            default: return 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:border-green-300'
        }
    }

    const handleViewMaterial = (materialId: string, title: string, type: string) => {
        setViewingMaterial(materialId)
        toast.success(`Opening ${title}`, {
            description: `Loading ${type.toUpperCase()} viewer...`,
        })
        setTimeout(() => {
            setViewingMaterial(null)
        }, 1500)
    }

    const handleDownloadMaterial = (title: string) => {
        toast.success(`Downloading ${title}`, {
            description: 'Your file will be downloaded shortly.',
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Study Materials
                        </h1>
                        <p className="text-muted-foreground">Access your study materials and resources</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{mockMaterials.length}</p>
                                <p className="text-sm text-muted-foreground">Total Materials</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-red-700 dark:text-red-400">{mockMaterials.filter(m => m.type === 'pdf').length}</p>
                                <p className="text-sm text-muted-foreground">PDFs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                <Video className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-violet-700 dark:text-violet-400">{mockMaterials.filter(m => m.type === 'video').length}</p>
                                <p className="text-sm text-muted-foreground">Videos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30">
                                <FolderOpen className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">5</p>
                                <p className="text-sm text-muted-foreground">Subjects</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 rounded-xl border-2 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {subjects.map((subject) => (
                                <Button
                                    key={subject}
                                    variant={selectedSubject === subject.toLowerCase() || (subject === 'All' && selectedSubject === 'all') ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedSubject(subject === 'All' ? 'all' : subject)}
                                    className={`rounded-full px-4 ${selectedSubject === subject.toLowerCase() || (subject === 'All' && selectedSubject === 'all')
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-0'
                                            : ''
                                        }`}
                                >
                                    {subject}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Materials Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map((material, index) => (
                    <Card
                        key={material.id}
                        className={`border-2 border-transparent transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${getTypeBg(material.type)} stagger-${(index % 5) + 1} animate-slide-up cursor-pointer`}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getTypeColor(material.type)} text-white shadow-lg`}>
                                    {getTypeIcon(material.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate">{material.title}</h3>
                                    <p className="text-sm text-muted-foreground">{material.subject}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Badge
                                    variant="secondary"
                                    className={`${material.type === 'pdf' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                            material.type === 'video' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                                        }`}
                                >
                                    {material.type.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{material.size}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{material.uploadedDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>Popular</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300"
                                    onClick={() => handleViewMaterial(material.id, material.title, material.type)}
                                    disabled={viewingMaterial === material.id}
                                >
                                    {material.type === 'video' ? (
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                    ) : material.type === 'link' ? (
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Eye className="mr-2 h-4 w-4" />
                                    )}
                                    {viewingMaterial === material.id ? 'Opening...' : 'View'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadMaterial(material.title)}
                                    className="hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredMaterials.length === 0 && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                        <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">No materials found</h3>
                        <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                        <Button
                            variant="outline"
                            onClick={() => { setSearchQuery(''); setSelectedSubject('all'); }}
                        >
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
