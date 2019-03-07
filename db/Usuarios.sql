INSERT INTO `manoapp`.`users` (`name`,`lastname`,`identification`, `email`, `username`, `permissions`, `createdAt`, `updatedAt`, `countryId`) VALUES ('admin','','', 'admin@proyectomano.com', 'admin', 'superadmin', '2019-02-13 04:40:29', '2019-02-13 04:40:29', '47');
INSERT INTO `manoapp`.`users` (`name`,`lastname`,`identification`, `email`, `username`, `permissions`, `createdAt`, `updatedAt`,`parentId`,`countryId`) VALUES ('manoapp','','', 'proyectomano@gmail.com', 'manoapp', 'admin', '2019-02-13 04:40:29', '2019-02-13 04:40:29', '1', '47');
INSERT INTO `manoapp`.`annextypes` (`id`, `name`, `amount`, `estructure`, `createdAt`, `updatedAt`) VALUES ('1', 'Anexo de 20$', '20', 'rrrrr,p,s', '2019-02-13 04:40:29', '2019-02-13 04:40:29');
INSERT INTO `test`.`membershiptypes` (`name`, `annexTypeId`, `suscriptionAmmount`, `createdAt`, `updatedAt`) VALUES ('20$', '1', '20', '2019-02-13 04:40:29', '2019-02-13 04:40:29');

