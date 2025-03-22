CREATE TABLE condominium
(
    condominium_id            IDENTITY PRIMARY KEY,
    condominium_trustee_name  VARCHAR(255),
    condominium_name          VARCHAR(100) NOT NULL,
    condominium_email         VARCHAR(255) NOT NULL UNIQUE,
    condominium_password_hash VARCHAR(255) NOT NULL,
    latitude                  DOUBLE       NOT NULL,
    longitude                 DOUBLE       NOT NULL
);

CREATE TABLE entrance
(
    entrance_id            IDENTITY PRIMARY KEY,
    latitude               DOUBLE       NOT NULL,
    longitude              DOUBLE       NOT NULL,
    condominium_id         INTEGER      NOT NULL,
    entrance_email         VARCHAR(255) NOT NULL UNIQUE,
    entrance_password_hash VARCHAR(255) NOT NULL,

    CONSTRAINT fk_condominium_id FOREIGN KEY (condominium_id) REFERENCES Condominium (condominium_id) ON DELETE CASCADE
);

CREATE TABLE alert
(
    alert_id           INT AUTO_INCREMENT PRIMARY KEY,
    alert_danger_level VARCHAR(20)  NOT NULL,
    alert_date         TIMESTAMP    NOT NULL,
    alert_title        VARCHAR(100) NOT NULL,
    entrance_id        INT,
    parent_id          INT,
    alert_description  MEDIUMBLOB   NOT NULL,
    CONSTRAINT fk_entrance FOREIGN KEY (entrance_id) REFERENCES entrance (entrance_id),
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES alert (alert_id)
);

INSERT INTO condominium (condominium_trustee_name, condominium_name, condominium_email, condominium_password_hash,
                         latitude, longitude)
VALUES ('Franz Bonaparta', 'Sunrise Villas', 'trustee1@sunrisevillas.com', '123', 40.7128, -74.0060),
       ('Helmuth Voss', 'Ocean Breeze Condos', 'trustee2@oceanbreeze.com', '123', 34.0522, -118.2437),
       ('Klaus Poppe', 'Mountain View Residences', 'trustee3@mountainview.com', '123', 37.7749, -122.4194);

INSERT INTO entrance (condominium_id, latitude, longitude, entrance_email, entrance_password_hash)
VALUES (1, 40.7130, -74.0070, 'entrance1@entrance.com', '123'),
       (1, 40.7125, -74.0065, 'entrance2@entrance.com', '123'),
       (1, 40.70930014538002, -74.01063645352922, 'entrance3@entrance.com', '123'),
       (1, 40.7154954045871, -74.00928915463217, 'entrance4@entrance.com', '123'),
       (1, 40.71468310365792, -74.0114722090322, 'entrance5@entrance.com', '123'),
       (2, 34.0525, -118.2440, 'entrance6@entrance.com', '123'),
       (3, 37.7750, -122.4190, 'entrance7@entrance.com', '123'),
       (1, 40.71413732339604, -74.0167377428322, 'entrance8@entrance.com', '123'),
       (1, 40.70636632928598, -74.01480889740652, 'entrance9@entrance.com', '123'),
       (1, 40.705616624670384, -74.01271740607613, 'entrance10@entrance.com', '123'),
       (1, 40.705160572300954, -74.01880705961578, 'entrance11@entrance.com', '123')
;

INSERT INTO alert (alert_danger_level, alert_title, alert_date, alert_description, entrance_id, parent_id)
VALUES ('MEDIUM', 'Crackhead at entrance 210', NOW(), 'AKDNDIFISBSBAU', 1, null),
       ('LOW', 'Car accident', NOW(), 'AKDNDIFISBSBAU', 2, null),
       ('MEDIUM', 'Crackhead sighted', NOW(), 'AKDNDIFISBSBAU', 4, 1),
       ('MEDIUM', 'Crackhead sighted again', NOW(), 'AKDNDIFISBSBAU', 5, 3),
       ('HIGH', 'Crackhead killed someone', NOW(), 'AKDNDIFISBSBAU', 8, 4),
       ('LOW', 'Two Guys in a motorbike', NOW(), 'AKDNDIFISBSBAU', 9, null),
       ('MEDIUM', 'Two guys again', NOW(), 'AKDNDIFISBSBAU', 10, 6),
       ('MEDIUM', 'Two guys, maybe theyre the same', NOW(), 'AKDNDIFISBSBAU', 11, 6)
;

