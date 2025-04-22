-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2025 at 08:53 PM
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
-- Database: `fastfahr`
--

-- --------------------------------------------------------

--
-- Table structure for table `post_images`
--

CREATE TABLE `post_images` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_images`
--

INSERT INTO `post_images` (`id`, `post_id`, `image_path`, `is_main`) VALUES
(1, 1, '/uploads/m5.jpg', 1),
(2, 2, '/uploads/rs7.jpg', 1),
(3, 3, '/uploads/c63.jpg', 1),
(4, 4, '/uploads/turbos.jpg', 1),
(5, 5, '/uploads/m4.jpeg', 1),
(6, 6, '/uploads/a3.jpg', 1),
(7, 7, '/uploads/e63.jpg', 1),
(8, 8, '/uploads/cayenne.jpg', 1),
(9, 9, '/uploads/golfr.jpg', 1),
(10, 10, '/uploads/i4.jpg', 1),
(11, 11, '/uploads/rs5.jpg', 1),
(12, 12, '/uploads/c43.jpg', 1),
(13, 13, '/uploads/panamera.jpg', 1),
(14, 14, '/uploads/m2.jpg', 1),
(15, 15, '/uploads/tiguan.jpg', 1),
(16, 16, '/uploads/s5.jpg', 1),
(17, 17, '/uploads/cls550.jpg', 1),
(18, 18, '/uploads/boxster.jpg', 1),
(19, 19, '/uploads/mk7gti.jpg', 1),
(20, 20, '/uploads/rs4.jpg', 1),
(21, 21, '/uploads/glc300.jpg', 1),
(22, 22, '/uploads/x5m.jpg', 1),
(23, 23, '/uploads/a7.jpg', 1),
(24, 24, '/uploads/cayman.jpg', 1),
(25, 25, '/uploads/passat.jpg', 1),
(47, 26, '/uploads/img_6803f27ad4a202.50761189_maybach1.jpg', 1),
(49, 28, '/uploads/img_6807c94b5fe5f2.54388881_porsche7.jpg', 1),
(50, 28, '/uploads/img_6807c94b609d42.69321011_porsche6.jpg', 0),
(51, 28, '/uploads/img_6807c94b613604.39484290_porsche5.jpg', 0),
(52, 28, '/uploads/img_6807c94b61c2d7.41780942_porsche4.jpg', 0),
(53, 28, '/uploads/img_6807c94b624200.33143626_porsche3.jpg', 0),
(54, 28, '/uploads/img_6807c94b62bbc8.82428400_porsche2.jpg', 0),
(55, 28, '/uploads/img_6807c94b6374f3.23635717_posrche1.jpg', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `post_images`
--
ALTER TABLE `post_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `post_images`
--
ALTER TABLE `post_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `post_images`
--
ALTER TABLE `post_images`
  ADD CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
