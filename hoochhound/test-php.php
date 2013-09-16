<?php 
include_once 'includes/config.php';
// Get the users collection

$c_users = $db->products; //products
				

				
				$primary_category = "Beer"; // primary category
				$secondary_category = "Lager"; //secondary category
				

					
				$packageUnitType = 	"bottle";
				$packageVolume = 	341;
				$packageUnit = 6;
				
				
								
					
		
				$prize_one =1000;
				$prize_two = 2000;
		
				
			
				
					//$cursor = $c_users->find(array("packages.productPrice" => array('$gt' => (int)$prize_one, '$lte' =>(int)$prize_two)));


		
						$cursor = $c_users->find(array(	));

				
				
				
						foreach ($cursor as $id => $value) {
							
						foreach($value['packages'] as $a){
									
									$price =  $a['productPrice'];
									$packageUnitType =  $a['packageUnitType'];
									$volume =  $a['packageUnitVolume'];
									
									$units =  $a['packageUnits'];
									
								echo $units;
								
								if( $prize_one<$price&&$price>$prize_two && $packageUnitType=="bottle"&&$volume=="341"&&$units=="6"){
									
														
									$va = 1;
							
									
								}
								
							
								
								
								}
								
								
								
								if(isset($va)){
										
									var_dump( $value);
								
								} 
								
					
							
						}
						

				?>