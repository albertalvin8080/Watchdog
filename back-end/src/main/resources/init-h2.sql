CREATE TABLE condominium
(
    condominium_id IDENTITY PRIMARY KEY,
    condominium_trustee_name VARCHAR(255),
    condominium_name VARCHAR(100) NOT NULL,
    condominium_email VARCHAR(255) NOT NULL UNIQUE,
    condominium_password_hash VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
);

CREATE TABLE entrance
(
    entrance_id IDENTITY PRIMARY KEY,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    condominium_id INTEGER NOT NULL,
    CONSTRAINT fk_condominium_id FOREIGN KEY (condominium_id) REFERENCES Condominium (condominium_id) ON DELETE CASCADE
);

INSERT INTO condominium (condominium_trustee_name, condominium_name, condominium_email, condominium_password_hash, latitude, longitude)
VALUES ('Franz Bonaparta', 'Sunrise Villas', 'trustee1@sunrisevillas.com', '123', 40.7128, -74.0060),
       ('Helmuth Voss', 'Ocean Breeze Condos', 'trustee2@oceanbreeze.com', '123', 34.0522, -118.2437),
       ('Klaus Poppe', 'Mountain View Residences', 'trustee3@mountainview.com', '123', 37.7749, -122.4194);

INSERT INTO entrance (condominium_id, latitude, longitude)
VALUES (1, 40.7130, -74.0070),
       (1, 40.7125, -74.0065),
       (2, 34.0525, -118.2440),
       (3, 37.7750, -122.4190);
