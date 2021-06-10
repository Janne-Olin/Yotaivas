-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 10, 2021 at 03:35 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Yotaivas`
--

-- --------------------------------------------------------

--
-- Table structure for table `havainto`
--

CREATE TABLE `havainto` (
  `id` int(10) NOT NULL,
  `kohde_id` int(10) NOT NULL,
  `pvm` date NOT NULL,
  `valine` varchar(50) NOT NULL,
  `paikka` varchar(30) NOT NULL,
  `selite` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `havainto`
--

INSERT INTO `havainto` (`id`, `kohde_id`, `pvm`, `valine`, `paikka`, `selite`) VALUES
(10, 1, '2021-06-16', 'Kaukoputki', 'Rautalampi', 'Kaukoputkella näkyi hienosti'),
(12, 1, '2021-07-01', 'Kiikarit', 'Koirapuisto', 'Kiikareilla näkyi heikommin'),
(13, 3, '2021-10-27', 'Silmät', 'Rautavaara', 'Pimeässä paikassa näkyi paljain silmin'),
(14, 10, '2020-01-01', 'Kaukoputki', 'Laajalampi', 'Kuut näkyivät hienosti'),
(15, 14, '2020-12-31', 'Kaukoputki', 'Parveke', 'Joitain yksityiskohtia pystyi erottamaan kaukoputkella'),
(16, 10, '2021-06-21', 'Silmät', 'Laajalampi', 'Jupiterin pystyy näkemään paljain silmin keskellä kesääkin'),
(17, 15, '2021-02-05', 'Kaukoputki', 'Parveke', 'Kaksoistähti erottui selkeästi kaukoputkella katsottaessa');

-- --------------------------------------------------------

--
-- Table structure for table `kohde`
--

CREATE TABLE `kohde` (
  `id` int(10) NOT NULL,
  `nimi` varchar(50) NOT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `tyyppi_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kohde`
--

INSERT INTO `kohde` (`id`, `nimi`, `alias`, `tyyppi_id`) VALUES
(1, 'Messier 1', 'Rapusumu', 1),
(2, 'Messier 2', '', 1),
(3, 'Messier 31', 'Andromedan galaksi', 1),
(4, 'Messier 3', '', 1),
(10, 'Jupiter', '', 2),
(11, 'Messier 27', 'Nostopainosumu', 1),
(12, 'C/2020 F3', 'NEOWISE', 5),
(13, 'Messier 4', '', 1),
(14, 'Mars', '', 2),
(15, 'Mizar', '', 3);

-- --------------------------------------------------------

--
-- Table structure for table `kohdetyyppi`
--

CREATE TABLE `kohdetyyppi` (
  `id` int(10) NOT NULL,
  `nimi` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kohdetyyppi`
--

INSERT INTO `kohdetyyppi` (`id`, `nimi`) VALUES
(1, 'Messierin kohde'),
(2, 'Planeetta'),
(3, 'Tähti'),
(4, 'Muu'),
(5, 'Komeetta');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `havainto`
--
ALTER TABLE `havainto`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kohde`
--
ALTER TABLE `kohde`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kohdetyyppi`
--
ALTER TABLE `kohdetyyppi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `havainto`
--
ALTER TABLE `havainto`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `kohde`
--
ALTER TABLE `kohde`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `kohdetyyppi`
--
ALTER TABLE `kohdetyyppi`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