INSERT INTO alert (alert_danger_level, alert_title, alert_date, alert_description, entrance_id, parent_id)
VALUES
    ('LOW', 'Suspicious package found', NOW(), 'A suspicious package was found near the entrance.', 2, null),
    ('MEDIUM', 'Fire alarm triggered', NOW(), 'The fire alarm was triggered in the lobby.', 3, null),
    ('HIGH', 'Power outage reported', NOW(), 'A power outage has affected the entire building.', 4, null),
    ('LOW', 'Water flood at gate 44', NOW(), 'A water leak was detected in the parking garage.', 5, null),
    ('LOW', 'Five people', NOW(), 'Loud music reported from unit 304.', 7, null),
    ('HIGH', 'Gas leak detected', NOW(), 'A gas leak was detected near the boiler room.', 8, null),
    ('MEDIUM', 'Unauthorized access', NOW(), 'An unauthorized person was seen entering the building.', 9, null),
    ('LOW', 'Lost and found item', NOW(), 'A wallet was found in the lobby.', 10, null),
    ('HIGH', 'Medical emergency', NOW(), 'A resident has collapsed in the hallway.', 11, null),
    ('LOW', 'Pest sighting', NOW(), 'A rat was seen in the garbage area.', 1, null),
    ('MEDIUM', 'Broken window', NOW(), 'A window in the common area is broken.', 2, null),
    ('HIGH', 'Flood in basement', NOW(), 'The basement is flooded due to heavy rain.', 3, null),
    ('LOW', 'Parking violation', NOW(), 'A car is parked in a no-parking zone.', 4, null),
    ('MEDIUM', 'Suspicious person', NOW(), 'A suspicious person was seen loitering near the entrance.', 5, null),
    ('HIGH', 'Structural damage', NOW(), 'Cracks were found in the building foundation.', 6, null),
    ('LOW', 'Mailbox vandalism', NOW(), 'Several mailboxes were vandalized.', 7, null),
    ('MEDIUM', 'Heating system failure', NOW(), 'The heating system is not working.', 8, null),
    ('HIGH', 'Security breach', NOW(), 'A security breach was detected in the system.', 9, null),
    ('LOW', 'Lost pet', NOW(), 'A resident has lost their cat.', 10, null),
    ('MEDIUM', 'Bike theft', NOW(), 'A bike was stolen from the bike rack.', 11, null),
    ('HIGH', 'Fire in the kitchen', NOW(), 'A small fire broke out in unit 205.', 1, null),
    ('LOW', 'Littering complaint', NOW(), 'Litter was found in the courtyard.', 2, null),
    ('MEDIUM', 'Broken gate', NOW(), 'The main gate is not closing properly.', 3, null),
    ('HIGH', 'Sewage backup', NOW(), 'Sewage is backing up in the basement.', 4, null),
    ('LOW', 'Noise from construction', NOW(), 'Construction noise is disturbing residents.', 5, null),
    ('MEDIUM', 'Faulty smoke detector', NOW(), 'A smoke detector is beeping continuously.', 6, null),
    ('HIGH', 'Car break-in', NOW(), 'A car was broken into in the parking lot.', 7, null),
    ('LOW', 'Overflowing trash bin', NOW(), 'The trash bin is overflowing.', 8, null),
    ('MEDIUM', 'Suspicious vehicle', NOW(), 'A suspicious vehicle is parked outside.', 9, null),
    ('HIGH', 'Injury in front gate', NOW(), 'A resident injured themselves in the gym.', 10, null),
    ('LOW', 'Lost grandma', NOW(), 'A set of keys was found in the elevator.', 11, null),
    ('MEDIUM', 'Suspicious man', NOW(), 'The water heater is not working.', 1, null),
    ('LOW', 'Dog barking', NOW(), 'A dog has been barking non-stop.', 3, null),
    ('MEDIUM', 'Broken lock', NOW(), 'The lock on the side door is broken.', 4, null),
    ('HIGH', 'Electrical short circuit', NOW(), 'A short circuit caused a power surge.', 5, null),
    ('LOW', 'Graffiti on walls', NOW(), 'Graffiti was found on the building walls.', 6, null),
    ('HIGH', 'Fallen tree branch', NOW(), 'A large tree branch fell in the parking lot.', 8, null)
;

CREATE TABLE admin
(
    admin_id       INT AUTO_INCREMENT PRIMARY KEY,
    admin_username VARCHAR(100) NOT NULL,
    admin_email    VARCHAR(255) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    admin_role     VARCHAR(20)  NOT NULL
);

INSERT INTO admin (admin_username, admin_email, admin_password, admin_role)
VALUES ('franz', 'franz@gmail.com', '123', 'SUPER_ADMIN');
