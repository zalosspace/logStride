# Log Stride
## Get Started
- Clone And Install Packages
```
# Clone Repo
git clone git@github.com:zalosspace/logStride.git
# Install Packages
npm install
```
- Setup `.env` file
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=YOUR_PUBLISHABLE_KEY
```
- Run
```
# http://localhost:6969
npm run dev
```

## Setup Database
- Create [Supabase](https://supabase.com) project.
- Enable *Google* in Sign In/ Providers under Authentication tab.
You'll also have to setup Projet on [Google Cloude Console](https://console.cloud.google.com)
- Add `http://localhost:6969` in Site URL and Redirect URLs under 
URL Configuration section under Authentication tab.

### Tables
Head onto SQL Editor of your supabase project and create two tables.
- User profile table
```
create table profiles (
  id uuid primary key,
  email text,
  name text
);
```
- Day traking table
```
create table days (
  id uuid primary key default gen_random_uuid(),

  user_id uuid
    references profiles(id)
    on delete cascade,

  date date not null,

  hours numeric default 0,

  mood integer,

  created_at timestamptz default now(),

  constraint unique_user_day
    unique (user_id, date)
);


create index idx_days_user_date
on days(user_id, date desc);



alter table days enable row level security;

create policy "read own days"
on days
for select
to authenticated
using (user_id = auth.uid());

create policy "insert own days"
on days
for insert
to authenticated
with check (user_id = auth.uid());

create policy "update own days"
on days
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "delete own days"
on days
for delete
to authenticated
using (user_id = auth.uid());
```

### Seed Sample Data
Add `<SeedData>` in main.tsx and load the site once. Check if it 
worked under Table Editors tab. If you have sample data in `day` table then
remove `<SeedData>` from main.tsx
