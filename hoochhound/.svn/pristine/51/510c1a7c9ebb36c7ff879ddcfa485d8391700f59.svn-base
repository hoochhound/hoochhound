<?php



class Category
{
	//send childs data
	function get($id=NULL) 
	{
		
		include_once '../includes/config.php';
		//Get the users collection
		$c_users = $db->productCategories;
		
		
		
		
		$cursor = $c_users->find();
		
		foreach ($cursor as $id => $value) {
		
			$primary_key =  $value['primaryCategory'];		
		
			//$cursor2 = $c_users->find(array('primaryCategory' => '$primary_key '), array('secondaryCategories' => 1));
		
			$cursor2 = $c_users->find(array("primaryCategory" => "$primary_key"));
			$secondary_arr = array();
			foreach ($cursor2 as $id => $value) {
				$secondary_arr[] = $value['secondaryCategories'];
                                
                                $cursor3 = $c_users->find(array("secondaryCategories" => "$secondary_arr"));
                                $third_arr = array();
                                foreach ($cursor3 as $id => $value) {
				$third_arr[] = $value['thirdCategories'];
                                
                                $cursor4 = $c_users->find(array("thirdCategories" => "$third_arr"));
                                $fourth_arr = array();
                                foreach ($cursor4 as $id => $value) {
				$fourth_arr[] = $value['fourthCategory'];
                                }
			}
			}
		
			$posts[] = array('primary_cat'=>$primary_key,'secondary_cat'=>$secondary_arr,'third_cat'=>$third_arr,'fourth_cat'=>$fourth_arr);
		
		}
		
		
		header('Content-type: application/json');
		$j= json_encode(array('posts'=>$posts));
		print_r($j);
				
	}//end of child
}//end of Login class
?>