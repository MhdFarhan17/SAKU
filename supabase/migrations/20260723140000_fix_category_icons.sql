-- Fix legacy Lucide icon strings to emoji icons for existing users
-- This migration fixes icons that were stored as Lucide component names

-- Update existing categories with legacy string icons to emoji
update public.categories set icon = '🍔' where icon = 'coffee';
update public.categories set icon = '🚗' where icon = 'car';
update public.categories set icon = '🛍️' where icon = 'shopping-bag';
update public.categories set icon = '🧾' where icon = 'file-text';
update public.categories set icon = '💊' where icon = 'activity';
update public.categories set icon = '🎮' where icon = 'film';
update public.categories set icon = '💰' where icon = 'briefcase';
update public.categories set icon = '📈' where icon = 'trending-up';
update public.categories set icon = '🎁' where icon = 'gift';

-- Recreate the handle_new_user function with correct emoji icons
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
    (new.id, 'Gaji', 'income', 1, '#10b981', '💰'),
    (new.id, 'Investasi', 'income', 2, '#3b82f6', '📈'),
    (new.id, 'Pemberian', 'income', 3, '#f59e0b', '🎁');

  -- Expense
  insert into public.categories (user_id, name, kind, sort_order, color, icon) values
    (new.id, 'Makanan', 'expense', 1, '#ef4444', '🍔'),
    (new.id, 'Transportasi', 'expense', 2, '#f97316', '🚗'),
    (new.id, 'Tagihan', 'expense', 3, '#8b5cf6', '🧾'),
    (new.id, 'Hiburan', 'expense', 4, '#ec4899', '🎮'),
    (new.id, 'Belanja', 'expense', 5, '#06b6d4', '🛍️'),
    (new.id, 'Kesehatan', 'expense', 6, '#14b8a6', '💊');

  return new;
end;
$$;
