<?php
class Browse
{
	//send childs data
	function post($request_data=NULL) 
	{
		/*decode jason object values into array*/
		$json = file_get_contents('php://input');
		$obj = json_decode($json, true);
		//print_r ($obj);
          
		
		include_once '../includes/config.php';
		// Get the users collection
		$c_users = $db->products;  //products table
		
		$c_reviews = $db->reviews; //reviews table
		

		/*get data from the jason decoded array*/	
		if(is_array($obj))
		{
			foreach($obj as $pro)
			{
                                // primary category
				$tag = $pro['tags']; // tags
				//$name = $pro['name']; //name
				
				
				$foodType = $pro['foodType'];
                               // $foodType = intval($foodTypes);
				
				
				$primary_category = $pro['primary']; // primary category
				$secondary_category = $pro['secondary_category']; //secondary category
                                $third_category = $pro['third_category']; //third category
                                $fourth_category = $pro['fourth_category']; //third category
				
				
				
				if($foodType){
                                
                                //       $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "foodType" => "$foodType"/*"foodid" => new MongoRegex("/$foodType/")*/));
                               
                                if($primary_category == 'all'){
                                $cursor = $c_users->find(array("foodType" => "$foodType", "status" => "TRUE"));
                                } else if($primary_category != 'all' && $secondary_category == 'all') { 
                                $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "foodType" => "$foodType", "status" => "TRUE"));
                                }
                                else if($primary_category != 'all' && $secondary_category != 'all' && $third_category == 'all') { 
                                $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "foodType" => "$foodType", "status" => "TRUE"));
                                } else if($primary_category != 'all' && $secondary_category != 'all' && $third_category != 'all' && $fourth_category == 'all') { 
                                 $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "thirdCategory" => "$third_category", "foodType" => "$foodType", "status" => "TRUE"));
                                } else {
                                $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "thirdCategory" => "$third_category", "fourthCategory" => "$fourth_category", "foodType" => "$foodType", "status" => "TRUE"));
                                } 	
						
					
				}else{
                                                              
                                 if($primary_category == 'all'){
                                  $searchQuery = array("status" => "true"); 
                                  $cursor = $c_users->find($searchQuery);    
                                  } else if($primary_category != 'all' && $secondary_category == 'all') { 
                                 $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "status" => "TRUE"));
                                 } else if($primary_category != 'all' && $secondary_category != 'all' && $third_category == 'all') { 
                                 $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "status" => "TRUE"));
                                 } else if($primary_category != 'all' && $secondary_category != 'all' && $third_category != 'all' && $fourth_category == 'all') { 
                                 $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "thirdCategory" => "$third_category", "status" => "TRUE"));
                                 } else { 
                                 $cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category", "thirdCategory" => "$third_category", "fourthCategory" => "$fourth_category", "status" => "TRUE"));
					
				}
                                }
			
			
			
			}
			
				$posts = array();
				foreach ($cursor as $id => $value) {
                              //  var_dump($value);
				 $re = array();
				
					$reviews = $c_reviews->find(array("product" => $id));
				
					$count = $c_reviews->find(array("product" => "$id"))->count();
				
					$score =0;
					foreach ($reviews as $review_id => $review_value) {
				
					$score += $review_value['score'];
					$re[] = $review_value;
				}
				
			if($count != 0){
				
			$avg = $score / $count; 
				
			} else {
                            $avg = 0;
                        }
				
			//echo( $value );
			$posts[] = array('posts'=>$value,'reviews'=>$re,'avg'=>$avg);
				
		}

		header('Content-type: application/json');
		$j= json_encode(array('posts'=>$posts));
				
		echo $j;
				
		}
	}//end of child
}//end of Login class
?>