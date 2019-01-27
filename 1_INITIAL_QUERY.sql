-- Copy semua QUERY di file ini (Ctrl+a > Ctrl+c),
-- Paste di MySQL Workbench. Lalu block semua (Ctrl+a). 
-- Kemudian Execute Query dengan menekan icon "PETIR" sebelah icon "SAVE"

CREATE DATABASE IF NOT EXISTS `tokobuku`;

USE `tokobuku`;

-- ======================== BUKU ==========================

-- ====== (1.) CREATE TABLE "BUKU"

CREATE TABLE IF NOT EXISTS `buku` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `no_isbn` VARCHAR(45) NOT NULL,
  `judul` VARCHAR(45) NOT NULL,
  `penulis` VARCHAR(45) NOT NULL,
  `penerbit` VARCHAR(45) NOT NULL,
  `jumlah_halaman` INT NOT NULL,
  `harga` INT NOT NULL,
  `deskripsi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

-- DROP TABLE IF EXISTS `tokobuku`.`buku`;

-- TRUNCATE `tokobuku`.`buku`;

-- ============ (1.1) INSERT beberapa data ke BUKU ===================
INSERT INTO `buku` VALUES
(null, '9786020285962', 'Naruto 01', 'Masashi Kishimoto', 'Elex Media Komputindo', 208, 25000, 'Kisah mengharukan menjadi Ninja sejati'),
(null, '9786020488424', 'One Piece 01', 'Eiichiro Oda', 'Elex Media Komputindo', 220, 35000, 'Petualangan Bajak laut keliling dunia'),
(null, '9789793027951', 'FISIKA TERAPAN SMART', 'Abdullah Sani', 'Mizan Publishing', 180, 35000, 'Buku ini membahas tentang aplikasi fisika dalam teknlogi dan kehidupan sehari-hari'),
(null, '9786024261061', 'The Naked Traveler 8', 'Trinity', 'B-First', 256, 84000, 'Rekaman perjalanan Trinity menggenapi kunjungan ke-88 negara di dunia'),
(null, '9789797945251', 'Garis Waktu', 'Fiersa Besari', 'MediaKita', 216, 46000, 'Sebuah Perjalanan Menghapus Luka (NON TTD)'),
(null, '9786020332444', 'Aku Ini Binatang Jalang', 'Chairil Anwar', 'Gramedia Pustaka Utama', 160, 51000, 'Kumpulan puisi terlengkap karya penyair terbesar Indonesia Chairil Anwar'),
(null, '9786022912743', 'Pacar Seorang Seniman', 'W.S Rendra', 'Bentang Pustaka', 196, 41000, 'Di dalam buku ini terangkum 13 cerpen pilihan, di dalamnya kita dapat menemukan keunikan bakat muda Rendra'),
(null, '9789796054541', 'Nusa Jawa Silang Budaya', 'Denys Lombart', 'Gramedia Pustaka Utama', 378, 97000, 'Buku Nusa Jawa: Silang Budaya merangkul keseluruhan sejarah Pulau Jawa menganalisis unsur-unsur kebudayaannya'),
(null, '617203023', 'Rich Dads Cashflow Quadrant', 'Robert T. Kiyosaki', 'Gramedia Pustaka Utama', 354, 66000, 'CASHFLOW QUADRANT mengungkap bagaimana sejumlah orang bekerja lebih sedikit, menghasilkan lebih banyak uang, membayar pajak lebih rendah, dan belajar menjadi orang yang memiliki kebebasan keuangan'),
(null, '9786020484655', 'Mindsets for Success', 'Awang Surya', 'Elex Media Komputindo', 194, 46000, 'Buku ini hadir untuk membuat Anda mengenal penyebab kegagalan dan memahami cara meminimalisir kesalahan yang diperbuat'),
(null, '9786020823331', 'Mikrotik Kung Fu', 'Rendra Towidjojo', 'Jasakom', 216, 74000, 'Buku ini dapat digunakan untuk pemula Router MikroTik dan untuk Anda yang sudah sering menggunakan Router MikroTik'),
(null, '9786020478722', 'Database Systems All in One', 'Indrajani, S.kom., Mm', 'Elex Media Komputindo', 344, 67000, 'Database Systems All in One Theory, Practice, and Case Study ')
;

-- SELECT * FROM  `buku`;

-- DESC `tokobuku`.`buku`;

-- ===================== KATEGORI =========================

-- ==================== (2.) CREATE TABLE "KATEGORI" ==================
CREATE TABLE `kategori` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

-- ===================== (2.1) INSERT beberapa KATEGORI ===============
INSERT INTO `kategori` VALUES
(null,'Komik'),
(null,'Fiksi'),
(null,'Sastra & Filsafat'),
(null,'Sains & Teknologi'),
(null,'Sejarah & Budaya'),
(null,'Psikologi & Pengembangan Diri'),
(null,'Komputer & Internet');

-- SELECT * FROM `kategori`;



-- =============== JOIN BUKU <> KATEGORI ==================

-- DROP TABLE IF EXISTS `tokobuku`.`join_buku_kategori`;

-- ==================== (3.) CREATE TABLE untuk relasi BUKU <> KATEGORI ==========
CREATE TABLE IF NOT EXISTS `join_buku_kategori` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_buku` INT NOT NULL,
  `id_kategori` INT NOT NULL,
  PRIMARY KEY(`id`));
  
-- DESC `join_buku_kategori`;
-- TRUNCATE `join_buku_kategori`;

-- ================= (3.1) INSERT BEBERAPA data ==================================
INSERT INTO `join_buku_kategori` VALUES 
(null,1,1),
(null,1,2),
(null,2,1),
(null,2,2),
(null,3,4),
(null,4,2),
(null,5,2),
(null,6,3),
(null,6,5),
(null,7,3),
(null,7,5),
(null,8,5),
(null,9,6),
(null,10,6),
(null,11,4),
(null,11,7),
(null,12,4),
(null,12,7) ;
