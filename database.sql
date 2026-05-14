CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, role)
VALUES ('admin', '$2a$10$F9vFq4Qp9a5mUuYzv8eJ..examplehash', 'admin@eduquest.com', 'admin');

select * from users;

CREATE TABLE semester (
    id SERIAL PRIMARY KEY,
    semester_name VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    author VARCHAR(100),
    semester_id INT REFERENCES semester(id) ON DELETE CASCADE,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE syllabus (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(100),
    semester_id INT REFERENCES semester(id) ON DELETE CASCADE,
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pyqs (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(100),
    semester_id INT REFERENCES semester(id) ON DELETE CASCADE,
    year INT,
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO semester (semester_name) VALUES
('Semester 1'),
('Semester 2'),
('Semester 3'),
('Semester 4'),
('Semester 5'),
('Semester 6'),
('Semester 7'),
('Semester 8');

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    semester_id INT NOT NULL,
    subject_name TEXT NOT NULL,
    notes_url TEXT
);

select * from users;
select * from subjects;
select * from syllabus;
select * from books;
select * from semester;
select * from pyqs;
