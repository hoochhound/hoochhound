<?php

class Filter
{
	//send childs data
	function post($request_data=NULL)
	{
		/*decode jason object values into array*/
		$json = file_get_contents('php://input');
		$obj = json_decode($json, true);


		include_once '../includes/config.php';
		// Get the users collection
		$c_users = $db->products;
		$c_reviews = $db->reviews;
		$c_packages = $db->standardPackageSizes;


		/*get data from the jason decoded array*/
		if(is_array($obj))
		{
			foreach($obj as $pro)
			{
					
				$tag = $pro['tags']; // tags
				//$name = $pro['name']; //name

				$foodType = $pro['foodType'];

				$primary_category = $pro['primary']; // primary category
				$secondary_category = $pro['secondary_category']; //secondary category



				$packages = $c_packages->find(array('primaryCategory' =>$primary_category));

				foreach ($packages as $id => $pacValue) {
						
					$packageUnitType = 	$pacValue['packageUnitType'];
					$packageVolume = 	$pacValue['packageUnitVolume'];
					$packageUnit = $pacValue['packageUnits'];



						
				}




				$prize_one = $pro['prize_one']; //prize one
				$prize_two = $pro['prize_two']; //prize two


			}
			//$prize_one = 10000;
			//$prize_two = 200000;

			/* 		$cursor = $c_users->find(array("packages.productPrice" => array('$gt' =>  (int)$prize_one, '$lte' =>  (int)$prize_two),
				'primaryCategory' => 'Spirits',
					'secondaryCategory' => 'Rum'

			)); */








			if($foodType){

					

				$cursor = $c_users->find(array(			'primaryCategory' => $primary_category,
						'secondaryCategory' => $secondary_category,
						"servingSuggestion" => new MongoRegex("/$foodType/"),
						"packages.packageUnitVolume" =>(int)$packageVolume,
						"packages.packageUnitType" =>$packageUnitType,
						"packages.packageUnits" =>(int)$packageUnit,
						'packages.productPrice' => array('$gt' => (int)$prize_one, '$lte' => (int)$prize_two)
				));


			}else{





				$cursor = $c_users->find(array('$and'  => array(array(

							
						'primaryCategory' => $primary_category,
						'secondaryCategory' => $secondary_category),
						array("packages.packageUnitVolume" =>(int)$packageVolume,
								"packages.packageUnitType" =>$packageUnitType),
						array("packages.packageUnits" =>(int)$packageUnit,
								'packages.productPrice' => array('$gt' => (int)$prize_one, '$lt' => (int)$prize_two))
				)));


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