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

INSERT INTO roles(role_name) VALUES ('Admin');
INSERT INTO roles(role_name) VALUES ('Finance');

INSERT INTO users(user_name, user_email, user_phone, user_role, datecreated, accountstatus) 
VALUES('Felix Kiamba', 'kiambafelix@yahoo.com', '0739533409', 'fba4bf08-2599-41f2-8843-7a13eb39c023', now(), 'Active');

ALTER TABLE users ADD COLUMN user_password VARCHAR(255);