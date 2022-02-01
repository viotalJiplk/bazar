SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `bazar` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `bazar`;

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

INSERT INTO `users` (`uid`, `uname`, `email`, `password`) VALUES
(1,	'test',	'vojta.varecha@email.cz',	'$2y$10$9OdQOikHHhdzJVs4MnfM8.H7XT5./nuWTfMOxUQzcm5QCloBSuj0q'),
(2,	'sasa',	'vojta.varech@email.cz',	'$2y$10$ySC.yb1ncPta3dj85HMp/e46y10BksBq9kpUkaO.knNTl1VUjH0Pq'),
(3,	'dsadas',	'asdadsadsa@sdadsad.cz',	'$2y$10$5BQSvu9u2SwzdpGgWdWS8.N/Pbm5oTW7jeNi3hQSHPCWDGQL34IB2'),
(4,	'dsadsad',	'sadsada@sdasdad.cz',	'$2y$10$4D1Oyb5wJ9cobsJCPL2P4ei1/FfBpfyiDJ0yZR7xCtiHnFtkFpke6');

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
  `date` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `date` (`date`),
  KEY `price` (`price`),
  KEY `cat` (`cat`(3)),
  KEY `uid` (`uid`),
  CONSTRAINT `zaznamy_ibfk_5` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `zaznamy` (`id`, `uid`, `name`, `email`, `passwd`, `cat`, `descr`, `pic`, `price`, `date`) VALUES
(26,	NULL,	'Vojtech V',	'vojta.varecha@email.cz',	'$2y$10$0f7U0RNEa4l262HJOrmXRu3JxnXBkU/WKhGl9hx9KOguZwQmF90i2',	'tech',	'gwregrfagas',	NULL,	100000,	'2021-03-17'),
(27,	NULL,	'njbhbhb',	'vojta.varecha@email.cz',	'$2y$10$phm4eZ6VxjL8xFOnzSs7q.9LNHlhe9GvXYNq1bnX8e/seEPuNgf8m',	'tech',	'h h h h h j b vuibuj',	NULL,	100,	'2021-03-18'),
(28,	NULL,	'dsafcda',	'vojta.varecha@email.cz',	'$2y$10$wc5pBBwvEbpKzCoguoerhO5CBHaxxSA4IAXbBTNg7Ce1OBHNtz6Ga',	'tech',	'',	NULL,	10000,	'2021-03-20'),
(29,	NULL,	'dsafcda',	'vojta.varecha@email.cz',	'$2y$10$mb.YBfA73zQS7MWIctEEveY3eYYU.kxpjRr0RQR4STEuGqg9JRqji',	'tech',	'',	NULL,	10000,	'2021-03-20'),
(30,	NULL,	'dsafcda',	'vojta.varecha@email.cz',	'$2y$10$K5I3iyhL5T3kfiW7BBsdWu.UexalLQn2cL7rTcYFwRQwxKQKpU.ja',	'tech',	'dsadsadsadsada',	NULL,	10000,	'2021-03-20'),
(32,	NULL,	'dsafcda',	'vojta.varecha@email.cz',	'$2y$10$.QqZ3ECtBgHapQdewzhyRukduKOUcY2l0wwOFNk17qGZXYRLKFV0C',	'tech',	'dsadsadsadsada',	NULL,	10000,	'2021-03-20'),
(34,	NULL,	'sadas',	'vojta.varecha@email.cz',	'$2y$10$gq5PCvl84n5CmpA.9P.btODFDxqS4BBzwhsqWBRoZT9tXruRNeGaS',	'tech',	'dqewqdsad',	'img_q2kmnex3ori.png',	100000,	'2021-03-20'),
(35,	NULL,	'dvdsvfsv',	'vojta.varecha@email.cz',	'$2y$10$LSQegCgdrUkytZTFnmMjj.PuycfaMlgaBuxbcwiME/kN9iP4ic9ki',	'tech',	'vcvxcvxcv',	'img_mcp6dnpmwyk.png',	1000,	'2021-03-20'),
(36,	NULL,	'wefewf',	'vojta.varecha@email.cz',	'$2y$10$7N/qQHU3En2Y.djxLXGEx.C7PcX3760x/C1GeOCDJMRoAKxSn.Xo.',	'tech',	'fewfewfw',	'img_mcp6dnpmwyk.png',	10000,	'2021-03-20'),
(37,	NULL,	'dsada',	'vojta.varecha@email.cz',	'$2y$10$ckjwLM15WEhQZ0i7ocSoBe3OkeOZhUmwFVhZRG9oyUNZtkws52gWK',	'tech',	'dasdad',	NULL,	10000,	'2021-03-20'),
(38,	NULL,	'vxcv',	'vojta.varecha@email.cz',	'$2y$10$I/uoGYfaZS/szqC7Sbb6xuwsdt./0ZYAskuJaUb1Loy5F.JFJBdSK',	'tech',	'vxcvxcv',	'img_1ib6j8qm19a.png',	1000,	'2022-01-13'),
(39,	NULL,	'sdsqesada',	'sadsadjnjka@sdasdad.cz',	'$2y$10$Z3Xne4E9LI812Ux6s/t6Yehaj6kCnAEzKFAalh.dYNFwqFMhQ/E.6',	'tech',	'cadsad',	NULL,	100,	'2022-01-23');