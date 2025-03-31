import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryCraft AI",
  description: "Create your own world using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>  
        <html lang="en">
          <head>
            <link
              rel="preconnect"
              href="https://fonts.googleapis.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
              as="style"
            />
          </head>
          <body className="antialiased">
            {children}
          </body>
        </html>
    </ClerkProvider>
  );
}
