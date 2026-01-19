"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserRole } from '@/lib/mockData'

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    userRole: UserRole | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock credentials for demo
const mockCredentials = {
    admin: { email: 'admin@school24.com', password: 'admin123', user: { id: '1', name: 'Admin User', email: 'admin@school24.com', role: 'admin' as UserRole } },
    teacher: { email: 'teacher@school24.com', password: 'teacher123', user: { id: '2', name: 'Rajesh Kumar', email: 'rajesh@school24.com', role: 'teacher' as UserRole } },
    student: { email: 'student@school24.com', password: 'student123', user: { id: '3', name: 'Amit Singh', email: 'amit@school24.com', role: 'student' as UserRole } },
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Check for stored auth on mount
        const storedUser = localStorage.getItem('School24_user')
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem('School24_user')
            }
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        // Route protection
        if (!isLoading && !user) {
            const protectedPaths = ['/admin', '/teacher', '/student']
            const isProtected = protectedPaths.some(path => pathname.startsWith(path))
            if (isProtected) {
                router.push('/login')
            }
        }

        // Role-based access control
        if (!isLoading && user) {
            if (pathname.startsWith('/admin') && user.role !== 'admin') {
                router.push(`/${user.role}/dashboard`)
            } else if (pathname.startsWith('/teacher') && user.role !== 'teacher' && user.role !== 'admin') {
                router.push(`/${user.role}/dashboard`)
            } else if (pathname.startsWith('/student') && user.role !== 'student' && user.role !== 'admin') {
                router.push(`/${user.role}/dashboard`)
            }
        }
    }, [isLoading, user, pathname, router])

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check credentials
        for (const cred of Object.values(mockCredentials)) {
            if (cred.email === email && cred.password === password) {
                setUser(cred.user)
                localStorage.setItem('School24_user', JSON.stringify(cred.user))
                return true
            }
        }

        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('School24_user')
        router.push('/login')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                userRole: user?.role || null,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
