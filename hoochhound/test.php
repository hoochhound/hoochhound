<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);

include_once 'includes/config.php';

	// Get the users collection
	$c_users = $db->products;
        

			

				$tag = "sri lanka"; // tags
				$tags =  explode(' ', $tag);
                                
                                
                
                foreach($tags as $keyword)
                {
                $keywords = new MongoRegex("/^$keyword/i");  
                //$cursor = $c_users->find(array("tags" => new MongoRegex("/$tag/")/*, "status" => "true"*/
                $cursor = $c_users->find(array("tags" => array('$in' => array($keywords)), "status" => "TRUE"));
				    //$cursor = $c_users->find(array('$or' => array(array("tags" => "$tag"), array("name" => "$name"))));
                    //$cursor = $c_users->find(array("tags" => new MongoRegex("/$keyword/"), "status" => "TRUE"));
                   
                $count_id = $c_users->find(array("tags" => array('$in' => array($keywords)), "status" => "TRUE"))->count(); 
                
                $dup = array();
                    foreach ($cursor as $id => $value)
                    {
                        
			$name =  $value['id'];
                        if(!in_array($name, $dup)){
                        $dup[]=$name;
                        var_dump($name);
                        echo "<br/>";
                        }
                                
                        
		
  
                    }

}



	// Find the user with first_name 'MongoDB' and last_name 'Fan'
	
	
	//$user = array(
   // 'packages' => new MongoId('4f82610096004301000060a0'));//1

	//$user = array('packages.productId' => array('$lt' => 904409)); //2
	
	//$name = "beer";
	
	
	//$user = array("name" => "Molson");
	//$user = $c_users->findOne($user);
	
	//var_dump($user);
	
	//$user = array("name" => new MongoRegex("/$name/")); //3
	
	
	
	//$results = $mongodb->find(array("visits.payment" => array('$lt' => 904409)));

	
	
	
	
/* 
	
	$cursor = $c_users->find(array("tags" => new MongoRegex("/$name/")));
	foreach ($cursor as $id => $value) {
   // echo "$id: ";
    //
	
	//echo( $value );
	
	
	header('Content-type: application/json');
	$json= json_encode($value);
	

	
}
		$obj = json_decode($json, true);
	print_r($obj); */
	
	

//db.products.find({ _id: ObjectId("4f82610096004301000060a0")}).limit(10)
// $item = $collection->findOne(array(
// '_id' => new MongoId('4e49fd8269fd873c0a000000')));
?>