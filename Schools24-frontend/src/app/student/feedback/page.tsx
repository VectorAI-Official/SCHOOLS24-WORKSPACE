"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    MessageSquare, Send, Star, CheckCircle, Clock, ArrowLeft, Sparkles,
    ThumbsUp, Award, Heart, MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'

const previousFeedback = [
    { id: '1', subject: 'Mathematics Feedback', type: 'teacher', date: '2025-12-20', status: 'responded', rating: 5, response: 'Thank you for your positive feedback!' },
    { id: '2', subject: 'Library Suggestion', type: 'facility', date: '2025-11-15', status: 'pending', rating: 4 },
    { id: '3', subject: 'Sports Equipment', type: 'facility', date: '2025-10-05', status: 'responded', rating: 3, response: 'We are working on upgrading the equipment.' },
]

export default function StudentFeedbackPage() {
    const router = useRouter()
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [feedbackType, setFeedbackType] = useState('')
    const [feedbackSubject, setFeedbackSubject] = useState('')
    const [feedbackText, setFeedbackText] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = () => {
        if (!feedbackType || !feedbackText || rating === 0) {
            toast.error('Please fill all required fields', {
                description: 'Feedback type, rating, and message are required.',
            })
            return
        }

        setIsSubmitting(true)
        toast.loading('Submitting your feedback...', {
            description: 'Please wait while we process your submission.',
        })

        setTimeout(() => {
            setIsSubmitting(false)
            toast.success('Feedback submitted successfully!', {
                description: 'Thank you for your valuable feedback. We appreciate it! 🎉',
            })
            // Reset form
            setRating(0)
            setFeedbackType('')
            setFeedbackSubject('')
            setFeedbackText('')
            setIsAnonymous(false)
        }, 1500)
    }

    const handleViewResponse = (id: string, subject: string) => {
        toast.info(`Viewing response for: ${subject}`, {
            description: 'Loading detailed response...',
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/student/dashboard')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Feedback
                    </h1>
                    <p className="text-muted-foreground">Share your thoughts and suggestions</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
                    <CardContent className="p-6 text-center">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-violet-500" />
                        <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{previousFeedback.length}</p>
                        <p className="text-sm text-muted-foreground">Total Submitted</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                    <CardContent className="p-6 text-center">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{previousFeedback.filter(f => f.status === 'responded').length}</p>
                        <p className="text-sm text-muted-foreground">Responded</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50">
                    <CardContent className="p-6 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{previousFeedback.filter(f => f.status === 'pending').length}</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                    <CardContent className="p-6 text-center">
                        <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">4.5</p>
                        <p className="text-sm text-muted-foreground">Avg Rating Given</p>
                    </CardContent>
                </Card>
            </div>

            {/* Submit Feedback Form */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <CardTitle className="text-white">Submit New Feedback</CardTitle>
                    </div>
                    <CardDescription className="text-violet-100">We value your opinion and suggestions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Feedback Type *</Label>
                                <Select value={feedbackType} onValueChange={setFeedbackType}>
                                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-violet-500">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teacher">👨‍🏫 Teacher Feedback</SelectItem>
                                        <SelectItem value="course">📚 Course Content</SelectItem>
                                        <SelectItem value="facility">🏫 School Facility</SelectItem>
                                        <SelectItem value="general">💡 General Suggestion</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Subject/Teacher</Label>
                                <Select value={feedbackSubject} onValueChange={setFeedbackSubject}>
                                    <SelectTrigger className="h-12 rounded-xl border-2 focus:border-violet-500">
                                        <SelectValue placeholder="Select (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="math">Mathematics - Mr. Sharma</SelectItem>
                                        <SelectItem value="science">Science - Mrs. Patel</SelectItem>
                                        <SelectItem value="english">English - Ms. Gupta</SelectItem>
                                        <SelectItem value="physics">Physics - Mr. Kumar</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Rating *</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                                    >
                                        <Star
                                            className={`h-10 w-10 transition-all ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                                    : 'text-muted-foreground'
                                                }`}
                                        />
                                    </button>
                                ))}
                                {rating > 0 && (
                                    <span className="ml-4 flex items-center text-lg font-semibold text-yellow-600">
                                        {rating === 5 ? '🎉 Excellent!' : rating === 4 ? '😊 Great!' : rating === 3 ? '👍 Good' : rating === 2 ? '😐 Fair' : '😕 Poor'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Your Feedback *</Label>
                            <Textarea
                                placeholder="Share your thoughts, suggestions, or concerns... We read every feedback carefully! 💭"
                                rows={5}
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                className="rounded-xl border-2 focus:border-violet-500 resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                            <input
                                type="checkbox"
                                id="anonymous"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="h-5 w-5 rounded border-2 accent-violet-500"
                            />
                            <label htmlFor="anonymous" className="text-sm cursor-pointer">
                                Submit anonymously <span className="text-muted-foreground">(Your identity will be hidden)</span>
                            </label>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full h-12 text-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 shadow-lg shadow-violet-500/20"
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Send className="mr-2 h-5 w-5" />
                                    Submit Feedback
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Previous Feedback */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-violet-500" />
                        <CardTitle>Your Previous Feedback</CardTitle>
                    </div>
                    <CardDescription>History of your submitted feedback</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {previousFeedback.map((feedback, index) => (
                            <div
                                key={feedback.id}
                                className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg stagger-${index + 1} animate-slide-up ${feedback.status === 'responded'
                                        ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20'
                                        : 'border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feedback.status === 'responded'
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                            : 'bg-gradient-to-br from-yellow-500 to-amber-600'
                                        } text-white shadow-lg`}>
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-lg">{feedback.subject}</p>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                    <span>{feedback.date}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{feedback.type}</span>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={feedback.status === 'responded' ? 'success' : 'warning'}
                                                className="px-3 py-1"
                                            >
                                                {feedback.status === 'responded' ? (
                                                    <><CheckCircle className="h-3 w-3 mr-1" />Responded</>
                                                ) : (
                                                    <><Clock className="h-3 w-3 mr-1" />Pending</>
                                                )}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < feedback.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-muted-foreground'
                                                        }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-muted-foreground">{feedback.rating}/5</span>
                                        </div>
                                        {feedback.response && (
                                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Response:</p>
                                                <p className="text-sm text-muted-foreground">{feedback.response}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {feedback.status === 'responded' && (
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewResponse(feedback.id, feedback.subject)}
                                            className="hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                        >
                                            View Full Response
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Appreciation Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10">
                <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-pink-500" />
                    <h3 className="text-xl font-bold mb-2">Thank You for Your Feedback!</h3>
                    <p className="text-muted-foreground">Your input helps us improve and create a better learning experience for everyone.</p>
                </CardContent>
            </Card>
        </div>
    )
}
