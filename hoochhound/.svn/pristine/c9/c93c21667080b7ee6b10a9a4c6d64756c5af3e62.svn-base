<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);
include_once 'includes/config.php';

//Get the users collection
$c_users = $db->products;
$c_reviews = $db->reviews;


//$cursor = $c_users->find(array('packages.productId' => array('$lt' => 904409)));


		//	$barcode_id = 904409; //barcode id	
		//		$barcode_id2 =$pro['barcodeId'];
				
				
	
				
				$cursor = $c_users->find(array('packages.upc' =>(float)9780273630203));

//$query = array('weather.Air.Jan' => 11);
//$cursor = $c_users->find();

//{"categories.name":"hoyts"}




$posts = array();
foreach ($cursor as $value) {
	
	
	$re = array();
	
	$id = $value['_id'];

	$reviews = $c_reviews->find(array("product" => $id));

	$count = $c_reviews->find(array("product" => "$id"))->count();

	$score =0;
	foreach ($reviews as $review_id => $review_value) {

		$score += $review_value['score'];
		$re[] = $review_value;
	}

	if($count>0){

		$avg = $score / $count;

	}

	//echo( $value );
	$posts[] = array('posts'=>$value,'reviews'=>$re,'avg'=>$avg);

}


foreach ($cursor as $value) {
var_dump($value);


}
?>