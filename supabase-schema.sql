-- ============================================================
-- 牙技所指示單系統 — Supabase 資料表
-- 用法：到 Supabase Dashboard → SQL Editor → New query，
--       把這整段貼上後按 Run。
-- ============================================================

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  order_number  text unique not null,   -- 單號，例如 DL1719500000000
  clinic        text,                   -- 診所（方便查詢）
  doctor        text,                   -- 醫師
  patient       text,                   -- 患者
  data          jsonb not null,         -- 整張指示單的完整資料
  created_at    timestamptz not null default now()
);

-- 查詢用索引
create index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_created_at_idx   on public.orders (created_at desc);

-- 啟用 Row Level Security。
-- 伺服器端使用 service_role 金鑰會「繞過」RLS，所以系統照常運作；
-- 而沒有任何對外（anon）政策，代表外部無法直接讀寫這張表，較安全。
alter table public.orders enable row level security;
