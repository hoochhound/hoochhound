<?php

class Fcats
{
	//send childs data
	function post($request_data=NULL) 
	{
		/*decode jason object values into array*/
		$json = file_get_contents('php://input');
		$obj = json_decode($json, true);
		//print_r  $obj;

		include_once '../includes/config.php';

		// Get the products collection
		$c_users = $db->products;

		foreach($obj as $pro)
		{
		
		$tag = $pro['tags']; // tags
		
		//$breakstrings = explode(' ',$tags);
		
	//	$tag = $breakstrings[0];
	
	
	
	//$tag = "serve with finger foods";

	//	$pri = $db->command(array("distinct" => "products", "key" => "primaryCategory"));
		$pri = $db->command(array("distinct" => "products", "key" => "primaryCategory","query" => array("servingSuggestion" => new MongoRegex("/$tag/"))));


		
	//	$pri = $db->command(array("distinct" => "products", "key" => "primaryCategory","query" => array("servingSuggestion" => array('$in' => $tag))));

/* 		I'm using MongoDB and PHP and trying to do a $in based on a generated array.
		
When I specify the same array manually, it works, but when I build it, it return any results with the same data.
		
There's what I have:
		
		$settings = array();
		foreach($items as $item) {
			$settings[] = $item['id'];
		}
		
		//Settings is the same as this
		$setting2 = array(1,2,3,4,5,6,7,8); */
		
		
		
		}

		$secondary_arr = array();
		$posts = array();

		foreach ($pri['values'] as $age)
		{
			//echo "$age\n";
				
			//$sec = $c_users->find(array("primaryCategory" => "$age"), array("secondaryCategory" => 1));
				
			$sec = $db->command(array("distinct" => "products", "key" => "secondaryCategory","query" => array("primaryCategory" => "$age")));
				
			foreach ($sec['values'] as $agev)
			{
				$secondary_arr[] = "$agev";
			}
				
			$posts[] = array('primary_cat'=>$age,'secondary_cat'=>$secondary_arr);

		}

		header('Content-type: application/json');
		$j= json_encode(array('posts'=>$posts));

		print_r($j);

	}//end of child
}//end of Login class
?>