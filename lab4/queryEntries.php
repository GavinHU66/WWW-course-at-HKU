<?php
	$conn=mysqli_connect('sophia.cs.hku.hk','qyhu','........') or die ('Failed to Connect '.mysqli_error($conn));

	mysqli_select_db($conn, 'qyhu') or die ('Failed to Access DB'.mysqli_error($conn));

	if ($_GET['show'] == 'all') {
		$query = 'select * from stockList';
	} elseif ($_GET['show'] == 'stockcode') {
		$value = $_GET['value'];
		$query = "select * from stockList where stockcode = '$value'";
	} elseif ($_GET['show'] == 'category') {
		$value = $_GET['value'];
		$query = "select * from stockList where category = '$value'";
	}

	$result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));

	$item_array=array();

	while($row = mysqli_fetch_array($result)) {
		$item_array[] = array('id'=>$row['id'],'stockname'=> $row['stockname'],'category' => $row['category'] ,'stockcode'=> $row['stockcode'],'date'=>$row['date'],'status'=>$row['status']);
	}

	print json_encode($item_array);
?>
