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
    entrance_email VARCHAR(255) NOT NULL UNIQUE,
    entrance_password_hash VARCHAR(255) NOT NULL,

    CONSTRAINT fk_condominium_id FOREIGN KEY (condominium_id) REFERENCES Condominium (condominium_id) ON DELETE CASCADE
);

CREATE TABLE alert (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    alert_danger_level VARCHAR(20) NOT NULL,
    alert_date TIMESTAMP NOT NULL,
    alert_description MEDIUMBLOB NOT NULL,
    alert_title VARCHAR(100) NOT NULL,
    entrance_id INT,
    parent_id INT,
    CONSTRAINT fk_entrance FOREIGN KEY (entrance_id) REFERENCES entrance(entrance_id),
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES alert(alert_id)
);

INSERT INTO condominium (condominium_trustee_name, condominium_name, condominium_email, condominium_password_hash, latitude, longitude)
VALUES ('Franz Bonaparta', 'Sunrise Villas', 'trustee1@sunrisevillas.com', '123', 40.7128, -74.0060),
       ('Helmuth Voss', 'Ocean Breeze Condos', 'trustee2@oceanbreeze.com', '123', 34.0522, -118.2437),
       ('Klaus Poppe', 'Mountain View Residences', 'trustee3@mountainview.com', '123', 37.7749, -122.4194);

INSERT INTO entrance (condominium_id, latitude, longitude,entrance_email,entrance_password_hash)
VALUES (1, 40.7130, -74.0070,'entrance1@entrance.com','123'),
       (1, 40.7125, -74.0065,'entrance2@entrance.com','123'),
       (1, 40.70930014538002, -74.01063645352922,'entrance3@entrance.com','123'),
       (1, 40.7154954045871, -74.00928915463217,'entrance4@entrance.com','123'),
       (1, 40.71468310365792, -74.0114722090322,'entrance5@entrance.com','123'),
       (2, 34.0525, -118.2440,'entrance6@entrance.com','123'),
       (3, 37.7750, -122.4190,'entrance7@entrance.com','123');

INSERT INTO alert (alert_danger_level, alert_title, alert_date, alert_description, entrance_id)
VALUES
    ('HIGH', 'Motorcycle at entrance 405', NOW(), 'AKDNDIFISBSBAU', 1),
    ('MEDIUM', 'Crackhead at entrance 210', NOW(), 'AKDNDIFISBSBAU', 1),
    ('LOW', 'Car accident', NOW(), 'AKDNDIFISBSBAU', 2);
