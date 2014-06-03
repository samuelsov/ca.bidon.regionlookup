alter table civicrm_regionlookup drop primary key postcode;
alter table civicrm_regionlookup add column  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique Contact ID' primary key first;
alter table civicrm_regionlookup add KEY `index_postcode` (`postcode`);
