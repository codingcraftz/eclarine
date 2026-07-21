export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-dvh bg-[#F5F4F0] text-[#1A1A1A] antialiased">{children}</div>;
}
