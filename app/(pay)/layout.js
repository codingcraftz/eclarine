export const metadata = {
  robots: { index: false, follow: false },
};

export default function PayLayout({ children }) {
  return (
    <div className="min-h-dvh bg-white text-[#1A1A1A] antialiased">
      <div className="mx-auto w-full max-w-md min-h-dvh flex flex-col">{children}</div>
    </div>
  );
}
