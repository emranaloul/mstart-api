DROP TABLE IF EXISTS Claimed_Deals;

DROP TABLE IF EXISTS Deals;

DROP TABLE IF EXISTS jwt;

DROP TABLE IF EXISTS Users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table
    Users (
        id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
        password varchar(255) not null,
        Server_DateTime TIMESTAMP NOT NULL DEFAULT current_timestamp,
        DateTime_UTC timestamp NOT NULL,
        Update_DateTime_UTC timestamp,
        Last_Login_DateTime_UTC timestamp,
        Name varchar(255) NOT NULL unique,
        email varchar(255) NOT NULL unique,
        Phone varchar(255) NOT NULL unique,
        Status varchar(255) NOT NULL DEFAULT 'Active',
        Gender varchar(255) NOT NULL,
        Date_Of_Birth date not NULL,
        image text,
        role varchar(255) DEFAULT 'user'
    );

CREATE TABLE
    jwt (
        id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
        user_id uuid NOT NULL,
        access_token TEXT NOT NULL,
        Server_DateTime TIMESTAMP NOT NULL DEFAULT current_timestamp,
        DateTime_UTC timestamp NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users (id)
    );

create table
    Deals (
        id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
        Server_DateTime TIMESTAMP NOT NULL DEFAULT current_timestamp,
        DateTime_UTC timestamp NOT NULL,
        Update_DateTime_UTC timestamp,
        Name varchar(255) NOT NULL,
        Description text not NULL,
        Status varchar(255) NOT NULL DEFAULT 'Active',
        Amount FLOAT (4) NOT NULL,
        Currency varchar(255) not NULL DEFAULT 'jod'
    );

create table
    Claimed_Deals (
        id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
        Server_DateTime TIMESTAMP NOT NULL DEFAULT current_timestamp,
        DateTime_UTC timestamp NOT NULL,
        Deal_id uuid NOT NULL,
        User_id uuid NOT NULL,
        Amount FLOAT (4) NOT NULL,
        Currency varchar(255) not NULL,
        FOREIGN KEY (user_id) REFERENCES Users (id),
        FOREIGN KEY (Deal_id) REFERENCES Deals (id)
    )