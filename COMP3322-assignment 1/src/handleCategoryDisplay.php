<?php

// retrieve all the categories that the items in the database table belong to. Then it sends the list of categories (no duplication) back to the client in JSON.

	//Connect to database
	$conn=mysqli_connect('sophia.cs.hku.hk', 'qyhu', '........') or die('Error! '. mysqli_error($conn));

	//Select database
	mysqli_select_db($conn, 'qyhu') or die('Error! '. mysqli_error($conn));

	//Construct your SQL query here, selects all entries from the stockList table.
	$query = 'SELECT * FROM catalog ORDER BY itemCategory';

	//Execute SQL query
	$result = mysqli_query($conn, $query) or die('Error! '. mysql_error($conn));

  //create an array, add data to it from datatbase, with no duplication
  $my_obj = array();

  while($row = mysqli_fetch_array($result)){

    if (!in_array($row['itemCategory'], $my_obj) ){
      array_push($my_obj, $row['itemCategory']);
    }

  }

  $my_JSON = json_encode($my_obj);
  print $my_JSON;

?>
