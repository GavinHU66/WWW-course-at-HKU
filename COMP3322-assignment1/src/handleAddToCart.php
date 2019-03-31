<?php

// retrieve all the categories that the items in the database table belong to. Then it sends the list of categories (no duplication) back to the client in JSON.

    session_start();

    $total_number = 0;
    $item_id = $_GET["itemID"];
    $update_number = $_GET["updateNumber"];

    if (!isset($_SESSION["shopping_cart"])){
      $_SESSION["shopping_cart"] = array();
      foreach($_SESSION["shopping_cart"] as $number){
        $total_number += $number;
      }
      print $total_number;
    } else {
      if ($item_id == 0){
        foreach($_SESSION["shopping_cart"] as $number){
          $total_number += $number;
        }
        print $total_number;
      } elseif ($item_id == -1) {
        //unset($_SESSION["shopping_cart"]);
        session_unset();
        print 0;
      } else {
        if (!array_key_exists($item_id,	$_SESSION["shopping_cart"])){ // newly added
          $_SESSION["shopping_cart"][$item_id] = $update_number;
        } else { // already added before
          $_SESSION["shopping_cart"][$item_id] += $update_number;
          // $number_of_it = $_SESSION["shopping_cart"][$item_id];
        }

        if ($_SESSION["shopping_cart"][$item_id] <= 0){
          unset($_SESSION["shopping_cart"][$item_id]);
        }

        foreach($_SESSION["shopping_cart"] as $key => $value){
          $total_number += $value;
        }

        print $total_number;

      }
    }

?>
