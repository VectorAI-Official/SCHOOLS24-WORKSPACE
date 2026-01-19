"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Search, Send, Inbox, MessageSquare, Star, Trash2 } from 'lucide-react'
import { mockMessages } from '@/lib/mockData'
import { getInitials } from '@/lib/utils'

export default function TeacherMessagesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <p className="text-muted-foreground">Communicate with students and staff</p>
                </div>
                <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Message
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Message List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {mockMessages.map((message) => (
                                <div key={message.id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${!message.read ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted'}`}>
                                    <Avatar>
                                        <AvatarFallback>{getInitials(message.from)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`font-medium truncate ${!message.read ? 'text-primary' : ''}`}>{message.from}</p>
                                            {!message.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                        <p className="text-sm font-medium truncate">{message.subject}</p>
                                        <p className="text-xs text-muted-foreground">{message.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Message Content */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{getInitials(mockMessages[0].from)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{mockMessages[0].subject}</CardTitle>
                                    <CardDescription>From: {mockMessages[0].from}</CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Star className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="min-h-[200px] p-4 rounded-lg bg-muted/50 mb-4">
                            <p>{mockMessages[0].content}</p>
                            <p className="text-sm text-muted-foreground mt-4">{mockMessages[0].date}</p>
                        </div>

                        {/* Reply */}
                        <div className="space-y-4">
                            <Textarea placeholder="Type your reply..." rows={4} />
                            <div className="flex justify-end">
                                <Button>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Reply
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
