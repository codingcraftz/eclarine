-- 이미지 상태 테이블 생성
create table if not exists order_form_images (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references order_form(id) on delete cascade,
  image_url text not null,
  image_status text default '준비전' check (image_status in ('준비전', '준비완료', '주문접수', '주문접수 완료')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 정책 설정
alter table order_form_images enable row level security;

create policy "모든 사용자가 이미지를 볼 수 있음" on order_form_images
  for select using (true);

create policy "관리자만 이미지 상태를 수정할 수 있음" on order_form_images
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 기존 order_form 테이블의 capture_urls 데이터를 새 테이블로 마이그레이션
insert into order_form_images (order_id, image_url, image_status)
select 
  id as order_id,
  unnest(capture_urls) as image_url,
  '준비전' as image_status
from order_form
where capture_urls is not null and array_length(capture_urls, 1) > 0; 