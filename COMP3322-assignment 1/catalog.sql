-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: sophia
-- Generation Time: Mar 22, 2019 at 10:57 AM
-- Server version: 5.7.25-0ubuntu0.18.04.2
-- PHP Version: 7.2.15-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qyhu`
--

-- --------------------------------------------------------

--
-- Table structure for table `catalog`
--

CREATE TABLE `catalog` (
  `itemID` int(11) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `itemDescription` longtext NOT NULL,
  `itemCategory` varchar(255) NOT NULL,
  `itemImage` varchar(255) NOT NULL,
  `itemPrice` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `catalog`
--

INSERT INTO `catalog` (`itemID`, `itemName`, `itemDescription`, `itemCategory`, `itemImage`, `itemPrice`) VALUES
(1, 'Steve Madden Men\'s Preston Oxford', 'With lace-up closure and burnished cap toe rock, the preston to complete your most debonair looks.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_1.jpg', 39.99),
(2, 'Clarks Men\'s Tilden Cap Oxford Shoe', 'Featuring a wide range of top-quality components, Clarks gives you the options you desire in the quality you demand.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_2.jpg', 47.32),
(3, 'Clarks Men\'s Tilden Walk Oxford', 'Its supportive steel shank provides lasting comfort and stability.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_3.jpg', 56.24),
(4, 'CLARKS Men\'s Tilden Style Monk-Strap Loafer', 'This classic silhouette features a single monk strap buckle atop premium leather uppers..', 'Men\'s shoes', '../images/mens_shoes/item_shoes_4.jpg', 42.38),
(5, 'Steve Madden Men\'s Tabloid Oxford', 'Featuring a leather upper, lace-up closure and lightly burnished toe.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_5.jpg', 44.99),
(6, 'Dockers Men\'s Endow Leather Dress Oxford Shoe', 'These are ideal for the work day and can be worn with any dress slacks for an updated stylish appearance.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_6.jpg', 35.99),
(7, 'Steve Madden Men\'s Jagwar', '100% Leather, imported, synthetic solehand finished upper.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_7.jpg', 48.99),
(8, 'Stacy Adams Men\'s Dickinson Cap-Toe Lace-up Oxford', 'Flexible contrasting outsole with stitch detailing on low stacked heel.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_8.jpg', 44.99),
(9, 'Florsheim Men\'s Tux Cap Toe Tuxedo Formal Oxford', 'genuine patent leather uppers, and leather linings with a leather covered footbed offers comfort and breathability.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_9.jpg', 83.95),
(10, 'Calvin Klein Men\'s Bram Oxford', 'Classic and versatile, this dress shoe is made with textured nappa leather, a lace-up closure, contrast topstitching and a rounded square cap toe.', 'Men\'s shoes', '../images/mens_shoes/item_shoes_10.jpg', 63.97),
(11, 'Daily Ritual Women\'s Jersey Short-Sleeve V-Neck T-Shirt Dress', 'This essential t-shirt dress features a V-neck and a relaxed fit for an effortless look that\'s ready to style.', 'Women\'s dress', '../images/womensdress/item_dress_1.jpg', 18.99),
(12, 'Longwu Women\'s Loose Casual Front Tie Long Sleeve Bandage Party Dress', 'Made from high quality 85% Polyester,the texture of the material is super soft.', 'Women\'s dress', '../images/womensdress/item_dress_2.jpg', 21.99),
(13, 'Daily Ritual Women\'s Terry Cotton and Modal Roll-Sleeve Sweatshirt Dress', 'This essential sweatshirt dress features rolled sleeves and relaxed fit for an effortless look that\'s ready to style.', 'Women\'s dress', '../images/womensdress/item_dress_3.jpg', 30.99),
(14, 'Women\'s Alicia Plunging Mix Media Sleeveless Fit and Flare Midi Dress', '95% Polyester, 5% Spandex, Zipper closure', 'Women\'s dress', '../images/womensdress/item_dress_4.jpg', 198.99),
(15, 'Daily Ritual Women\'s Jersey Crewneck Muscle Sleeve Maxi Dress with Side Slit', 'A high round neckline tops this sleeveless maxi-length dress with high side slits at the lower leg', 'Women\'s dress', '../images/womensdress/item_dress_5.jpg', 24.99),
(16, 'MSK Women\'s Plus Size Day to Evening Bell Sleeve Dress with Trim Details', 'Day to evening bell sleeve dress featuring a rhinestone trim details', 'Women\'s dress', '../images/womensdress/item_dress_6.jpg', 30.02),
(17, 'Lark & Ro Women\'s Half Sleeve Twist Front Fit and Flare Dress', 'This fresh take on the little black dress features a lovely neckline and cross-shirring twist at bodice', 'Women\'s dress', '../images/womensdress/item_dress_7.jpg', 49.05),
(18, 'Ella Moon Women\'s Standard Flounce Shoulder Wrap Ruffle Dress', 'Ella Moon\'s collection of feminine bohemian clothing speaks to hopeless romantics and globe trotters alike.', 'Women\'s dress', '../images/womensdress/item_dress_8.jpg', 9.83),
(19, 'Isaac Liev Short Sleeve Maxi Dress', 'Perfect for pairing with pumps, sandals and boots. Ideal for beach, work, party, picnic wear.', 'Women\'s dress', '../images/womensdress/item_dress_9.jpg', 7.97),
(20, 'Short-Sleeve Boxy Pocket T-Shirt Dress', 'Supersoft Terry offers incredible comfort with rich rayon fibers and a gently brushed back', 'Women\'s dress', '../images/womensdress/item_dress_10.jpg', 30.99),
(21, 'OPTIMUM NUTRITION Opti-Men', 'High-Potency Multivitamin for Active Men, 75+ Ingredients in 4 Performance Blends.', 'Vitamins Supplements', '../images/vs/item_vs_1.jpg', 22.79),
(22, 'One A Day Men\'s Health Formula Multivitamin, 200 Count', 'Contains key nutrients like Vitamins A, B6, C, D, E, and K, Riboflavin, Thiamin, and Niacin.', 'Vitamins Supplements', '../images/vs/item_vs_2.jpg', 13.22),
(23, 'Move Free Glucosamine and Chondroitin Joint Health Supplement Tablets', 'Supports 5 signs of joint health: Mobility, Flexibility, Strength, Lubrication, and Comfort.', 'Vitamins Supplements', '../images/vs/item_vs_3.jpg', 19.93),
(24, 'Jarrow Formulas Methylcobalamin (Methyl B12)', 'Natural Cherry-Flavored Chewable Vitamin B12.', 'Vitamins Supplements', '../images/vs/item_vs_4.jpg', 11.09),
(25, 'OPTIMUM NUTRITION Micronized Creatine Monohydrate Powder, Unflavored, 600g', 'Increases muscle strength and power.', 'Vitamins Supplements', '../images/vs/item_vs_5.jpg', 13.45),
(26, 'Nature\'s Way Charcoal Activated; 560 mg Charcoal per serving; 100 Capsules', 'Nature\'s Way Activated Charcoal; 560 mg Charcoal per serving; 100 Capsules.', 'Vitamins Supplements', '../images/vs/item_vs_6.jpg', 8.99),
(27, 'PreserVision AREDS 2 Vitamin & Mineral Supplement 120 Count Soft Gels', 'The exact nutrient formula recommended by the National Eye Institute which includes lutein and zeaxanthin.', 'Vitamins Supplements', '../images/vs/item_vs_7.jpg', 21.75),
(28, 'Nature Made Prenatal + DHA 200 mg Softgels', 'Clinically Proven Absorption', 'Vitamins Supplements', '../images/vs/item_vs_8.jpg', 13.98),
(29, 'Nature\'s Way Sambucus Elderberry Gummies', 'Herbal Supplements with Vitamin C and Zinc, Gluten Free, Vegetarian, 60 Gummies (Packaging May Vary).', 'Vitamins Supplements', '../images/vs/item_vs_9.jpg', 11.81),
(30, 'Emergen-C (60 Count, Super Orange Flavor, 2 Month Supply)', 'Includes 60 individual serving-size packets (0.32 oz. each) of Emergen-C Super Orange flavor fizzy drink mix.', 'Vitamins Supplements', '../images/vs/item_vs_10.jpg', 16.12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `catalog`
--
ALTER TABLE `catalog`
  ADD PRIMARY KEY (`itemID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
