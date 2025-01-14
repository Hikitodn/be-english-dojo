-- Insert Roles data
INSERT INTO 
  roles 
    (id, name) 
  VALUES 
    (1, 'STUDENT'),
    (2, 'TEACHER'),
    (3, 'ADMIN')
  ON CONFLICT (id) DO NOTHING;
