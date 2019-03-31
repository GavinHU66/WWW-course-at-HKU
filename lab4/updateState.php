<?php
	$conn=mysqli_connect('sophia.cs.hku.hk','qyhu','........') or die ('Failed to Connect! '.mysqli_error($conn));

	mysqli_select_db($conn, 'qyhu') or die ('Failed to Access DB! '.mysqli_error($conn));

	$value = $_POST['newValue'];

	$query = "update stockList set status = '$value' where id=".$_POST['id'];

	mysqli_query($conn, $query) or die ('Query Error!!!!!!!!!! '.mysqli_error($conn));

	print $value;
?>
