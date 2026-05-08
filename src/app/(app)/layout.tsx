import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
