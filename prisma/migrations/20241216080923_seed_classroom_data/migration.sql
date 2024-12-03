INSERT INTO users (id, email, password, first_name, last_name, is_verified) VALUES
(100,'student@example.com', '$2b$04$4e09y9XwCyJ8D9ZaNWEslOuLDnfeoP386lZGX8H.0j15HXoL8ioMK', 'John', 'Doe', true),
(101,'teacher@example.com', '$2b$04$4e09y9XwCyJ8D9ZaNWEslOuLDnfeoP386lZGX8H.0j15HXoL8ioMK', 'Jane', 'Doe', true),
(102,'admin@example.com', '$2b$04$4e09y9XwCyJ8D9ZaNWEslOuLDnfeoP386lZGX8H.0j15HXoL8ioMK', 'Bob', 'Smith', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (phone_number, date_of_birth, gender, user_id) VALUES
('1234567890', '1990-01-01', 'MALE', 100),
('0987654321', '1980-01-01', 'FEMALE', 101),
('5555555555', '1970-01-01', 'MALE', 102);

INSERT INTO user_roles (user_id, role_id) VALUES
(100, 1),
(101, 2),
(102, 3);

INSERT INTO classrooms (id, code, name, capacity, background_url, tuition_fee, start_date, end_date) VALUES
(100,'ABC123', 'English 11', 20, null, 10000000, '2024-12-25', '2025-01-01'),
(101,'XYZ456', 'Algreba 22', 25, null, 12000000, '2024-12-16', '2025-01-02')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_classrooms (classroom_id, student_id, teacher_id, absent_count, status) VALUES
(100, 100, 101, 0, 'ACTIVE'),
(101, 100, 101, 0, 'ACTIVE');

INSERT INTO lessons (id, topic, note, classroom_id) VALUES
(1, 'Lesson 1', 'This is lesson 1', 100),
(2, 'Lesson 2', 'This is lesson 2', 101);

INSERT INTO lesson_resources (name, type, url, lesson_id) VALUES
('Resource 1', 'VIDEO', 'https://example.com/resource1.mp4', 1),
('Resource 2', 'PDF', 'https://example.com/resource2.pdf', 2);
