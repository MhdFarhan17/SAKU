-- Create the function that will handle the new user trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- 1. Create default settings
  insert into public.settings (user_id, language, theme, currency, first_day_of_week, onboarding_complete)
  values (new.id, 'en', 'light', 'IDR', 1, false);

  -- 2. Create default categories
  -- Income
  insert into public.categories (user_id, name, kind, sort_order, color, icon) values
    (new.id, 'Gaji', 'income', 1, '#10b981', 'briefcase'),
    (new.id, 'Investasi', 'income', 2, '#3b82f6', 'trending-up'),
    (new.id, 'Pemberian', 'income', 3, '#f59e0b', 'gift');

  -- Expense
  insert into public.categories (user_id, name, kind, sort_order, color, icon) values
    (new.id, 'Makanan', 'expense', 1, '#ef4444', 'coffee'),
    (new.id, 'Transportasi', 'expense', 2, '#f97316', 'car'),
    (new.id, 'Tagihan', 'expense', 3, '#8b5cf6', 'file-text'),
    (new.id, 'Hiburan', 'expense', 4, '#ec4899', 'film'),
    (new.id, 'Belanja', 'expense', 5, '#06b6d4', 'shopping-bag'),
    (new.id, 'Kesehatan', 'expense', 6, '#14b8a6', 'activity');

  return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
