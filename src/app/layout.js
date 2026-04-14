import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MOMO Pay - Zidane",
  description: "MTN MOMO Payment Gateway",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700`}>
        <main className="min-h-screen flex items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}