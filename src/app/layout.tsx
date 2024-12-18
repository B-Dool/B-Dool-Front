import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import ReactQueryProvider from "./components/common/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "B-DOOL",
  description: "가볍게 사용하는 협업 메신저",
  icons: {
    icon: [
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/x-icon",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-w-[375px] min-h-[667px]">
        <ThemeProvider
          enableSystem={true}
          attribute="data-theme"
          defaultTheme="light"
        >
          <ReactQueryProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "green",
                  },
                },
                error: {
                  duration: 3000,
                  style: {
                    background: "red",
                  },
                },
              }}
            />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
