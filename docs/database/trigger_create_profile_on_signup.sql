DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;

create trigger create_profile_on_signup
after insert on auth.users for each row
execute function public.create_profile_for_new_user();