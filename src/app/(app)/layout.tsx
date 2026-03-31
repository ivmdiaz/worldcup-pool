import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        userName={session?.user?.name ?? ""}
        userEmail={session?.user?.email ?? ""}
        userImage={session?.user?.image}
        userRole={session?.user?.role ?? ""}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
