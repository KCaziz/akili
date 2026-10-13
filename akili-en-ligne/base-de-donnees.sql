-- ============================================================================
-- Akili — Initialisation de la base de données (hébergement cPanel / MySQL)
--
-- À utiliser UNE SEULE FOIS, après avoir créé la base et l'utilisateur MySQL
-- dans cPanel (« MySQL Databases »), en collant tout ce fichier dans
-- phpMyAdmin > [votre base] > onglet SQL > Exécuter.
--
-- Contient : la structure des 6 tables + les données de démonstration
-- (4 services, 6 produits, 6 photos de galerie, 1 compte admin).
--
-- Compte admin créé : identifiant "admin", mot de passe "akili2026"
-- (hash bcrypt ci-dessous généré pour ce mot de passe — À CHANGER après la
-- première connexion, voir DEPLOYMENT.md).
-- ============================================================================

-- --------------------------------------------------------------------------
-- Structure
-- --------------------------------------------------------------------------

CREATE TABLE `admins` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admins_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('VENTE', 'LOCATION') NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `surface` VARCHAR(191) NULL,
    `rooms` INTEGER NULL,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `client_requests` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `type` ENUM('PRODUIT', 'SERVICE') NOT NULL,
    `details` TEXT NOT NULL,
    `status` ENUM('EN_ATTENTE', 'TRAITE') NOT NULL DEFAULT 'EN_ATTENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sell_offers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `propertyType` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `surface` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `status` ENUM('EN_ATTENTE', 'TRAITE') NOT NULL DEFAULT 'EN_ATTENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `gallery_media` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PHOTO', 'VIDEO') NOT NULL,
    `url` TEXT NOT NULL,
    `caption` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Données de démonstration
-- --------------------------------------------------------------------------

INSERT INTO `admins` (`id`, `username`, `passwordHash`, `createdAt`) VALUES
('cmv0y5ppc0000q4f0at383clu', 'admin', '$2b$10$KFKYPmmoCE6KD/x4K3fbkeG2K6iY9uqIDspurV.e3oNh5B4MNbqcK', '2026-10-09 12:33:56.064');

INSERT INTO `services` (`id`, `title`, `description`, `createdAt`, `updatedAt`) VALUES
('cmv0y5pu90001q4f0xa12e0uj', 'Vente & achat', 'Vendez ou achetez en toute sérénité. Nous mettons votre bien en valeur, le diffusons auprès d\'acheteurs qualifiés et vous accompagnons jusqu\'à la signature, avec des conseils clairs à chaque étape.', '2026-10-09 12:33:56.241', '2026-10-09 12:33:56.241'),
('cmv0y5pxa0002q4f0b9ffoiui', 'Location', 'Trouvez rapidement le bon locataire ou le bon logement. Nous sélectionnons des profils sérieux, préparons un contrat conforme et assurons un suivi tout au long de la location.', '2026-10-09 12:33:56.350', '2026-10-09 12:33:56.350'),
('cmv0y5q0c0003q4f09gm7f1jw', 'Estimation gratuite', 'Connaître la juste valeur de votre bien est la première étape d\'un projet réussi. Notre équipe réalise une estimation fiable, basée sur une connaissance fine du marché local.', '2026-10-09 12:33:56.460', '2026-10-09 12:33:56.460'),
('cmv0y5q3e0004q4f0agk30127', 'Accompagnement administratif', 'De la constitution du dossier à la signature finale, nous simplifions les démarches liées à l\'achat, la vente ou la location de votre bien.', '2026-10-09 12:33:56.570', '2026-10-09 12:33:56.570');

INSERT INTO `products` (`id`, `title`, `description`, `type`, `city`, `price`, `surface`, `rooms`, `image`, `createdAt`, `updatedAt`) VALUES
('cmv0y5q6m0005q4f0c434gx4t', 'Villa moderne avec piscine', 'Villa contemporaine de standing, grand jardin, piscine privée et garage double. Quartier calme et résidentiel.', 'VENTE', 'Alger', '18 500 000 DZD', '320 m²', 5, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', '2026-10-09 12:33:56.686', '2026-10-09 12:33:56.686'),
('cmv0y5q9k0006q4f0cw8gk093', 'Appartement F3 centre-ville', 'Appartement lumineux au 3ème étage avec ascenseur, proche commerces et transports.', 'LOCATION', 'Oran', '45 000 DZD / mois', '85 m²', 3, 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=900&q=80', '2026-10-09 12:33:56.792', '2026-10-09 12:33:56.792'),
('cmv0y5qcn0007q4f0ro3exx7u', 'Local commercial', 'Local commercial en rez-de-chaussée, grande vitrine, idéal activité commerciale ou bureau.', 'VENTE', 'Constantine', '9 200 000 DZD', '150 m²', NULL, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80', '2026-10-09 12:33:56.903', '2026-10-09 12:33:56.903'),
('cmv0y5qfp0008q4f0lmh0k1ft', 'Appartement F4 vue mer', 'Bel appartement avec vue dégagée sur la mer, résidence sécurisée avec parking.', 'VENTE', 'Alger', '22 000 000 DZD', '110 m²', 4, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80', '2026-10-09 12:33:57.014', '2026-10-09 12:33:57.014'),
('cmv0y5qio0009q4f08xusub68', 'Studio meublé proche université', 'Studio entièrement meublé et équipé, idéal pour étudiant ou jeune actif.', 'LOCATION', 'Oran', '22 000 DZD / mois', '35 m²', 1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80', '2026-10-09 12:33:57.121', '2026-10-09 12:33:57.121'),
('cmv0y5qlq000aq4f05yyujl85', 'Terrain constructible', 'Terrain plat et viabilisé, titre de propriété en règle, proche axe principal.', 'VENTE', 'Boumerdès', '6 500 000 DZD', '400 m²', NULL, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80', '2026-10-09 12:33:57.230', '2026-10-09 12:33:57.230');

INSERT INTO `gallery_media` (`id`, `type`, `url`, `caption`, `createdAt`) VALUES
('cmv0y5qp3000bq4f0b5xfvd7r', 'PHOTO', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80', 'Nos locaux', '2026-10-09 12:33:57.351'),
('cmv0y5qp3000cq4f05zabre6c', 'PHOTO', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80', 'Espace accueil', '2026-10-09 12:33:57.351'),
('cmv0y5qp3000dq4f05yx1i3ws', 'PHOTO', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 'L\'équipe au travail', '2026-10-09 12:33:57.351'),
('cmv0y5qp3000eq4f0tr8lf2zx', 'PHOTO', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80', 'Salle de réunion', '2026-10-09 12:33:57.351'),
('cmv0y5qp3000fq4f0d5huggqu', 'PHOTO', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80', 'Visite d\'un bien', '2026-10-09 12:33:57.351'),
('cmv0y5qp3000gq4f0cmvha4b7', 'PHOTO', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80', 'Entrée de l\'agence', '2026-10-09 12:33:57.351');
