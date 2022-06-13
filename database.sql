
DROP DATABASE IF EXISTS `web`;
CREATE DATABASE IF NOT EXISTS `web`;

-- USE `web`;
-- GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'feim1911';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'feim1911';
-- a db.js futtatasanal kaptam egy hibat amit a fenti sorral javitottam

CREATE TABLE `web`.`users` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `UserName` VARCHAR(45) NULL UNIQUE,
  `UserEmail` VARCHAR(45) NULL,
  `UserLevel` VARCHAR(45) NULL,
  `Password` VARCHAR(255) NULL,
  PRIMARY KEY (`UserID`));

CREATE TABLE `web`.`trainline` (
  `LineID` INT NOT NULL AUTO_INCREMENT,
  `DepartureStation` VARCHAR(45) NULL,
  `ArrivalStation` VARCHAR(45) NULL,
  `Price` int NULL,
  `DepartureTime` TIME NULL,
  `ArrivalTime` TIME NULL,
  `Day` VARCHAR(45) NULL,
  `Type` VARCHAR(45) NULL,
  PRIMARY KEY (`LineID`) );

CREATE TABLE `web`.`booking` (
  `bookingID` INT NOT NULL AUTO_INCREMENT,
  `trainlineID` INT NULL,
  `clientID` INT,
  PRIMARY KEY (`bookingID`),
  CONSTRAINT `FK_Booking_Line`
    FOREIGN KEY (`trainlineID`)
    REFERENCES `web`.`trainline` (`LineID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);
ALTER TABLE `web`.`booking` 
  ADD CONSTRAINT `FK_Booking_Client`
  FOREIGN KEY (`clientID`)
  REFERENCES `web`.`users` (`UserID`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;
  
INSERT INTO web.trainline VALUES (default, 'Kolozsvar', 'Nagy Varad', 5, '10:00:00', '12:00:00','Monday', 'Regional');

-- par felhasznalo beszurasa:
-- INSERT INTO web.users VALUES (default, 'Kati', 'katika@gmail.com', 'client'), 
-- 							(default, 'Szilvi', 'szilvi@gmail.com', 'client'),
--                             (default, 'Janos', 'jani@gmail.com', 'client');

-- SELECT * FROM web.trainline;

-- SELECT UserID FROM web.users WHERE UserName = 'Kati';  

-- SELECT Price, Type FROM web.trainline WHERE LineID = 5

-- Update hogy latszodjon a valtozas ajax-nal

-- UPDATE web.trainline
-- SET Type = 'Fast'
-- WHERE LineId = 5

-- select * from web.users 

-- select t1.LineID as FirstLineID, t1.Price + t2.Price as Sum, TIMEDIFF(t2.ArrivalTime, t1.DepartureTime) as Time, t2.LineID as SecondLineID
-- from web.trainline as t1
-- join web.trainline as t2
-- on t1.ArrivalStation = t2.DepartureStation
-- where t1.DepartureStation LIKE 'Kolozsvar' 
-- 	AND t2.ArrivalStation = 'Nagy Varad'
--     AND t1.ArrivalTime < t2.DepartureTime
--     AND t1.Day = t2.Day

-- select t1.LineID as FirstLineID, t1.DepartureStation as FirstDepartureStation, t1.ArrivalStation as IntermediateStation, t1.DepartureTime as FirstDepartureTime, t1.ArrivalTime as FirstArrivalTime, t1.Day as Day, t1.Price + t2.Price as Sum, TIMEDIFF(t2.ArrivalTime, t1.DepartureTime) as Time, t2.LineID as SecondLineID, t2.ArrivalStation as EndStation, t2.DepartureTime as SecondDepartureTime, t2.ArrivalTime as SecondArrivalTime 
-- from web.trainline as t1 join web.trainline as t2 
-- on t1.ArrivalStation = t2.DepartureStation 
-- where t1.DepartureStation = 'Kolozsvar'
--  AND t2.ArrivalStation = 'Nagy Varad'
--  AND t1.ArrivalTime < t2.DepartureTime
--  AND t1.Day = t2.Day
    