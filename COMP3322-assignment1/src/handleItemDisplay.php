<?php

	//Connect to database
	$conn=mysqli_connect('sophia.cs.hku.hk', 'qyhu', '........') or die('Error! '. mysqli_error($conn));

  //Select database
	mysqli_select_db($conn, 'qyhu') or die('Error! '. mysqli_error($conn));



  $category = $_GET["category"];
  $page_number = $_GET["pageNumber"];

  $my_obj -> itemId = array();
  $my_obj -> itemImage = array();
  $my_obj -> itemName = array();
  $my_obj -> itemPrice = array();
  $my_obj -> itemDescription = array();
  $my_obj -> current_category = $category;
  $my_obj -> totalPageNumber;

  if ($category == "Men's shoes"){
    $my_obj -> category = "Men's shoes";
    $query = 'SELECT * FROM catalog WHERE itemCategory="Men\'s shoes" ORDER BY itemName';
  } else if ($category == "Women's dress"){
    $my_obj -> category = "Women's dress";
    $query = 'SELECT * FROM catalog WHERE itemCategory="Women\'s dress" ORDER BY itemName';
  } else if ($category == "Vitamins Supplements") {
    $my_obj -> category = "Vitamins Supplements";
    $query = "SELECT * FROM catalog WHERE itemCategory='Vitamins Supplements' ORDER BY itemName";
  }

  $result = mysqli_query($conn, $query) or die('Error! '. mysql_error($conn));
  $rowcount = mysqli_num_rows($result);


  for ($jump=0; $jump<3*($page_number-1); $jump++) {
    $row = mysqli_fetch_array($result);
  }
  for ($x = 0; $x < 3; $x++) {
    if ($row = mysqli_fetch_array($result)){
      $my_obj -> itemId[$x] = $row['itemID'];
      $my_obj -> itemImage[$x] = $row['itemImage'];
      $my_obj -> itemName[$x] = $row['itemName'];
      $my_obj -> itemPrice[$x] = $row['itemPrice'];
      $my_obj -> itemDescription[$x] = $row['itemDescription'];
    }
  }

  $reminder = $rowcount % 3;
  $rowcount = (int)($rowcount / 3);

  if ($reminder != 0) {
    $rowcount +=1;
  }

  $my_obj -> totalPageNumber = $rowcount;

  $my_JSON = json_encode($my_obj);
  print $my_JSON;
?>
