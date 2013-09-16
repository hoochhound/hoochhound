<?php

class Category
{
	//send childs data
	function get($id=NULL)
	{
		/*decode jason object values into array*/
		$json = file_get_contents('php://input');
		$obj = json_decode($json, true);
		//print_r  $obj;

		include_once '../includes/config.php';

		// Get the products collection
		$c_users = $db->products;

		$tag = $pro['tags']; // tags

	//	$pri = $db->command(array("distinct" => "products", "key" => "primaryCategory"));
		$pri = $db->command(array("distinct" => "products", "key" => "primaryCategory","query" => array("servingSuggestion" => new MongoRegex("/$tag/"))));



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