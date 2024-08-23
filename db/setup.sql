-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    discord_id VARCHAR(28) NOT NULL,
	user_role ENUM('student', 'staff') NOT NULL,
	iee_id INT NOT NULL,
	regyear INT,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS guests (
    discord_id VARCHAR(28) NOT NULL,
    reason TEXT,
    given_by VARCHAR(28),
    msg_id VARCHAR(128)
);

-- Create the user_regyear_counts table
CREATE TABLE IF NOT EXISTS user_regyear_counts (
    registration_year INT NOT NULL,
    user_count INT NOT NULL,
    PRIMARY KEY (`registration_year`)
);

-- Create the user_role_totals table
CREATE TABLE IF NOT EXISTS user_role_totals (
	user_role ENUM('student', 'staff') NOT NULL,
	user_count INT DEFAULT 0,
    PRIMARY KEY (`user_role`)
);

-- Insert initial value for user_role_totals table
INSERT IGNORE INTO user_role_totals (user_role, user_count)
VALUES
    ('student', 0),
    ('staff', 0);

-- Delimiter to allow for trigger creation with BEGIN...END block
DELIMITER $$

-- Trigger for inserts
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN

    -- Update the user_role_totals table for the new user
    INSERT INTO user_role_totals (user_role, user_count)
    VALUES (NEW.user_role, 1)
    ON DUPLICATE KEY UPDATE user_count = user_count + 1;

    -- Update the user_regyear_counts table for the new user
    IF NEW.regyear IS NOT NULL THEN
        INSERT INTO user_regyear_counts (registration_year, user_count)
        VALUES (NEW.regyear, 1)
        ON DUPLICATE KEY UPDATE user_count = user_count + 1;
    END IF;
END$$

-- Trigger for deletes
CREATE TRIGGER after_user_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN

    -- Update the user_role_totals table for the deleted user
    UPDATE user_role_totals
    SET user_count = user_count - 1
    WHERE user_role = OLD.user_role;

    -- Update the user_regyear_counts table for the deleted user
    IF OLD.regyear IS NOT NULL THEN
        UPDATE user_regyear_counts
        SET user_count = user_count - 1
        WHERE registration_year = OLD.regyear;
    END IF;

    DELETE FROM user_regyear_counts
    WHERE user_count = 0;
END$$

-- Reset the delimiter back to default
DELIMITER ;