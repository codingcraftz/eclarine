import { formatKRW } from '@/lib/pricing';
import { requireAdmin } from '@/lib/admin-auth';
import { FORM_STATUSES, listOrderForms } from '@/lib/order-forms';
import PhotoGrid from '@/components/admin/PhotoGrid';
import StatusSelect from '@/components/admin/StatusSelect';
import StatusTabs from '@/components/admin/StatusTabs';
import ExcelDownload from '@/components/admin/ExcelDownload';
import AdminNav from '@/components/admin/AdminNav';
import { updateFormStatus } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: '주문서 · 에끌라린 관리자', robots: { index: false, follow: false } };

const FORM_COLORS = {
  결제확인대기: '#8A8A8A',
  결제확인: '#2478D4',
  발송준비: '#E08C1A',
  발송완료: '#3F9C50',
};

const formatDate = (d) =>
  new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(d));

export default async function AdminOrderFormsPage({ searchParams }) {
  await requireAdmin();

  const { status = '전체', q = '' } = await searchParams;
  const all = await listOrderForms();

  const keyword = q.trim().toLowerCase();
  const matchesKeyword = (f) =>
    !keyword || `${f.name} ${f.nickname} ${f.phone}`.toLowerCase().includes(keyword);

  const searched = all.filter(matchesKeyword);
  const forms = status === '전체' ? searched : searched.filter((f) => f.status === status);

  const tabs = [
    { value: '전체', count: searched.length },
    ...FORM_STATUSES.map((s) => ({ value: s, count: searched.filter((f) => f.status === s).length })),
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <AdminNav current="form" />

      <form className="mt-4 flex gap-2">
        {status !== '전체' && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="이름 · 닉네임 · 연락처" className="pay-input flex-1 bg-white" />
        <button type="submit" className="shrink-0 px-4 rounded-xl text-[13px] font-bold text-white bg-[#1A1A1A]">
          검색
        </button>
      </form>

      <div className="mt-3">
        <StatusTabs tabs={tabs} current={status} q={q} />
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {forms.length === 0 && (
          <p className="py-16 text-center text-[14px] text-[#9A9A95]">해당하는 주문서가 없어요.</p>
        )}

        {forms.map((f) => (
          <section key={f.id} className="rounded-2xl bg-white border border-black/[0.07] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-extrabold truncate">
                  {f.nickname} <span className="text-[#9A9A95] font-bold">· {f.name}</span>
                </div>
                <div className="text-[12.5px] text-[#8A8A8A]">{formatDate(f.createdAt)}</div>
              </div>
              <StatusSelect
                action={updateFormStatus}
                id={f.id}
                value={f.status}
                options={FORM_STATUSES}
                colors={FORM_COLORS}
              />
            </div>

            <dl className="mt-3 flex flex-col gap-1 text-[13px]">
              <Row label="연락처" value={<a href={`tel:${f.phone}`}>{f.phone}</a>} />
              <Row label="주소" value={[f.address, f.addressDetail].filter(Boolean).join(' ')} />
              <Row label="결제" value={`${f.payment} · ${formatKRW(f.amount)}`} />
              {f.request && <Row label="요청" value={f.request} />}
            </dl>

            {f.images.length > 0 && (
              <div className="mt-3.5">
                <PhotoGrid images={f.images} />
              </div>
            )}
          </section>
        ))}
      </div>

      <ExcelDownload
        forms={forms.map((f) => ({
          name: f.name,
          phone: f.phone,
          address: f.address,
          addressDetail: f.addressDetail,
        }))}
        statusLabel={status}
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 w-12 text-[#9A9A95] font-semibold">{label}</dt>
      <dd className="min-w-0 break-keep">{value}</dd>
    </div>
  );
}
