"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Pen,
    Eraser,
    Square,
    Circle,
    Type,
    Minus,
    Undo,
    Redo,
    Trash2,
    Download,
    Palette,
    ZoomIn,
    ZoomOut,
    ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

const tools = [
    { id: 'pen', icon: <Pen className="h-4 w-4" />, label: 'Pen' },
    { id: 'eraser', icon: <Eraser className="h-4 w-4" />, label: 'Eraser' },
    { id: 'line', icon: <Minus className="h-4 w-4" />, label: 'Line' },
    { id: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' },
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
]

const colors = ['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff']

export default function WhiteboardPage() {
    const [activeTool, setActiveTool] = useState('pen')
    const [activeColor, setActiveColor] = useState('#000000')
    const [strokeWidth, setStrokeWidth] = useState(3)

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center gap-4">
                    <Link href="/teacher/teach">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-border" />

                    {/* Tools */}
                    <div className="flex items-center gap-1">
                        {tools.map((tool) => (
                            <Button
                                key={tool.id}
                                variant={activeTool === tool.id ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setActiveTool(tool.id)}
                                title={tool.label}
                            >
                                {tool.icon}
                            </Button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-border" />

                    {/* Colors */}
                    <div className="flex items-center gap-1">
                        {colors.map((color) => (
                            <button
                                key={color}
                                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${activeColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-muted'
                                    }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setActiveColor(color)}
                            />
                        ))}
                    </div>

                    <div className="h-6 w-px bg-border" />

                    {/* Stroke Width */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={strokeWidth}
                            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                            className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm w-6">{strokeWidth}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Undo">
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Redo">
                        <Redo className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <Button variant="ghost" size="icon" title="Zoom In">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Zoom Out">
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <Button variant="ghost" size="icon" title="Clear" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-white relative overflow-hidden">
                <div
                    className="w-full h-full cursor-crosshair"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                >
                    {/* Placeholder for whiteboard content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <Pen className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Start drawing on the whiteboard</p>
                            <p className="text-sm">Use the tools above to draw, write, and illustrate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
