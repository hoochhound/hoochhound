<?php
class Want
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
		$c_users = $db->wantData;
		
		//$c_reviews = $db->reviews;
		

		/*get data from the jason decoded array*/	
		if(is_array($obj))
		{
			foreach($obj as $pro)
			{
			
				$product_id = $pro['product_id']; //product id
				$device_id = $pro['device_id']; //device id
				
				
				$sex = $pro['sex'];
				$age = $pro['age'];
				$country = $pro['country'];
				//$want = $pro['want']; //want, unwant
				
				
				//$like = $pro['favourite']; // like, unlike
				$want = $pro['wantlist'];
				
				//$action = $pro['action']; //like, unlike
				
				if($like == "false")
				{
					//$cursor = $c_users->update(array("deviceId" => "$deviceId","productid" => "$product_id" ), array('$set' => array("favourite" => 0)));
					$sql = $c_users->remove(array("device" => "$device_id","product" => "$product_id"));
				
				
				}else
					if($like == "true" )
				{
						$sql = $c_users->insert(array("device" => $device_id, "age" => "$age", "sex" => "$sex","product"=>"$product_id", "country" => "$country", "favourite"=> "True" ));
				
				}else
				if( $want =="true"){
				
				$sql = $c_users->insert(array("device" => $device_id, "age" => "$age", "sex" => "$sex","product"=>"$product_id", "country" => "$country", "want"=> "True" ));
				
				}else 
					if($want=="false"){
					
					//$sql = $c_users->update(array("deviceId" => "$deviceId"), array('$set' => array("favourite" => 1)));
					
				$sql = $c_users->remove(array("device" => "$device_id","product" => "$product_id"));
					
				}
	
				//$cursor = $c_users->find(array("primaryCategory" => "$primary_category", "secondaryCategory" => "$secondary_category"));
			}
			
			if($sql) {
			$posts =  array('posts'=>'success');
		}else{
			$posts =  array('posts'=>'error');
		}

		header('Content-type: application/json');
		$j= json_encode(array('posts'=>$posts));
		echo $j;
		}
	}//end of child
}//end of Login class
?>