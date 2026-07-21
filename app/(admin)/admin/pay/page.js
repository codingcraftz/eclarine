import { formatKRW } from '@/lib/pricing';
import { requireAdmin } from '@/lib/admin-auth';
import { listOrders } from '@/lib/orders';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: '결제주문 · 에끌라린 관리자', robots: { index: false, follow: false } };

const formatDate = (d) =>
  new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(d));

export default async function AdminPayOrdersPage() {
  await requireAdmin();

  const orders = await listOrders();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <AdminNav current="pay" />

      <p className="mt-4 text-[12.5px] text-[#8A8A8A]">/shop · /pay 결제 주문 {orders.length}건 (읽기 전용)</p>

      <div className="mt-3 flex flex-col gap-2.5">
        {orders.length === 0 && (
          <p className="py-16 text-center text-[14px] text-[#9A9A95]">아직 결제 주문이 없어요.</p>
        )}

        {orders.map((o) => (
          <section key={o.id} className="rounded-2xl bg-white border border-black/[0.07] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[14.5px] font-extrabold truncate">{o.productName}</div>
                <div className="text-[12.5px] text-[#8A8A8A]">{formatDate(o.createdAt)}</div>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold text-white"
                style={{ background: o.status === 'paid' ? '#3F9C50' : '#B5B5AE' }}
              >
                {o.status === 'paid' ? '결제완료' : '대기'}
              </span>
            </div>

            <div className="mt-2 text-[13px] text-[#4A4A4A] flex flex-col gap-0.5">
              <div>
                {o.name} · {o.phone} · {o.method === 'card' ? '카드결제' : '현금이체'} ·{' '}
                <b>{formatKRW(o.amount)}</b>
              </div>
              <div className="text-[#8A8A8A] break-keep">{o.address}</div>
              <div className="text-[12px] text-[#B5B5AE]">
                {o.orderKey} · {o.items.map((it) => `${it.label || '기본'} × ${it.qty}`).join(', ')}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
