<?php
//handle error reports
error_reporting (E_ALL ^ E_NOTICE);
//handle warning messages
error_reporting(E_ERROR | E_PARSE);

if($_POST){
	
	//Connect to the database
	include_once '../includes/config.php';
	set_time_limit(0);

	
	if(is_uploaded_file($_FILES['file']['tmp_name'])){
	
		$handle = fopen($_FILES['file']['tmp_name'], "r");
	
		$data = fgetcsv($handle, 1000, ",");
	
		//Remove if CSV file does not have column headings
		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	
			$id = mysql_real_escape_string($data[0]);
	
			try {
	
	
				// access collection
				$collection = $db->products;
	
				$id = id();
	
				$doc = $collection->findOne(array("_id" => new MongoID("$id")));
	
				if(!empty($doc)){
	
	
					//update data
					$alcoholContent = mysql_real_escape_string($data[1]);
					$kosher = mysql_real_escape_string($data[2]);
					$origin = mysql_real_escape_string($data[3]);
					$primaryCategory = mysql_real_escape_string($data[4]);
					$secondaryCategory = mysql_real_escape_string($data[5]);
					$tags = mysql_real_escape_string($data[6]);
					$tastingNote = mysql_real_escape_string($data[7]);
					 
					 
					$products_table = $db->products;
					 
					$newdata = array('$set' => array(
							"alcoholContent" => "$alcoholContent",
							"kosher" => "$kosher",
							"origin" => "$origin",
							"primaryCategory" => "$primaryCategory",
							"secondaryCategory" => "$secondaryCategory",
							"tags" => "$tags",
							"tastingNote" => "$tastingNote"
					));
					 
					 
					$products_table->update(array("_id" => new MongoID("$id")), $newdata);
					 
	
	
			 }else{
	
			 	//insert a new document
	
			 	//
	
			 	/*
	
			 	$object = array(
			 			"trackName" => "Sju sorger",
			 			"artistName" => "Veronica Maggio",
			 			"albumName" => "Satan i Gatan",
			 	);
	
			 	$collection->save($object);
	
	
	
			 	$id = mysql_real_escape_string($data[0]);
			 	$alcoholContent = mysql_real_escape_string($data[1]);
			 	$kosher = mysql_real_escape_string($data[2]);
			 	$origin = mysql_real_escape_string($data[3]);
			 	$primaryCategory = mysql_real_escape_string($data[4]);
			 	$secondaryCategory = mysql_real_escape_string($data[5]);
			 	$tags = mysql_real_escape_string($data[6]);
			 	$tastingNote = mysql_real_escape_string($data[7]);
			 	$author = array(
			 			'first_name'=>'Thomas',
			 			'last_name' =>'Johnson',
			 			'website'=>'http://www.tomfmason.net'
			 	);
			 	$insert_pro = $products_table->insert($author); */
	
			 }
			
			
			
			}catch (MongoException $e){
				
				
				$msg = ('Error: ' . $e->getMessage());
			
			}
			

		}
	}

}
?>
<html>
<head></head>
<body>
	<h2>Import to CSV</h2>
<form method="post" enctype="multipart/form-data" action="">
    <input type="file" name="product_file" required /> <br/>
    <input type="file" name="package_file" required />
    <font size="1">* File format: .csv</font> 
</form>
</body>
</html>