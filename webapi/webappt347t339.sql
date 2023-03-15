/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.33-log : Database - webappt347t339
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`webappt347t339` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `webappt347t339`;

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `createdat` timestamp NULL DEFAULT NULL,
  `updatedat` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`),
  UNIQUE KEY `roles_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `roles` */

insert  into `roles`(`id`,`name`,`code`,`description`,`createdat`,`updatedat`) values (1,'ADMIN','ADMIN','ADMIN ROLE','2020-03-14 02:59:49','2021-06-10 11:15:29'),(2,'USER','USER','USER','2020-03-14 02:59:49','2021-06-10 11:14:40'),(3,'MANAGER','MANAGER','MANAGER ROLE','2020-03-14 02:59:49','2021-06-10 11:15:38');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(50) NOT NULL,
  `name` varchar(300) NOT NULL,
  `mobileno` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleid` int(11) NOT NULL,
  `photo` text,
  `provider` varchar(100) DEFAULT NULL,
  `otp` varchar(50) DEFAULT NULL,
  `lastname` varchar(300) DEFAULT NULL,
  `otpexpiry` timestamp NULL DEFAULT NULL,
  `firstname` varchar(300) DEFAULT NULL,
  `middlename` varchar(300) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `civilstatus` varchar(100) DEFAULT NULL,
  `region_code` varchar(50) DEFAULT NULL,
  `province_code` varchar(50) DEFAULT NULL,
  `municipality_code` varchar(50) DEFAULT NULL,
  `barangay_code` varchar(50) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `roleid` (`roleid`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleid`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
