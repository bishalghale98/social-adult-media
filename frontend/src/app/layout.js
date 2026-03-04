import "./globals.css";
import { Inter } from "next/font/google";
import StoreProvider from "../store/StoreProvider";
import { AuthProvider } from "../context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "PrivateConnect — Secure Adult Messaging",
  description: "A private, adult-only (18+) consent-based messaging platform. Connect safely with verified users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased`}
        style={{
          backgroundColor: "#000000",
          color: "#fafafa",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        <StoreProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={300}>
              {children}
              <Toaster theme="dark" position="top-right" richColors closeButton />
            </TooltipProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
