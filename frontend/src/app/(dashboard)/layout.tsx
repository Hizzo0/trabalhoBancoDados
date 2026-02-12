// src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/organisms/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      <Sidebar />
      <main className="ml-[260px] flex-1 p-8 transition-all max-md:ml-20">
        {children}
      </main>
    </div>
  );
}