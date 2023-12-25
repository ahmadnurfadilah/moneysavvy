import Logo from "@/components/icon/logo";
import Auth from "@/components/ui/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className="w-full h-20 flex items-center bg-dark">
        <div className="container px-4 flex items-center justify-between">
          <Link href="/">
            <Logo className="h-7" />
          </Link>
          <div>
            <Auth />
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
