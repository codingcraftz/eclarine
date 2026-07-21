import { requireAdmin } from '@/lib/admin-auth';
import { allProducts } from '@/lib/products';
import AdminNav from '@/components/admin/AdminNav';
import ProductManager from '@/components/admin/ProductManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: '상품 · 에끌라린 관리자', robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await allProducts();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <AdminNav current="products" />
      <ProductManager initialProducts={products} />
    </div>
  );
}
