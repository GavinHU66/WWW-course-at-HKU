

function handleShowAll(){
    console.log("handleShowAll() is called");
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    }else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }//More code here for showing all entries

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4  && xmlhttp.status == 200){
            var mesgs = document.getElementById("entries");
            mesgs.innerHTML = xmlhttp.responseText;
            document.getElementById("button_all").style.display = "none";
        }
    }
    xmlhttp.open("GET", "queryEntries.php?show=all", true);
    xmlhttp.send();
}


function handleFilterByStockcode(){
    console.log("handleFilterByStockcode() is called");
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    }else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }//More code here for showing all entries

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4  && xmlhttp.status == 200){
            var mesgs = document.getElementById("entries");
            mesgs.innerHTML = xmlhttp.responseText;
            document.getElementById("button_all").style.display = "block";
        }
    }

    var stockCode = document.getElementById("stockcode").value;
    xmlhttp.open("GET","queryEntries.php?show=stockcode&value="+stockCode, true);
    xmlhttp.send();
}

function handleFilterByCategory(){
    console.log("handleFilterByCategory() is called");
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    }else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }//More code here for showing all entries

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4  && xmlhttp.status == 200){
            var mesgs = document.getElementById("entries");
            mesgs.innerHTML = xmlhttp.responseText;
            document.getElementById("button_all").style.display = "block";
        }
    }

    var category = document.getElementById("category").value;
    xmlhttp.open("GET","queryEntries.php?show=category&value="+category, true);
    xmlhttp.send();
}


function changeState(elem) {
  console.log("changeState() is called");

  var oldValue = elem.innerHTML;
  var newvalue;
  var itemID = elem.parentNode.getAttribute('id');

  if (oldValue == 'RISE') {
    newvalue = 'FALL';
  } else {
    newvalue = 'RISE';
  }

  var xmlhttp;
  if (window.XMLHttpRequest){
      xmlhttp = new XMLHttpRequest();
  }else{
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }//More code here for showing all entries

  xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4  && xmlhttp.status == 200){
          elem.innerHTML = xmlhttp.responseText;
      }
  }

  var category = document.getElementById("category").value;
  xmlhttp.open("GET","updateState.php?id=" + itemID + "&newValue="+ newvalue, true);
  xmlhttp.send();
}
