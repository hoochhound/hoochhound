<?php
include_once '../includes/config.php';
		// Get the users collection
		$c_users = $db->products;  //products table
		

		/*get data from the jason decoded array*/
                $searchQuery = array();
               // $searchQuery = array('primaryCategory' => 'Beer');
               // $searchQuery = array('primaryCategory' => 'Beer', 'secondaryCategory' => 'Ale');
                $cursor = $c_users->find($searchQuery);
                foreach ($cursor as $value) {
                  $name =  $value['name'];  
                var_dump($name);
                }
                
                $posts[] = array('product name'=>$name);
                
                ?>
		