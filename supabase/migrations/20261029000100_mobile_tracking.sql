-- MiniMe Lab native mobile: private per-user reproductive health tracking
-- Apply only to a dedicated MiniMe Lab Supabase project.
create table if not exists public.cycle_entries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 entry_date date not null,
 flow text not null check (flow in ('none','spotting','light','medium','heavy')),
 pain integer not null default 0 check (pain between 0 and 10),
 notes text not null default '' check (char_length(notes)<=500),
 period_start boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(user_id,entry_date)
);
create table if not exists public.pregnancy_checkins (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 entry_date date not null,
 symptoms text not null default '' check (char_length(symptoms)<=120),
 notes text not null default '' check (char_length(notes)<=500),
 created_at timestamptz not null default now()
);
create index if not exists cycle_entries_user_date_idx on public.cycle_entries(user_id,entry_date desc);
create index if not exists pregnancy_checkins_user_date_idx on public.pregnancy_checkins(user_id,entry_date desc);
alter table public.cycle_entries enable row level security;
alter table public.pregnancy_checkins enable row level security;
revoke all on public.cycle_entries,public.pregnancy_checkins from anon;
grant select,insert,update,delete on public.cycle_entries,public.pregnancy_checkins to authenticated;
create policy "cycle_read_own" on public.cycle_entries for select to authenticated using ((select auth.uid())=user_id);
create policy "cycle_insert_own" on public.cycle_entries for insert to authenticated with check ((select auth.uid())=user_id);
create policy "cycle_update_own" on public.cycle_entries for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "cycle_delete_own" on public.cycle_entries for delete to authenticated using ((select auth.uid())=user_id);
create policy "pregnancy_read_own" on public.pregnancy_checkins for select to authenticated using ((select auth.uid())=user_id);
create policy "pregnancy_insert_own" on public.pregnancy_checkins for insert to authenticated with check ((select auth.uid())=user_id);
create policy "pregnancy_update_own" on public.pregnancy_checkins for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "pregnancy_delete_own" on public.pregnancy_checkins for delete to authenticated using ((select auth.uid())=user_id);
