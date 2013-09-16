<?php

		/*decode jason object values into array*/
		$json = json_encode(array('name'=>'Molson'));
		
		
		
		$obj = json_decode($json, true);
		//print_r  $obj;
		
		include_once 'includes/config.php';
		// Get the users collection
		$c_users = $db->products;
		

		
		
		
		
		
		
		/*get data from the jason decoded array*/	
		if(is_array($obj))
		{
			foreach($obj as $pro)
			{
			
				$name = $pro['name'];
				//$tags = '".$pro['tags']."';
				
					$user = array("name" => new MongoRegex("/$name/"));
				
					//	$user = array('packages.productId' => array('$lt' => 904409)); //2
	
	
						//$results = $mongodb->find(array("visits.payment" => array('$lt' => 904409)));

							//var_dump($user);
	
						$user = $c_users->findOne($user);
				
				
				//var_dump($user);

					header('Content-type: application/json');
					$json= json_encode(array('results'=>$user));
				


					
			}
		}	
		
		echo $json;

				
?>
