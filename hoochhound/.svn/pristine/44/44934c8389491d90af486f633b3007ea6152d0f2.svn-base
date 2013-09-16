<?php
class Pcats
{
	//send childs data
	function get($id=NULL)
	{

		include_once '../includes/config.php';
		//Get the users collection
		$c_users = $db->priceFilters;
		$c_users2 = $db->standardPackageSizes;




		$cursor = $c_users->find();
		$cursor2 = $c_users2->find();

		foreach ($cursor as $id => $value) {

			$posts[] = $value;

		}
		
		
		foreach ($cursor2 as $id => $value2) {
		
			$posts2[] = $value2;
		
		}


		header('Content-type: application/json');
		$j= json_encode(array('prizeCategories'=>$posts,'packageCategories'=>$posts2 ));
		print_r($j);

	}//end of child
}//end of Login class
?>