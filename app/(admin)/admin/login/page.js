import LoginForm from '@/components/admin/LoginForm';

export const metadata = { title: '에끌라린 관리자', robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center px-6">
      <LoginForm />
    </div>
  );
}
