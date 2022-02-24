SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `bazar` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `bazar`;

CREATE USER 'bazos'@'localhost' IDENTIFIED WITH mysql_native_password BY 'test_bazar_123';
GRANT ALL PRIVILEGES ON bazar.* TO 'bazos'@'localhost';

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uname` tinytext NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uname` (`uname`) USING HASH,
  UNIQUE KEY `email` (`email`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `zaznamy`;
CREATE TABLE `zaznamy` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) unsigned DEFAULT NULL,
  `name` text DEFAULT NULL,
  `email` text NOT NULL,
  `passwd` text DEFAULT NULL,
  `cat` tinytext NOT NULL,
  `descr` longtext DEFAULT NULL,
  `pic` text DEFAULT NULL,
  `price` int(10) unsigned NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `date` (`date`),
  KEY `price` (`price`),
  KEY `cat` (`cat`(3)),
  KEY `uid` (`uid`),
  CONSTRAINT `zaznamy_ibfk_5` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;