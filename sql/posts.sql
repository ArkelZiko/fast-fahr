-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 19, 2025 at 06:20 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zikoa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `make` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `transmission` varchar(50) DEFAULT NULL,
  `fuelType` varchar(50) DEFAULT NULL,
  `driveType` varchar(50) DEFAULT NULL,
  `bodyType` varchar(50) DEFAULT NULL,
  `exteriorColor` varchar(50) DEFAULT NULL,
  `province` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `title`, `make`, `model`, `year`, `price`, `mileage`, `created_at`, `description`, `transmission`, `fuelType`, `driveType`, `bodyType`, `exteriorColor`, `province`, `city`) VALUES
(1, 1, 'BMW M5', 'BMW', 'M5', 2023, 114999.00, 5201, '2025-04-02 14:24:16', 'High-performance sports sedan with aggressive styling and advanced tech.', 'Automatic', 'Gasoline', 'AWD', 'Sedan', 'Black', 'ON', 'Toronto'),
(2, 1, 'Audi RS7', 'Audi', 'RS7', 2023, 122999.00, 3821, '2025-04-02 14:24:16', 'Luxury sportback with a twin-turbo V8, quattro all-wheel drive, and sleek lines.', 'Automatic', 'Gasoline', 'AWD', 'Hatchback', 'Grey', 'BC', 'Vancouver'),
(3, 3, 'Mercedes-AMG C63', 'Mercedes-Benz', 'C-Class', 2022, 94999.00, 8243, '2025-04-02 14:24:16', 'German muscle meets refinement in this turbocharged AMG coupe.', 'Automatic', 'Gasoline', 'RWD', 'Coupe', 'White', 'QC', 'Montreal'),
(4, 1, 'Porsche 911 Turbo S', 'Porsche', '911', 2021, 189999.00, 2251, '2025-04-02 14:24:16', 'Legendary Porsche performance in a turbocharged flat-six rear-engine package.', 'Automatic', 'Gasoline', 'AWD', 'Coupe', 'Red', 'AB', 'Calgary'),
(5, 1, 'BMW M4 Competition', 'BMW', 'M4', 2022, 104499.00, 6910, '2025-04-02 14:24:16', 'M TwinPower Turbo inline-6 in a striking two-door performance coupe.', 'Manual', 'Gasoline', 'RWD', 'Coupe', 'Blue', 'ON', 'Mississauga'),
(6, 1, 'Audi A3', 'Audi', 'A3', 2021, 38999.00, 17850, '2025-04-02 14:24:16', 'Compact luxury sedan with clean Audi design and premium cabin.', 'Automatic', 'Gasoline', 'FWD', 'Sedan', 'Silver', 'MB', 'Winnipeg'),
(7, 1, 'Mercedes-AMG E63 S', 'Mercedes-Benz', 'E-Class', 2022, 129999.00, 10402, '2025-04-02 14:24:16', 'High-powered executive sedan with handcrafted AMG engine and luxury interior.', 'Automatic', 'Gasoline', 'AWD', 'Sedan', 'Black', 'ON', 'Ottawa'),
(8, 1, 'Porsche Cayenne GTS', 'Porsche', 'Cayenne', 2023, 123450.00, 4700, '2025-04-02 14:24:16', 'Luxury SUV with sport-tuned suspension and a roaring V8 engine.', 'Automatic', 'Gasoline', 'AWD', 'SUV', 'Green', 'AB', 'Edmonton'),
(9, 1, 'Volkswagen Golf R', 'Volkswagen', 'Golf', 2023, 49999.00, 2090, '2025-04-02 14:24:16', 'Turbocharged hot hatch with all-wheel drive and precision handling.', 'Manual', 'Gasoline', 'AWD', 'Hatchback', 'White', 'BC', 'Kelowna'),
(10, 1, 'BMW i4 M50', 'BMW', 'i4', 2023, 78500.00, 3100, '2025-04-02 14:24:16', 'All-electric Gran Coupe with dual motors and M performance DNA.', 'Automatic', 'Electric', 'AWD', 'Sedan', 'Blue', 'QC', 'Quebec City'),
(11, 1, 'Audi RS5 Coupe', 'Audi', 'RS5', 2019, 66999.00, 31500, '2025-04-02 14:24:16', 'Aggressive coupe with turbocharged V6, quattro drive, and sport diff.', 'Automatic', 'Gasoline', 'AWD', 'Coupe', 'Red', 'SK', 'Regina'),
(12, 1, 'Mercedes-Benz C43 AMG', 'Mercedes-Benz', 'C-Class', 2020, 58400.00, 24300, '2025-04-02 14:24:16', 'Sporty compact with AMG tuning and distinctive twin-tailpipe exhaust.', 'Automatic', 'Gasoline', 'AWD', 'Sedan', 'Black', 'NB', 'Moncton'),
(13, 1, 'Porsche Panamera 4', 'Porsche', 'Panamera', 2018, 76000.00, 42100, '2025-04-02 14:24:16', 'Luxury sport sedan with executive seating and strong V6 performance.', 'Automatic', 'Gasoline', 'AWD', 'Sedan', 'Grey', 'NS', 'Halifax'),
(14, 1, 'BMW M2 Competition', 'BMW', 'M2', 2019, 59999.00, 29750, '2025-04-02 14:24:16', 'Sharp-handling two-door coupe with turbocharged inline-6 and M upgrades.', 'Manual', 'Gasoline', 'RWD', 'Coupe', 'Yellow', 'ON', 'Hamilton'),
(15, 1, 'Volkswagen Tiguan R-Line', 'Volkswagen', 'Tiguan', 2020, 34500.00, 36700, '2025-04-02 14:24:16', 'German crossover SUV with R-Line trim, spacious interior, and FWD.', 'Automatic', 'Gasoline', 'FWD', 'SUV', 'Silver', 'PE', 'Charlottetown'),
(16, 6, 'Audi S5 Sportback', 'Audi', 'S5', 2018, 43900.00, 52300, '2025-04-02 14:24:16', 'Sportback with quattro grip, premium interior, and powerful turbo engine.', 'Automatic', 'Gasoline', 'AWD', 'Hatchback', 'White', 'NL', 'Milton'),
(17, 1, 'Mercedes-Benz CLS550 4MATIC', 'Mercedes-Benz', 'C-Class', 2016, 38999.00, 61500, '2025-04-02 14:24:16', 'Luxury 4-door coupe with V8 power and 4MATIC all-wheel drive.', 'Automatic', 'Gasoline', 'AWD', 'Sedan', 'Burgundy', 'MB', 'Brandon'),
(18, 1, 'Porsche Boxster S', 'Porsche', 'Boxster', 2015, 51000.00, 45200, '2025-04-02 14:24:16', 'Convertible with mid-engine layout and classic roadster styling.', 'Manual', 'Gasoline', 'RWD', 'Convertible', 'Orange', 'ON', 'London'),
(19, 1, 'Volkswagen Golf GTI MK7', 'Volkswagen', 'GTI', 2017, 24500.00, 58000, '2025-04-02 14:24:16', 'MK7 GTI with iconic plaid seats and sharp turbocharged performance.', 'Manual', 'Gasoline', 'FWD', 'Hatchback', 'Black', 'QC', 'Gatineau'),
(20, 1, 'Audi RS4 Avant', 'Audi', 'RS4', 2014, 32000.00, 78300, '2025-04-02 14:24:16', 'Rare RS4 Avant with naturally aspirated V8 and widebody fender flares.', 'Manual', 'Gasoline', 'AWD', 'Wagon', 'Grey', 'AB', 'Red Deer'),
(21, 1, 'Mercedes-Benz GLC300 4MATIC', 'Mercedes-Benz', 'G-Class', 2018, 36750.00, 64400, '2025-04-02 14:24:16', 'Midsize SUV with all-wheel drive, luxury finish, and spacious interior.', 'Automatic', 'Gasoline', 'AWD', 'SUV', 'White', 'SK', 'Saskatoon'),
(22, 1, 'BMW X5 M', 'BMW', 'X5 M', 2016, 49900.00, 71000, '2025-04-02 14:24:16', 'High-performance luxury SUV with twin-turbo V8 and M sport tuning.', 'Automatic', 'Gasoline', 'AWD', 'SUV', 'Black', 'BC', 'Surrey'),
(23, 1, 'Audi A7 3.0T Quattro', 'Audi', 'A7', 2015, 35750.00, 67800, '2025-04-02 14:24:16', 'Executive sportback with sleek lines, quattro handling, and smooth V6.', 'Automatic', 'Gasoline', 'AWD', 'Hatchback', 'Silver', 'NB', 'Fredericton'),
(24, 1, 'Porsche Cayman S (981)', 'Porsche', 'Cayman', 2014, 58800.00, 50600, '2025-04-02 14:24:16', 'Mid-engine coupe with razor-sharp handling and signature Porsche styling.', 'Manual', 'Gasoline', 'RWD', 'Coupe', 'Red', 'NS', 'Sydney'),
(25, 1, 'Volkswagen Passat R-Line', 'Volkswagen', 'Passat', 2017, 22000.00, 72300, '2025-04-02 14:24:16', 'Spacious family sedan with R-Line styling and turbocharged performance.', 'Automatic', 'Gasoline', 'FWD', 'Sedan', 'Blue', 'ON', 'Brampton');
(26, 6, 'Mercedes Maybach', 'Mercedes-Benz', 'S-Class', 2025, 200000.00, 3000, '2025-04-19 14:59:06', 'This is a maybach', 'Automatic', 'Gasoline', 'AWD', 'Sedan', 'White', 'ON', 'Milton'),
(28, 6, 'Porsche 911 Turbo Coupe', 'Porsche', '911', 2015, 100000.00, 20000, '2025-04-22 12:52:27', 'THIS is the porsche 911', 'Manual', 'Gasoline', 'FWD', 'Coupe', 'Silver', 'ON', 'Toronto');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
