<?php
class Foods
{
	//send childs data
	function get($id=NULL)
	{

		include_once '../includes/config.php';
		//Get the users collection
		$c_users = $db->foodCategories;




		$cursor = $c_users->find();

		foreach ($cursor as $id => $value) {
                    
                    $status =  $value['active'];
                    if($status == true)
                    {
			$primary_key =  $value['category'];
                        $primary_spiel =  $value['spiel'];
                        $foodType =  $value['foodType'];
			$posts[] = array('primary_cat'=>$primary_key, 'primary_spiel'=>$primary_spiel, 'food_type'=>$foodType);
                    }
		}


		header('Content-type: application/json');
		$j= json_encode(array('posts'=>$posts));
		print_r($j);

	}//end of child
}//end of Login class
?>