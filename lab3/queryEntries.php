<?php

	//Connect to database
	$conn=mysqli_connect('sophia.cs.hku.hk', 'qyhu', '........') or die('Error! '. mysqli_error($conn));

	//Select database
	mysqli_select_db($conn, 'qyhu') or die('Error! '. mysqli_error($conn));

	//Construct your SQL query here, selects all entries from the stockList table.
	$query = 'SELECT * FROM stockList';

	//Execute SQL query
	$result = mysqli_query($conn, $query) or die('Error! '. mysql_error($conn));


	$filter = $_GET["show"];
	$keyword = $_GET["value"];

	if ($filter == "stockcode"){
		// Fetch the results and generate HTML code that displays the entries.
		while($row = mysqli_fetch_array($result)) {
			if ($row['stockcode'] == $keyword){
				print "<div id=".$row['id'].">";
				//Add code to display the entries
				print "<span onclick=changeState(this)>".$row['status']."</span>";
				print "<h3>".$row['stockname']." (".$row['category'].")</h3>";
				print "<h5>(".$row['stockcode'].") on ".$row['date']."</h5>";
				print "</div>";
			}

		}
	}
	elseif ($filter == "category") {
		// Fetch the results and generate HTML code that displays the entries.
		while($row = mysqli_fetch_array($result)) {
			if ($row['category'] == $keyword){
				//$row[''] == $keyword
				print "<div id=".$row['id'].">";
				//Add code to display the entries
				print "<span onclick=changeState(this)>".$row['status']."</span>";
				print "<h3>".$row['stockname']." (".$row['category'].")</h3>";
				print "<h5>(".$row['stockcode'].") on ".$row['date']."</h5>";
				print "</div>";
			}

		}
	}
	else{
		// Fetch the results and generate HTML code that displays the entries.
		while($row = mysqli_fetch_array($result)) {
					print "<div id=".$row['id'].">";
					//Add code to display the entries
					print "<span onclick=changeState(this)>".$row['status']."</span>";
					print "<h3>".$row['stockname']." (".$row['category'].")</h3>";
					print "<h5>(".$row['stockcode'].") on ".$row['date']."</h5>";
					print "</div>";
		}
	}

?>
