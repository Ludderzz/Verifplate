-- Run in Supabase SQL editor. RLS is ON with no policies: only the server (service role key) can read/write.
create extension if not exists pgcrypto;

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  quantity int not null check (quantity in (1,2)),
  marketing_ok boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists waitlist_email_idx on waitlist (lower(email));

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                       -- public code written to the NFC tag
  vin text not null check (vin ~ '^[A-HJ-NPR-Z0-9]{17}$'),
  plate text not null,
  model text,
  note text,
  make text,
  colour text,
  year_of_manufacture int,
  fuel_type text,
  dvla_checked_at timestamptz,
  status text not null default 'active' check (status in ('active','disabled')),
  disabled_reason text,
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint disabled_needs_reason check (status = 'active' or length(btrim(coalesce(disabled_reason,''))) > 2)
);
create index if not exists tags_vin_idx on tags (vin);
create index if not exists tags_plate_idx on tags (plate);

create table if not exists tag_events (
  id bigint generated always as identity primary key,
  tag_code text not null,
  action text not null,                            -- tap, created, updated, disabled, enabled
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists tag_events_code_idx on tag_events (tag_code, created_at desc);

alter table waitlist enable row level security;
alter table tags enable row level security;
alter table tag_events enable row level security;
