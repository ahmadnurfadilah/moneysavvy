import Logo from "@/components/icon/logo";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className="w-full h-20 flex items-center bg-dark">
        <div className="container px-4 flex items-center justify-between">
          <div>
            <Logo className="h-7" />
          </div>
          <div>
            <Link href="/dashboard" className="h-10 px-4 py-2 gap-2 bg-primary text-dark hover:contrast-75 border border-dark/20 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 active:scale-95">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
