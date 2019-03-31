<?php
//Connect to database
$conn=mysqli_connect('sophia.cs.hku.hk', 'qyhu', '........') or die('Error! '. mysqli_error($conn));

//Select database
mysqli_select_db($conn, 'qyhu') or die('Error! '. mysqli_error($conn));

//Construct your SQL query here
$value = $_GET['newValue'];
$query = "update stockList set status= '$value' where id=".$_GET['id'];

//Execute SQL query
$result = mysqli_query($conn, $query) or die('Error! '. mysql_error($conn));


print $value;

?>
