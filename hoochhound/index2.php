<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);

include_once 'includes/config.php';

	// Get the users collection
	$c_users = $db->products;
	
	$c_reviews = $db->reviews;

	
	$tag = "beer"; // tags

	$cursor = $c_users->find(array("tags" => new MongoRegex("/$tag/")));
	
	
	
			$posts = array();
			foreach ($cursor as $id => $value) {
			 // echo "$id: ";
			  
			
				
				$re = array();
				
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

					
				header('Content-type: application/json');
				$j= json_encode(array('posts'=>$posts));
				
				
				print_r($j);
				

?>