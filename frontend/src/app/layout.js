import "./globals.css";
import { ReduxProvider } from "./store/ReduxProvider";
import Link from "next/link";


export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body suppressHydrationWarning={true} className="bg-gray-50 text-gray-900">
        <header className="bg-black text-white p-4">
          <h2 className="text-3xl font-bold">
         Dream Home
           </h2>
        </header>
      <ReduxProvider>
        {children}
      </ReduxProvider>
      <footer className="bg-black text-white p-4 mt-8">
          <div className="text-left">
            <p> 2025 My Products</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
