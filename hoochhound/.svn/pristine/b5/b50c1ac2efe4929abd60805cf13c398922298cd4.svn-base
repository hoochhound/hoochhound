<?php
class Scan
{
	//send childs data
	function post($request_data=NULL) 
	{
		/*decode jason object values into array*/
		$json = file_get_contents('php://input');
		$obj = json_decode($json, true);
		//print_r  $obj;
		
		include_once '../includes/config.php';
		// Get the users collection

		$c_users = $db->products; //products
		$c_reviews = $db->reviews; //reviews
		
		/*get data from the jason decoded array*/	
		if(is_array($obj))
		{
			foreach($obj as $pro)
			{
				$barcode_id = 904409; //barcode id	
				$barcode_id2 =$pro['barcodeId'];
				
				
				  
                                
 $cursor = $c_users->find(array('upc' => new MongoRegex("/$barcode_id2/")/*, "status" => "true"*/));   

				
				
			
			}
			
			$posts = array();
			foreach ($cursor as $id => $value) {
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