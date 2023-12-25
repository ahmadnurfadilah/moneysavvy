import Logo from "@/components/icon/logo";
import AuthdUser from "@/components/ui/authd-user";
import NavigationMenu from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className="w-full h-20 flex items-center bg-dark">
        <div className="container px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <Logo className="h-7" />
            </Link>
            <div className="h-8 w-px bg-white/10"></div>
            <NavigationMenu />
          </div>
          <div>
            <AuthdUser />
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
