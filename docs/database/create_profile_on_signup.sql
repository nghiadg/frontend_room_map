DECLARE 
    default_role_id int8;

BEGIN
  -- get default role id
  SELECT id INTO default_role_id 
  FROM public.roles
  WHERE name = 'renter'
  LIMIT 1;
  -- create profile record for new user
  INSERT INTO public.profiles (
    user_id,
    role_id,
    full_name
  )
  VALUES (
    NEW.id,
    default_role_id,
    NEW.raw_user_meta_data ->> 'full_name'
  );

  RETURN NEW;
END;