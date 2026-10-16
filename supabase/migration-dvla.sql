-- Run once if you already ran schema.sql (new installs: schema.sql already includes this).
alter table tags add column if not exists make text;
alter table tags add column if not exists colour text;
alter table tags add column if not exists year_of_manufacture int;
alter table tags add column if not exists fuel_type text;
alter table tags add column if not exists dvla_checked_at timestamptz;
