import { Toaster } from "@/components/ui/sonner";
import { GlobalSidebar } from "@/components/hub/global-sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="h-screen flex overflow-hidden text-foreground bg-background font-sans">
        
        {/* THE SMART SIDEBAR */}
        <GlobalSidebar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <Toaster theme="dark" />

      </body>
    </html>
  );
}