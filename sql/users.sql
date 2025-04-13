-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 01, 2025 at 10:44 PM
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
-- Database: `alamy1_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `created_at`, `profile_picture`) VALUES
(1, 'sampleuser', 'sampleuser@gmail.com', '$2y$10$DZmaFY75hyDpl9gxM1QwjuMNAEInPXwZhQjET38FJScH3HuasdbYG', '2025-04-01 07:46:02', NULL),
(2, 'AliceWonder', 'alice@example.com', '$2y$10$DZmaFY75hyDpl9gxM1QwjuMNAEInPXwZhQjET38FJScH3HuasdbYG', '2025-04-01 13:49:31', 'https://i.pravatar.cc/150?img=1'),
(3, 'BobBuilder', 'bob@example.com', '$2y$10$DZmaFY75hyDpl9gxM1QwjuMNAEInPXwZhQjET38FJScH3HuasdbYG', '2025-04-01 13:49:31', 'https://i.pravatar.cc/150?img=3'),
(4, 'CharlieChap', 'charlie@example.com', '$2y$10$DZmaFY75hyDpl9gxM1QwjuMNAEInPXwZhQjET38FJScH3HuasdbYG', '2025-04-01 13:49:31', 'https://i.pravatar.cc/150?img=5'),
(5, 'DianaPrince', 'diana@example.com', '$2y$10$DZmaFY75hyDpl9gxM1QwjuMNAEInPXwZhQjET38FJScH3HuasdbYG', '2025-04-01 13:49:31', 'https://i.pravatar.cc/150?img=8'),
(6, 'TestUser', 'test@example.com', '$2y$10$DZmaFY75hyDpl9gxM1QwjuMNAEInPXwZhQjET38FJScH3HuasdbYG', '2025-04-01 13:49:31', 'https://i.pravatar.cc/150?u=a042581f4e29026704d'),
(7, 'peely', 'banana@gmail.com', '$2y$10$MzGbwE8dCqPUIqj2S5iUT.u2VjKJb6Nbjo.lswa0QEaMvA.aXNXkW', '2025-04-01 09:29:53', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
