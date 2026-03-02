import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "PrivateConnect — Secure Adult Messaging",
  description: "A private, adult-only (18+) consent-based messaging platform. Connect safely with verified users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
