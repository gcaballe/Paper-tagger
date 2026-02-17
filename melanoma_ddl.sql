-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Temps de generació: 10-01-2025 a les 16:46:45
-- Versió del servidor: 8.0.39-0ubuntu0.24.04.2
-- Versió de PHP: 8.1.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dades: `melanoma`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `papers`
--
-- This mimics the "OR REPLACE" functionality safely
DROP TABLE IF EXISTS `papers`;

CREATE TABLE `papers` (
  `numero_identificador` int NOT NULL AUTO_INCREMENT,
  `numpacient` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `estat` varchar(255) DEFAULT NULL,
  `pregunta1` tinyint(1) DEFAULT NULL,
  `pregunta2` tinyint(1) DEFAULT NULL,
  `pregunta3` tinyint(1) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`numero_identificador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `papers_reviewed`;

CREATE TABLE `papers_reviewed` (
  `numero_identificador` int NOT NULL,
  `numpacient` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `estat` varchar(255) DEFAULT NULL,
  `pregunta1` tinyint(1) DEFAULT NULL,
  `pregunta2` tinyint(1) DEFAULT NULL,
  `pregunta3` tinyint(1) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` varchar(64) DEFAULT NULL,
  `r_pregunta1` tinyint DEFAULT NULL,
  `r_pregunta2` tinyint DEFAULT NULL,
  `r_pregunta3` tinyint DEFAULT NULL,
  `r_last_reviewed` datetime DEFAULT NULL,
  `r_user` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
