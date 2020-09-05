CREATE DATABASE studentmisdb;

CREATE TABLE roles(
    role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(255) NOT NULL,
    user_role uuid,
    datecreated TIMESTAMP,
    accountstatus VARCHAR(255) NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY(user_role) REFERENCES roles(role_id)
);

CREATE TABLE students(
    student_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    student_number VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP,
    student_status VARCHAR(255) NOT NULL,
    user_id uuid,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE courses(
    course_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_name VARCHAR(255) NOT NULL,
    course_status VARCHAR(255) NOT NULL,
    date_created TIMESTAMP,
    user_id uuid,
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE student_courses(
    allocation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id uuid,
    course_id uuid,
    enroll_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT fk_all_students FOREIGN KEY(student_id) REFERENCES students(student_id),
    CONSTRAINT fk_all_courses FOREIGN KEY(course_id) REFERENCES courses(course_id)
);

INSERT INTO roles(role_name) VALUES ('Admin');
INSERT INTO roles(role_name) VALUES ('Finance');

INSERT INTO users(user_name, user_email, user_phone, user_role, datecreated, accountstatus) 
VALUES('Felix Kiamba', 'kiambafelix@yahoo.com', '0739533409', '63dbfda2-1646-4911-a12a-173a22eb3b5b', now(), 'Active');

ALTER TABLE users ADD COLUMN user_password VARCHAR(255);