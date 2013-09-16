<?php
//handle error reports
error_reporting (E_ALL ^ E_NOTICE);
//handle warning messages
error_reporting(E_ERROR | E_PARSE);

include_once '../includes/config.php';
set_time_limit(0);

if($_POST){
//Export data to csv

$c_users = $db->products;
$cursor = $c_users->find();

$product_csv = "";
$product_csv .= "id,status,name,origin,primaryCategory,secondaryCategory,thirdCategory,fourthCategory,producerName,foodType,upc";
$product_csv .= "\n";

//Field names
//$product_csv .= "ID, Alcohol Content,Kosher, Origin, primaryCategory,  Producer Name,Secondary Category,  Tags, Tasting Note";
//$packages_csv .= "ID, Store Name, Product Id, Product Price, Package Unit Type,  Package UnitVolume, packageUnits,  ID";
foreach ($cursor as $id => $value)
{
	/*
product ID
	Name
	Categories
	Producer name
	food #
	upc	
*/

	
	$product_csv .= $id."," . $value['status'] ."," . $value['name'] ."," . $value['origin'] ."," . $value['primaryCategory'] ."," . $value['secondaryCategory'] .",". $value['thirdCategory'] .",". $value['fourthCategory'] .",". 	$value['producerName'] .",". $value['foodType'] .",". $value['upc'] ."\n";
	
	foreach ($value['packages'] as $id2 => $value2)
	{
		$packages_csv .= $id.",".$value['name'] . "," . $value2['storeName'] ."," . $value2['productId'] ."," . $value2['productPrice'] ."," . $value2['packageUnitType'] ."," . $value2['packageUnitVolume'] ."," . $value2['packageUnits'] ."," .$value2['_id'] ."\n";
	}
}

header("Content-type: application/vnd.ms-excel");
header("Content-disposition: csv" . date("Y-m-d") . ".csv");
header( "Content-disposition: filename=data.csv"); 
if($_POST['products_btn']){
print $product_csv;
}else if($_POST['package_btn']){

print $packages_csv;
}
exit;
}
?>
<html>
	<head></head>
	<body>
		<h2>Export to CSV</h2>
		<form action="" method="post">
		<input type="submit" name="products_btn" value="products" />
		<input type="submit" name="package_btn" value="packages" />
		</form>
	</body>
</html>