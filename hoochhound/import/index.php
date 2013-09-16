<?php
//handle error reports
error_reporting (E_ALL ^ E_NOTICE);
//handle warning messages
error_reporting(E_ERROR | E_PARSE);


//header('Content-Type: text/html; charset=UTF-8');
//setlocale(LC_ALL, 'ja_JP.UTF8');
//setlocale(LC_ALL, 'en_US.UTF-8');
setlocale(LC_ALL, 'fr_FR.UTF-8');


include_once '../includes/config.php';
set_time_limit(0);

# include parseCSV class.
require_once('./parsecsv.lib.php');

if($_POST){
	
	//Connect to the database
	/*
	include_once '../includes/config.php';
	set_time_limit(0);
	*/
	
	if(is_uploaded_file($_FILES['product_file']['tmp_name']))
	{
		$rowCount = 0;
		
		# create new parseCSV object.
		$csv = new parseCSV();
		
		$csv->auto($_FILES['product_file']['tmp_name']);
		
		if($csv->data)
		{
			foreach ($csv->data as $key => $row):
				$num = count($row);
				$rowCount++;
				
				if($num == 11)
				{
					//echo("Row:".$rowCount." - ID:".$row['name']."<br/>");
					
					try
					{
						$collection = $db->products;
		
						$doc = $collection->findOne(array('_id' => new MongoID($row['id'])));
		
						if(!empty($doc))
						{					
							//update data
							
							/*
							$status = mysql_real_escape_string($data[1]);
							$name = mysql_real_escape_string($data[2]);
							$origin = mysql_real_escape_string($data[3]);
							$primaryCategory = mysql_real_escape_string($data[4]);
							$secondaryCategory = mysql_real_escape_string($data[5]);
							$thirdCategory = mysql_real_escape_string($data[6]);
							$fourthCategory = mysql_real_escape_string($data[7]);
							$producerName = mysql_real_escape_string($data[8]);
							$foodType = mysql_real_escape_string($data[9]);
							$upc = mysql_real_escape_string($data[10]);
							
							//$alcoholContent = mysql_real_escape_string($data[1]);
							//$kosher = mysql_real_escape_string($data[2]);
							//$tags = mysql_real_escape_string($data[6]);
							//$tastingNote = mysql_real_escape_string($data[7]);
							
							*/
							
							$products_table = $db->products;
							
							$newdataWithValidation = array();
							
							if (strlen($row['status'])>0) {
								$newdataWithValidation['status'] = $row['status'];
							}
							
							if (strlen($row['name'])>0) {
								$newdataWithValidation['name'] = utf8_encode($row['name']);
							}
							
							if (strlen($row['origin'])>0) {
								$newdataWithValidation['origin'] = utf8_encode($row['origin']);
							}		
							
							if (strlen($row['primaryCategory'])>0) {
								$newdataWithValidation['primaryCategory'] = utf8_encode($row['primaryCategory']);
							}
							
							if (strlen($row['secondaryCategory'])>0) {
								$newdataWithValidation['secondaryCategory'] = utf8_encode($row['secondaryCategory']);
							}
							
							if (strlen($row['thirdCategory'])>0) {
								$newdataWithValidation['thirdCategory'] = utf8_encode($row['thirdCategory']);
							}
							
							if (strlen($row['fourthCategory'])>0) {
								$newdataWithValidation['fourthCategory'] = utf8_encode($row['fourthCategory']);
							}
							
							if (strlen($row['producerName'])>0) {
								$newdataWithValidation['producerName'] = utf8_encode($row['producerName']);
							}
							
							if (strlen($row['foodType'])>0) {
								$newdataWithValidation['foodType'] = $row['foodType'];
							}
							
							if (strlen($row['upc'])>0) {
								$newdataWithValidation['upc'] = $row['upc'];
							}
							
							/*
							$newdata = array(
								//'alcoholContent' => "$alcoholContent",
								'status' => "$status",
								'name' => "$name",
								'origin' => "$origin",
								'primaryCategory' => "$primaryCategory",
								'secondaryCategory' => "$secondaryCategory",
								'thirdCategory' => "$thirdCategory",
								'fourthCategory' => "$fourthCategory",
								'producerName' => "$producerName",
								'foodType' => "$foodType"
								);
							*/
							
							if(count($newdataWithValidation) > 0)
							{
								$products_table->update(array('_id' => new MongoID($row['id'])), array( '$set' => $newdataWithValidation ));
								//echo("<p>Row:$row - Selected ID:$id update done.</p>\n");
								//echo("<p>$row rows are updated to the remote db.</p>\n");
							}
							else
							{
								echo("<Row:$rowCount - Selected ID:".$row['id']." data is null.<br/>");
							}
						}
						else
						{
		
						 	// should insert a new document (not done)
						 	
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
						 	$insert_pro = $products_table->insert($author);
						 	
						 	*/
						 	
					 		echo("Row:$rowCount - Selected ID:".$row['id']." is not available in db.<br/>");
					 	}
					}
					catch (MongoException $e)
					{
						/*
$msg = ('Error: ' . $e->getMessage() . 'Row: '. "$row". 'ID:'.$row['id']."<br/>");
						var_dump($msg);
*/
						
						echo("ERROR:".$e->getMessage()." Row:". "$rowCount". 'ID:'.$row['id']."<br/>");
					}
				
					//echo("Row:".$rowCount." - ID:".$row['id']."<br/>");
					
					/*
					foreach ($row as $value):
											$id = $value;
											echo("$id <br/>");
										endforeach;
					*/
					
					//print("<pre>".print_r($row,true)."</pre>");
					
				}
				else
				{
					echo("Row:$rowCount - with Columns:$num on ID:".$row['id']." is not properly formatted as per Requirement.<br/>");
				}
				
			endforeach;
		}
		else
		{
			echo("File data is corrupted");
		}
		

		
		//$fhandle = fopen($_FILES['product_file']['tmp_name'],'r');
		
		/*
if (($handle = fopen($_FILES['product_file']['tmp_name'], "r")) !== FALSE)
		{
			//echo("File Handle Done");
		
			while($raw_row = fgets($handle, 1000))
			{
				$rowLine = csvstring_to_array($raw_row, ',', '"', "\n");
				
				$num = count($rowLine);
				$row++;
				
				if($num > 0)
				{
					$id = mysql_real_escape_string($rowLine[0]);
					echo("$id <br/>");
				}
				else
				{
					echo("<p>Row:$row - with Columns:$num on ID: $id is not properly formatted as per Requirement.</p>\n");
				}	
			}
		}
*/
		
		
		
		/*
if (($handle = fopen($_FILES['product_file']['tmp_name'], "r")) !== FALSE)
		{
			while (($data = fgetcsv($handle, 1000, ",")) !== FALSE)
			{
				$num = count($data);
				$id = mysql_real_escape_string($data[0]);
				
				$row++;
				
				if($num == 11)
				{
					try
					{
						// access collection
						$collection = $db->products;
		
						//$id = id();
		
						//$doc = $collection->findOne(array('_id' => "$id"));
						
						$doc = $collection->findOne(array('_id' => new MongoID("$id")));
		
						if(!empty($doc))
						{					
							//update data
							
							$status = mysql_real_escape_string($data[1]);
							$name = mysql_real_escape_string($data[2]);
							$origin = mysql_real_escape_string($data[3]);
							$primaryCategory = mysql_real_escape_string($data[4]);
							$secondaryCategory = mysql_real_escape_string($data[5]);
							$thirdCategory = mysql_real_escape_string($data[6]);
							$fourthCategory = mysql_real_escape_string($data[7]);
							$producerName = mysql_real_escape_string($data[8]);
							$foodType = mysql_real_escape_string($data[9]);
							$upc = mysql_real_escape_string($data[10]);
							
							//$alcoholContent = mysql_real_escape_string($data[1]);
							//$kosher = mysql_real_escape_string($data[2]);
							//$tags = mysql_real_escape_string($data[6]);
							//$tastingNote = mysql_real_escape_string($data[7]);
						 
							$products_table = $db->products;
							
							$newdataWithValidation = array();
							
							if (strlen($status)>0) {
								$newdataWithValidation['status'] = "$status";
							}
							
							if (strlen($name)>0) {
								$newdataWithValidation['name'] = "$name";
							}
							
							if (strlen($origin)>0) {
								$newdataWithValidation['origin'] = "$origin";
							}		
							
							if (strlen($primaryCategory)>0) {
								$newdataWithValidation['primaryCategory'] = "$primaryCategory";
							}
							
							if (strlen($secondaryCategory)>0) {
								$newdataWithValidation['secondaryCategory'] = "$secondaryCategory";
							}
							
							if (strlen($thirdCategory)>0) {
								$newdataWithValidation['thirdCategory'] = "$thirdCategory";
							}
							
							if (strlen($fourthCategory)>0) {
								$newdataWithValidation['fourthCategory'] = "$fourthCategory";
							}
							
							if (strlen($producerName)>0) {
								$newdataWithValidation['producerName'] = "$producerName";
							}
							
							if (strlen($foodType)>0) {
								$newdataWithValidation['foodType'] = "$foodType";
							}
							
							if (strlen($upc)>0) {
								$newdataWithValidation['upc'] = "$upc";
							}
							
							
$newdata = array(
								//'alcoholContent' => "$alcoholContent",
								'status' => "$status",
								'name' => "$name",
								'origin' => "$origin",
								'primaryCategory' => "$primaryCategory",
								'secondaryCategory' => "$secondaryCategory",
								'thirdCategory' => "$thirdCategory",
								'fourthCategory' => "$fourthCategory",
								'producerName' => "$producerName",
								'foodType' => "$foodType"
								);

							
							if(count($newdataWithValidation) > 0)
							{
								$products_table->update(array('_id' => new MongoID("$id")), array( '$set' => $newdataWithValidation ));
								//echo("<p>Row:$row - Selected ID:$id update done.</p>\n");
								//echo("<p>$row rows are updated to the remote db.</p>\n");
							}
							else
							{
								echo("<p>Row:$row - Selected ID:$id data is null.</p>\n");
							}
						}
						else
						{
		
						 	//insert a new document
						 	
						 	
				
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
						 	$insert_pro = $products_table->insert($author);
						 	
						 	
						 	
					 		echo("<p>Row:$row - Selected ID:$id is not available in db.</p>\n");
					 	}
					}
					catch (MongoException $e)
					{
						$msg = ('Error: ' . $e->getMessage() . 'Row: '. "$row". 'ID:'."$id");
						var_dump($msg);
					}
				}
				else
				{
					echo("<p>Row:$row - Selected ID:$id is not properly formatted as per Requirement.</p>\n");
				}
				//echo "<p> $num fields in line $row: <br /></p>\n";
				
				
				//echo "<p>Row:$row - Selected ID:$id<br/></p>\n";
				
				
								
			}
			fclose($handle);
		
		}
*/
		
		echo("File upload is done");
	}
	else
	{
		echo("File is corrupted");
	}

}
?>
<html>
<head></head>
<body>
	<h2>Import to CSV</h2>
<form method="post" enctype="multipart/form-data" action="">
    <input type="file" name="product_file" required />
    <input type="submit" name="submit_btn" value="Submit" />
    <font size="1">* File format: .csv</font> 
</form>

</body>
</html>