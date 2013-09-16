<?php

//var_dump(class_exists('Mongo'));
//connect to mongo db
$m = new Mongo("mongodb://hoochhound:hoochhound@staff.mongohq.com:10000/hoochhound-stage");

// Configuration
$dbhost = 'localhost';
$dbname = 'hoochhound-stage';

$db = $m->$dbname;
?>
