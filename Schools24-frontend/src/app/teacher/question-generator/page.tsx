"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Wand2, Copy, Download, RefreshCw, FileText, CheckCircle } from 'lucide-react'

export default function QuestionGeneratorPage() {
    const [generating, setGenerating] = useState(false)
    const [generated, setGenerated] = useState(false)

    const handleGenerate = () => {
        setGenerating(true)
        setTimeout(() => {
            setGenerating(false)
            setGenerated(true)
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Question Generator</h1>
                    <p className="text-muted-foreground">AI-powered question generation for assessments</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Generator Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Questions</CardTitle>
                        <CardDescription>Configure your question parameters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="topic">Topic / Subject</Label>
                            <Input id="topic" placeholder="e.g., Quadratic Equations, Photosynthesis" />
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
                                        <SelectItem value="history">History</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="class">Class Level</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="9">Class 9</SelectItem>
                                        <SelectItem value="10">Class 10</SelectItem>
                                        <SelectItem value="11">Class 11</SelectItem>
                                        <SelectItem value="12">Class 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Question Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                                    <SelectItem value="short">Short Answer</SelectItem>
                                    <SelectItem value="long">Long Answer</SelectItem>
                                    <SelectItem value="truefalse">True/False</SelectItem>
                                    <SelectItem value="fillblank">Fill in the Blanks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Number of Questions: 10</Label>
                            <Slider defaultValue={[10]} max={50} step={5} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Difficulty Level</Label>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">Easy</Button>
                                <Button variant="default" className="flex-1">Medium</Button>
                                <Button variant="outline" className="flex-1">Hard</Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="context">Additional Context (Optional)</Label>
                            <Textarea id="context" placeholder="Provide any additional context or specific areas to focus on" rows={3} />
                        </div>

                        <Button className="w-full gradient-primary border-0" onClick={handleGenerate} disabled={generating}>
                            {generating ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate Questions
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Questions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Generated Questions</CardTitle>
                                <CardDescription>Review and export your questions</CardDescription>
                            </div>
                            {generated && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!generated ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-16 w-16 text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground">No questions generated yet</p>
                                <p className="text-sm text-muted-foreground">Configure options and click generate</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div key={num} className="p-4 rounded-lg border">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                                {num}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium mb-2">
                                                    {num === 1 && "What is the quadratic formula used to solve equations of the form ax² + bx + c = 0?"}
                                                    {num === 2 && "Solve: x² - 5x + 6 = 0"}
                                                    {num === 3 && "If the discriminant of a quadratic equation is negative, what can be said about its roots?"}
                                                    {num === 4 && "Find the sum and product of roots for 2x² - 7x + 3 = 0"}
                                                    {num === 5 && "Which of the following represents a quadratic equation?"}
                                                </p>
                                                {num === 5 && (
                                                    <div className="space-y-2 text-sm">
                                                        <p>A) y = 2x + 1</p>
                                                        <p>B) y = x² - 4x + 4</p>
                                                        <p>C) y = √x</p>
                                                        <p>D) y = 1/x</p>
                                                    </div>
                                                )}
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
