/*Annex types*/
INSERT INTO `annextypes` (`id`, `name`, `amount`, `estructure`, `createdAt`, `updatedAt`) 
VALUES ('1', 'Anexo de $20', '20', 'r,r,r,r,r;p,s', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `annextypes` (`id`, `name`, `amount`, `estructure`, `createdAt`, `updatedAt`) 
VALUES ('2', 'Anexo de $100', '100', 'r,r,r;p,s;r,r', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `annextypes` (`id`, `name`, `amount`, `estructure`, `createdAt`, `updatedAt`) 
VALUES ('3', 'Anexo de $500', '500', 'r,r,r;p,s;r,r', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `annextypes` (`id`, `name`, `amount`, `estructure`, `createdAt`, `updatedAt`) 
VALUES ('4', 'Anexo de $1000', '1000', 'r,r,r;p,s;r,r', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
/*Memberships types*/
INSERT INTO `membershiptypes` (`name`, `annexTypeId`, `suscriptionAmount`, `createdAt`, `updatedAt`)
VALUES ('$20', '1', '20', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `membershiptypes` (`name`, `annexTypeId`, `suscriptionAmount`, `createdAt`, `updatedAt`) 
VALUES ('$100', '2', '100', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `membershiptypes` (`name`, `annexTypeId`, `suscriptionAmount`, `createdAt`, `updatedAt`) 
VALUES ('$500', '3', '500', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `membershiptypes` (`name`, `annexTypeId`, `suscriptionAmount`, `createdAt`, `updatedAt`) 
VALUES ('$1000', '4', '1000', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
/*Users*/
INSERT INTO `users` (`id`,`name`,`lastname`,`identification`, `email`, `username`, `permissions`, `createdAt`, `updatedAt`, `countryId`) 
VALUES ('1','admin','','M@n02019', 'admin@proyectomano.com', 'admin', 'superadmin', '2019-03-24 04:40:29', '2019-03-24 04:40:29', '47');
INSERT INTO `users` (`id`,`name`,`lastname`,`identification`, `email`, `username`, `permissions`, `createdAt`, `updatedAt`,`countryId`) 
VALUES ('2','manoapp','','M@n02019', 'proyectomano@gmail.com', 'manoapp', 'admin', '2019-03-24 04:40:29', '2019-03-24 04:40:29', '47');
/*Memberships*/
INSERT INTO `memberships` (`status`, `ownerId`, `membershipTypeId`, `createdAt`, `updatedAt`)
VALUES ('receiver', '2', '1', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `memberships` (`status`, `ownerId`, `membershipTypeId`, `createdAt`, `updatedAt`)
VALUES ('receiver', '2', '2', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `memberships` (`status`, `ownerId`, `membershipTypeId`, `createdAt`, `updatedAt`)
VALUES ('receiver', '2', '3', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
INSERT INTO `memberships` (`status`, `ownerId`, `membershipTypeId`, `createdAt`, `updatedAt`)
VALUES ('receiver', '2', '4', '2019-03-24 04:40:29', '2019-03-24 04:40:29');
