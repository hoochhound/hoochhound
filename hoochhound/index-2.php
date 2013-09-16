<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);
include_once 'includes/config.php';

//Get the users collection
$c_users = $db->productCategories;




$cursor = $c_users->find();

foreach ($cursor as $id => $value) {
	
	$primary_key =  $value['primaryCategory'];
	

	
	//$cursor2 = $c_users->find(array('primaryCategory' => '$primary_key '), array('secondaryCategories' => 1));
	
	$cursor2 = $c_users->find(array("primaryCategory" => "$primary_key"));

	
	$secondary_arr = array();
	foreach ($cursor2 as $id => $value) {
		
		
		$secondary_arr[] = $value['secondaryCategories'];
		
	}
	
	$posts[] = array('primary_cat'=>$primary_key,'secondary_cat'=>$secondary_arr);
	
}


header('Content-type: application/json');
$j= json_encode(array('posts'=>$posts));
print_r($j);
?>