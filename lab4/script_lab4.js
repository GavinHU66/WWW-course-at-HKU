
$(document).ready(function () {
    showAll();

    $("#button_all").click(showAll);

    $("#FS").click(function () {
      console.log("FS is invoked!");
      $("#entries").empty();
      var stockCode = document.getElementById("stockcode").value;
      $.getJSON("queryEntries.php?show=stockcode&value="+stockCode, function(json){
        // console.log(json.length);
        for (var i = 0; i < json.length; i++) {

          var stock = document.createElement('div');

          var span = document.createElement('span');
          span.setAttribute('id',json[i]["id"]);
          span.setAttribute("onclick","changeState(this)");
          span.innerHTML = json[i]["status"];

          var stockName = document.createElement('h3');
          stockName.innerHTML = json[i]["stockname"];

          var stockCategory = document.createElement('h3');
          stockCategory.innerHTML = "(" + json[i]["category"] + ")";

          var stockCodeAndDate = document.createElement('h5');
          stockCodeAndDate.innerHTML = "(" + json[i]["stockcode"] + ") on " + json[i]["date"] + "</h5>";

          stock.appendChild(span);
          stock.appendChild(stockName);
          stock.appendChild(stockCategory);
          stock.appendChild(stockCodeAndDate);

          $("#entries").append(stock);

        }
        $("#button_all").show();
      });
    });

    $("#FC").click(function () {
      console.log("FC is invoked!");
      $("#entries").empty();
      var category = document.getElementById("category").value;
      $.getJSON("queryEntries.php?show=category&value="+category, function(json){
        // console.log(json.length);
        for (var i = 0; i < json.length; i++) {

          var stock = document.createElement('div');

          var span = document.createElement('span');
          span.setAttribute('id',json[i]["id"]);
          span.setAttribute("onclick","changeState(this)");
          span.innerHTML = json[i]["status"];

          var stockName = document.createElement('h3');
          stockName.innerHTML = json[i]["stockname"];

          var stockCategory = document.createElement('h3');
          stockCategory.innerHTML = "(" + json[i]["category"] + ")";

          var stockCodeAndDate = document.createElement('h5');
          stockCodeAndDate.innerHTML = "(" + json[i]["stockcode"] + ") on " + json[i]["date"] + "</h5>";

          stock.appendChild(span);
          stock.appendChild(stockName);
          stock.appendChild(stockCategory);
          stock.appendChild(stockCodeAndDate);

          $("#entries").append(stock);

        }
        $("#button_all").show();
      });
    });

    $("#status").click(changeState);


    $("#orderByName").click(function () { //order by name
      console.log("orderByName is invoked!");
      $entrydivs=$("#entries").children();

      $entrydivs.sort(function(a,b){
        var an = $($(a).find('h3')[0]).text();
        var bn = $($(b).find('h3')[0]).text();

        if(an > bn) {
          return 1;
        }
        if(an < bn) {
          return -1;
        }
        return 0;
      });

      $entrydivs.detach().appendTo($("#entries"));
    });

    $("#orderByCategory").click(function () { //order by category
      console.log("orderByCategory is invoked!");
      $entrydivs=$("#entries").children();

      $entrydivs.sort(function(a,b){
        var an = $($(a).find('h3')[1]).text();
        var bn = $($(b).find('h3')[1]).text();

        if(an > bn) {
          return 1;
        }
        if(an < bn) {
          return -1;
        }
        return 0;
      });

      $entrydivs.detach().appendTo($("#entries"));

    });

});



function showAll() {
  console.log("showAll() is invoked!");
  $("#entries").empty();
  $.getJSON("queryEntries.php?show=all", function(json){
    console.log(json.length);
    for (var i = 0; i < json.length; i++) {

      var stock = document.createElement('div');

      var span = document.createElement('span');
      span.setAttribute('id',json[i]["id"]);
      span.setAttribute("onclick","changeState(this)");
      span.innerHTML = json[i]["status"];

      var stockName = document.createElement('h3');
      stockName.innerHTML = json[i]["stockname"];

      var stockCategory = document.createElement('h3');
      stockCategory.innerHTML = "(" + json[i]["category"] + ")";

      var stockCodeAndDate = document.createElement('h5');
      stockCodeAndDate.innerHTML = "(" + json[i]["stockcode"] + ") on " + json[i]["date"] + "</h5>";

      stock.appendChild(span);
      stock.appendChild(stockName);
      stock.appendChild(stockCategory);
      stock.appendChild(stockCodeAndDate);

      $("#entries").append(stock);

    }
   $("#button_all").hide();
  });
}

function changeState(elem) {
  console.log("changeState() is invoked");
  var oldValue = elem.innerHTML;
  var itemID = elem.getAttribute('id');

  var newValue = (oldValue == 'RISE')? 'FALL': 'RISE';

  $.post("updateState.php?", {id: itemID, newValue: newValue},
    function(data){
      elem.innerHTML = data;
    }
  );

}
