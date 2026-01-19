import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Using system font stack to avoid Google Fonts network dependency during build
const fontClassName = "font-sans";

export const metadata: Metadata = {
  title: "School24 - Comprehensive School Management System",
  description: "A modern, full-featured school management system for administrators, teachers, and students.",
  keywords: ["school management", "education", "student portal", "teacher portal", "admin dashboard"],
  authors: [{ name: "School24" }],
  creator: "School24",
  publisher: "School24",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://school24.com",
    title: "School24 - Comprehensive School Management System",
    description: "A modern, full-featured school management system for administrators, teachers, and students.",
    siteName: "School24",
  },
  twitter: {
    card: "summary_large_image",
    title: "School24 - Comprehensive School Management System",
    description: "A modern, full-featured school management system for administrators, teachers, and students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontClassName} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
