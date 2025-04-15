-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2025 at 08:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alamy1_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `make` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `make`, `model`, `year`, `price`, `mileage`, `image`, `created_at`) VALUES
(1, 'BMW M5', 'BMW', 'M5', 2023, 114999.00, 5201, 'm5.jpg', '2025-04-02 14:24:16'),
(2, 'Audi RS7', 'Audi', 'RS7', 2023, 122999.00, 3821, 'rs7.jpg', '2025-04-02 14:24:16'),
(3, 'Mercedes-AMG C63', 'Mercedes-Benz', 'C-Class', 2022, 94999.00, 8243, 'c63.jpg', '2025-04-02 14:24:16'),
(4, 'Porsche 911 Turbo S', 'Porsche', '911', 2021, 189999.00, 2251, 'turbos.jpg', '2025-04-02 14:24:16'),
(5, 'BMW M4 Competition', 'BMW', 'M4', 2022, 104499.00, 6910, 'm4.jpeg', '2025-04-02 14:24:16'),
(6, 'Audi A3', 'Audi', 'A3', 2021, 38999.00, 17850, 'a3.jpg', '2025-04-02 14:24:16'),
(7, 'Mercedes-AMG E63 S', 'Mercedes-Benz', 'E-Class', 2022, 129999.00, 10402, 'e63.jpg', '2025-04-02 14:24:16'),
(8, 'Porsche Cayenne GTS', 'Porsche', 'Cayenne', 2023, 123450.00, 4700, 'cayenne.jpg', '2025-04-02 14:24:16'),
(9, 'Volkswagen Golf R', 'Volkswagen', 'Golf', 2023, 49999.00, 2090, 'golfr.jpg', '2025-04-02 14:24:16'),
(10, 'BMW i4 M50', 'BMW', 'i4', 2023, 78500.00, 3100, 'i4.jpg', '2025-04-02 14:24:16'),
(11, 'Audi RS5 Coupe', 'Audi', 'RS5', 2019, 66999.00, 31500, 'rs5.jpg', '2025-04-02 14:24:16'),
(12, 'Mercedes-Benz C43 AMG', 'Mercedes-Benz', 'C-Class', 2020, 58400.00, 24300, 'c43.jpg', '2025-04-02 14:24:16'),
(13, 'Porsche Panamera 4', 'Porsche', 'Panamera', 2018, 76000.00, 42100, 'panamera.jpg', '2025-04-02 14:24:16'),
(14, 'BMW M2 Competition', 'BMW', 'M2', 2019, 59999.00, 29750, 'm2.jpg', '2025-04-02 14:24:16'),
(15, 'Volkswagen Tiguan R-Line', 'Volkswagen', 'Tiguan', 2020, 34500.00, 36700, 'tiguan.jpg', '2025-04-02 14:24:16'),
(16, 'Audi S5 Sportback', 'Audi', 'S5', 2018, 43900.00, 52300, 's5.jpg', '2025-04-02 14:24:16'),
(17, 'Mercedes-Benz CLS550 4MATIC', 'Mercedes-Benz', 'C-Class', 2016, 38999.00, 61500, 'cls550.jpg', '2025-04-02 14:24:16'),
(18, 'Porsche Boxster S', 'Porsche', 'Boxster', 2015, 51000.00, 45200, 'boxster.jpg', '2025-04-02 14:24:16'),
(19, 'Volkswagen Golf GTI MK7', 'Volkswagen', 'GTI', 2017, 24500.00, 58000, 'mk7gti.jpg', '2025-04-02 14:24:16'),
(20, 'Audi RS4 Avant', 'Audi', 'RS4', 2014, 32000.00, 78300, 'rs4.jpg', '2025-04-02 14:24:16'),
(21, 'Mercedes-Benz GLC300 4MATIC', 'Mercedes-Benz', 'G-Class', 2018, 36750.00, 64400, 'glc300.jpg', '2025-04-02 14:24:16'),
(22, 'BMW X5 M', 'BMW', 'X5 M', 2016, 49900.00, 71000, 'x5m.jpg', '2025-04-02 14:24:16'),
(23, 'Audi A7 3.0T Quattro', 'Audi', 'A7', 2015, 35750.00, 67800, 'a7.jpg', '2025-04-02 14:24:16'),
(24, 'Porsche Cayman S (981)', 'Porsche', 'Cayman', 2014, 58800.00, 50600, 'cayman.jpg', '2025-04-02 14:24:16'),
(25, 'Volkswagen Passat R-Line', 'Volkswagen', 'Passat', 2017, 22000.00, 72300, 'passat.jpg', '2025-04-02 14:24:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
