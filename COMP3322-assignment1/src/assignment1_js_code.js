var currentPageNumber = 1;
var currentCategory = "Men's shoes";
// function loadCategories(), loadInitialPage(), oadCartNumber() will be called when the index.html is loaded.
function loadMainPage(){
  loadCategories();
  loadInitialPage();
  loadCartNumber();
}

function loadCategories(){
  //console.log("loadCategories() is invoked");
  currentCategory = "Men's shoes";

  $.get("handleCategoryDisplay.php", function(json,status){
    for (var i = 0; i < json.length; i++) {
      var id = json[i];
      var category = document.createElement('div');
      category.setAttribute("class", "category");
      category.setAttribute("id", id);
      category.setAttribute("onclick", "loadCategoryFirstPage(this.id)");
      category.innerHTML = json[i];
      document.getElementsByClassName("category_list")[0].appendChild(category);
      if (i==0){currentCategory = id;}
    }
  },"json");
}


// when the page is first loaded,
// the client should also retrieve the first page of items belonging to the first category
// in the category list from the data base
//
// hisplay them in the right-hand division in the alphabetic order of the item names.
// inplements AJAX codes inside, to request handleItemDisplay.php

function loadInitialPage(){
  //console.log("loadInitialPage() is invoked");

  // configure the first page to show the first page of category mensshoes.
  currentPageNumber = 1;
  currentCategory = "Men's shoes";
  $("#current_category").attr('value', currentCategory);
  $("#page_number").attr('value', 1);

  $.get("handleItemDisplay.php?category=Men's shoes&pageNumber=1", function(json, status){
    $("#current_category").attr('value', json.current_category);
    document.getElementById("total_pages").innerHTML = " of " + json.totalPageNumber + " pages";
    $("#page_number").attr("max", json.totalPageNumber);

    for (i=0; i<json.itemName.length; i++){

      var item = document.createElement("div");
      item.setAttribute("class", "item");

      var item_image = document.createElement('img');
      item_image.setAttribute("class","item_image col-3");
      item_image.setAttribute("src",json.itemImage[i]);
      item_image.setAttribute("alt","img loaded failed");

      var item_name = document.createElement('p');
      item_name.setAttribute("class","item_name");
      item_name.innerHTML = json.itemName[i];

      var item_price = document.createElement('p');
      item_price.setAttribute("class","item_price");
      item_price.innerHTML = "$" + json.itemPrice[i];

      var item_description = document.createElement('p');
      item_description.setAttribute("class","item_description");
      item_description.innerHTML = json.itemDescription[i];

      var btn = document.createElement('button');
      btn.innerHTML = "Add to Cart";
      btn.setAttribute("name", "add_button");
      btn.setAttribute("id",json.itemId[i]);
      btn.setAttribute("class","add_to_cart_btn");
      btn.setAttribute("onclick", "addToCart(this.id)");

      item.appendChild(item_image);
      var textContent = document.createElement('div');
      textContent.setAttribute('class', 'item_text_content col-4');
      textContent.appendChild(item_name);
      textContent.appendChild(item_price);
      textContent.appendChild(item_description);
      textContent.appendChild(btn);
      item.appendChild(textContent);

      document.getElementById("items").appendChild(item);
    }
  }, "json");
}



// when user clicks a category
function loadCategoryFirstPage(id){

  console.log("loadCategoryFirstPage() is invoked");

  currentCategory = id;
  currentPageNumber = 1;
  $("#page_number").attr('value', currentPageNumber);
  $("#page_number").val(currentPageNumber);
  $("#current_category").attr('value', currentCategory);

  $.get("handleItemDisplay.php?category=" + currentCategory + "&pageNumber=1", function(json, status){
    // to remove items on previous page
    $("#items").empty();

    $("#current_category").attr('value', json.current_category);

    for (i=0; i<json.itemName.length; i++){
      var item = document.createElement("div");
      item.setAttribute("class", "item");

      var item_image = document.createElement('img');
      item_image.setAttribute("class","item_image col-3");
      item_image.setAttribute("src",json.itemImage[i]);
      item_image.setAttribute("alt","img loaded failed");

      var item_name = document.createElement('p');
      item_name.setAttribute("class","item_name");
      item_name.innerHTML = json.itemName[i];

      var item_price = document.createElement('p');
      item_price.setAttribute("class","item_price");
      item_price.innerHTML = "$" + json.itemPrice[i];

      var item_description = document.createElement('p');
      item_description.setAttribute("class","item_description");
      item_description.innerHTML = json.itemDescription[i];

      var btn = document.createElement('button');
      btn.innerHTML = "Add to Cart";
      btn.setAttribute("name", "add_button");
      btn.setAttribute("id",json.itemId[i]);
      btn.setAttribute("class","add_to_cart_btn");
      btn.setAttribute("onclick", "addToCart(this.id)");

      item.appendChild(item_image);
      var textContent = document.createElement('div');
      textContent.setAttribute('class', 'item_text_content col-4');
      textContent.appendChild(item_name);
      textContent.appendChild(item_price);
      textContent.appendChild(item_description);
      textContent.appendChild(btn);
      item.appendChild(textContent);

      document.getElementById("items").appendChild(item);
    }
  }, "json");
}


// to load the number of items in the current shopping cart
function loadCartNumber(){
  //console.log("loadCartNumber() is invoked");
  $.get( "handleAddToCart.php?itemID=0&updateNumber=0", function(data,status){
    var txt = "(" + data + ")";
    $("#total_item_in_shopping_cart").html(txt);
  });
}


// when user clicks the add-to-cart button
function addToCart(id){
  // console.log("addToCart(this.id) is invoked");
  var url = "handleAddToCart.php?itemID=" + id + "&updateNumber=1";
  $.get(url,function(data,status){
    var txt = "(" + data + ")";
    $("#total_item_in_shopping_cart").html(txt);
  })
}


// to change the page to the previous one
function loadPreviousPage(){

  if (parseInt(currentPageNumber) > parseInt($("#page_number").attr("min"))){
    currentPageNumber--;
    $("#page_number").attr('value', currentPageNumber);
    $("#page_number").val(currentPageNumber);

    var url = "handleItemDisplay.php?category=" + currentCategory + "&pageNumber=" + currentPageNumber;

    $.get(url, function(json, status){

      $("#items").empty();

      $("#current_category").attr('value', json.current_category);

      for (i=0; i<json.itemName.length; i++){

        var item = document.createElement("div");
        item.setAttribute("class", "item");

        var item_image = document.createElement('img');
        item_image.setAttribute("class","item_image col-3");
        item_image.setAttribute("src",json.itemImage[i]);
        item_image.setAttribute("alt","img loaded failed");

        var item_name = document.createElement('p');
        item_name.setAttribute("class","item_name");
        item_name.innerHTML = json.itemName[i];

        var item_price = document.createElement('p');
        item_price.setAttribute("class","item_price");
        item_price.innerHTML = "$" + json.itemPrice[i];

        var item_description = document.createElement('p');
        item_description.setAttribute("class","item_description");
        item_description.innerHTML = json.itemDescription[i];

        var btn = document.createElement('button');
        btn.innerHTML = "Add to Cart";
        btn.setAttribute("name", "add_button");
        btn.setAttribute("id",json.itemId[i]);
        btn.setAttribute("class","add_to_cart_btn");
        btn.setAttribute("onclick", "addToCart(this.id)");

        item.appendChild(item_image);
        var textContent = document.createElement('div');
        textContent.setAttribute('class', 'item_text_content col-4');
        textContent.appendChild(item_name);
        textContent.appendChild(item_price);
        textContent.appendChild(item_description);
        textContent.appendChild(btn);
        item.appendChild(textContent);

        document.getElementById("items").appendChild(item);
      }
    }, "json");
  } else {
    $("#page_number").attr('value', currentPageNumber);
    $("#page_number").val(currentPageNumber);
  }
}

// to change the page to the next one
function loadNextPage(){

  if (parseInt(currentPageNumber) < parseInt($("#page_number").attr("max"))){
    currentPageNumber++;
    $("#page_number").attr('value', currentPageNumber);
    $("#page_number").val(currentPageNumber);
    var url = "handleItemDisplay.php?category=" + currentCategory + "&pageNumber=" + currentPageNumber;

    $.get(url, function(json, status){

      $("#items").empty();

      $("#current_category").attr('value', json.current_category);

      for (i=0; i<json.itemName.length; i++){

        var item = document.createElement("div");
        item.setAttribute("class", "item");

        var item_image = document.createElement('img');
        item_image.setAttribute("class","item_image col-3");
        item_image.setAttribute("src",json.itemImage[i]);
        item_image.setAttribute("alt","img loaded failed");

        var item_name = document.createElement('p');
        item_name.setAttribute("class","item_name");
        item_name.innerHTML = json.itemName[i];

        var item_price = document.createElement('p');
        item_price.setAttribute("class","item_price");
        item_price.innerHTML = "$" + json.itemPrice[i];

        var item_description = document.createElement('p');
        item_description.setAttribute("class","item_description");
        item_description.innerHTML = json.itemDescription[i];

        var btn = document.createElement('button');
        btn.innerHTML = "Add to Cart";
        btn.setAttribute("name", "add_button");
        btn.setAttribute("id",json.itemId[i]);
        btn.setAttribute("class","add_to_cart_btn");
        btn.setAttribute("onclick", "addToCart(this.id)");

        item.appendChild(item_image);
        var textContent = document.createElement('div');
        textContent.setAttribute('class', 'item_text_content col-4');
        textContent.appendChild(item_name);
        textContent.appendChild(item_price);
        textContent.appendChild(item_description);
        textContent.appendChild(btn);
        item.appendChild(textContent);

        document.getElementById("items").appendChild(item);
      }
    }, "json");
  } else {
    $("#page_number").attr('value', currentPageNumber);
    $("#page_number").val(currentPageNumber);
  }

}



// load the specific page indicated by the user
function loadSpecificPage(pageNumber){

  if (parseInt(pageNumber) >= parseInt($("#page_number").attr("min")) && parseInt(pageNumber) <= parseInt($("#page_number").attr("max"))){

    currentPageNumber = pageNumber;
    // $("#page_number").val(currentPageNumber);
    $("#page_number").attr('value', currentPageNumber);
    $("#page_number").val(currentPageNumber);
    var url = "handleItemDisplay.php?category=" + currentCategory + "&pageNumber=" + currentPageNumber;
    $.get(url, function(json, status){

      $("#items").empty();

      $("#current_category").attr('value', json.current_category);

      for (i=0; i<json.itemName.length; i++){

        var item = document.createElement("div");
        item.setAttribute("class", "item");

        var item_image = document.createElement('img');
        item_image.setAttribute("class","item_image col-3");
        item_image.setAttribute("src",json.itemImage[i]);
        item_image.setAttribute("alt","img loaded failed");

        var item_name = document.createElement('p');
        item_name.setAttribute("class","item_name");
        item_name.innerHTML = json.itemName[i];

        var item_price = document.createElement('p');
        item_price.setAttribute("class","item_price");
        item_price.innerHTML = "$" + json.itemPrice[i];

        var item_description = document.createElement('p');
        item_description.setAttribute("class","item_description");
        item_description.innerHTML = json.itemDescription[i];

        var btn = document.createElement('button');
        btn.innerHTML = "Add to Cart";
        btn.setAttribute("name", "add_button");
        btn.setAttribute("id",json.itemId[i]);
        btn.setAttribute("class","add_to_cart_btn");
        btn.setAttribute("onclick", "addToCart(this.id)");

        item.appendChild(item_image);
        var textContent = document.createElement('div');
        textContent.setAttribute('class', 'item_text_content col-4');
        textContent.appendChild(item_name);
        textContent.appendChild(item_price);
        textContent.appendChild(item_description);
        textContent.appendChild(btn);
        item.appendChild(textContent);

        document.getElementById("items").appendChild(item);
      }
    }, "json");
  } else {
    $("#page_number").attr('value', currentPageNumber);
    $("#page_number").val(currentPageNumber);
  }

}


// when user click the shopping cart button, the information of the shopping cart will be shown
function showShoppingCart() {

    // console.log("showShoppingCart() is invoked");

    $.get("handleCartContent.php", function(json, status){

      // to remove items on previous page
      if (document.body.contains(document.getElementsByClassName("category_list_and_items")[0])){
        var elem_1 = document.getElementsByClassName("category_list_and_items");
        elem_1[0].parentNode.removeChild(elem_1[0]);
        var elem_2 = document.getElementsByClassName("page_change_section");
        elem_2[0].parentNode.removeChild(elem_2[0]);
      }
      if (document.body.contains(document.getElementsByClassName("shopping_cart_item_list col-11")[0])){
        var elem = document.getElementsByClassName("shopping_cart_item_list col-11");
        elem[0].parentNode.removeChild(elem[0]);
      }

      if (document.body.contains(document.getElementById("shopping_cart_header"))){
        var elem = document.getElementById("shopping_cart_header");
        elem.parentNode.removeChild(elem);
      }
      if (document.body.contains(document.getElementById("shopping_cart_footer"))){
        var elem = document.getElementById("shopping_cart_footer");
        elem.parentNode.removeChild(elem);
      }

      // create a header
      var shoppingCartHeader = document.createElement('div');
      shoppingCartHeader.setAttribute('id','shopping_cart_header');

      var shoppingCart = document.createElement('h2');
      shoppingCart.innerHTML = "Shopping cart";


      shoppingCartHeader.appendChild(shoppingCart);
      document.body.appendChild(shoppingCartHeader);


      if (json["itemId"].length==0){
        var reminder = document.createElement('p');
        reminder.setAttribute('id','reminder_text');
        reminder.innerHTML = "Your shopping cart is empty.";
        var backToMainPage = document.createElement('a');
        backToMainPage.setAttribute('href', 'index.html');
        backToMainPage.setAttribute('id', 'reminder_link');
        backToMainPage.innerHTML = "Back to shopping >";
        document.getElementById("shopping_cart_header").appendChild(reminder);
        document.getElementById("shopping_cart_header").appendChild(backToMainPage);
      } else {
        var items = document.createElement('div');
        items.setAttribute('class', 'shopping_cart_item_list col-11');
        for (var i = 0; i < json["itemId"].length; i++) {
          var item = document.createElement('div');
          item.setAttribute('id',json.itemId[i]);
          item.setAttribute('quantity',json.itemQuantity[i]);
          item.setAttribute("class","shopping_cart_item col-12");

          var itemImage = document.createElement('img');
          itemImage.setAttribute('class','item_image col-3');
          itemImage.setAttribute('src',json.itemImage[i]);
          itemImage.setAttribute('alt','shopping_cart_item_image failed');

          var itemTextContent = document.createElement('div');
          itemTextContent.setAttribute("class", "item_text_content col-4");

          var itemName = document.createElement('div');
          itemName.setAttribute('class','shopping_cart_item_name');
          itemName.innerHTML = json.itemName[i];

          var itemDescription = document.createElement('div');
          itemDescription.setAttribute('class','shopping_cart_item_description');
          itemDescription.innerHTML = json.itemDescription[i];

          var itemPrice = document.createElement('div');
          itemPrice.setAttribute('class','shopping_cart_item_price');
          itemPrice.innerHTML = json.itemPrice[i];


          var itemQuantity = document.createElement('input');
          itemQuantity.setAttribute('class','shopping_cart_item_quantity');
          itemQuantity.setAttribute('type','number');
          itemQuantity.setAttribute('value',json.itemQuantity[i]);
          itemQuantity.setAttribute('onchange','changeOnQuantity(this)');

          item.appendChild(itemImage);

          itemTextContent.appendChild(itemName);
          itemTextContent.appendChild(itemDescription);
          itemTextContent.appendChild(itemPrice);
          itemTextContent.appendChild(itemQuantity);

          item.appendChild(itemTextContent);

          items.appendChild(item);
        }
        document.body.appendChild(items);

        var shoppingCartFooter = document.createElement('div');
        shoppingCartFooter.setAttribute("id","shopping_cart_footer");

        var cartState = document.createElement('p');
        cartState.innerHTML = "Cart subtotal (" + json.total_number_of_items_in_shopping_cart + " item(s)): $" + json.total_price_of_items_in_shopping_cart;
        cartState.setAttribute('id','cartState');
        cartState.setAttribute('total_number', json.total_number_of_items_in_shopping_cart);
        cartState.setAttribute('total_price', json.total_price_of_items_in_shopping_cart);

        var proceedToCheckOutButton = document.createElement('button');
        var t = document.createTextNode("proceed to check out");
        proceedToCheckOutButton.appendChild(t);
        proceedToCheckOutButton.setAttribute('onclick', 'handleProceedToCheckOut()');

        shoppingCartFooter.appendChild(cartState);
        shoppingCartFooter.appendChild(proceedToCheckOutButton);
        document.body.appendChild(shoppingCartFooter);
      }
    }, "json");
}

// when user cahnge the quantity of an item in the shopping cart, udate the changing information to hte server
function changeOnQuantity(elem){

  // console.log("changeOnQuantity(this) is invoked");

  var oldValue = elem.parentNode.parentNode.getAttribute("quantity");
  var newValue = elem.value;

  var amountOfChange = newValue - oldValue;
  var itemID = elem.parentNode.parentNode.getAttribute("id");

  var url = "handleAddToCart.php?itemID=" + itemID + "&updateNumber=" + amountOfChange;
  $.get(url, function(data, status){
    var txt = "(" + data + ")";
    $("#total_item_in_shopping_cart").html(txt);
    showShoppingCart();
    $(".shopping_cart_item_quantity").blur();
  });

}


// when user check out from his shopping cart, clear the items in the shopping cart can go to the purchasing summary
function handleProceedToCheckOut(){
  // console.log("handleProceedToCheckOut() is invoked!");

  var total_price_of_items_in_shopping_cart = $("#cartState").attr("total_price");
  var total_number_of_items_in_shopping_cart = $("#cartState").attr("total_number");

  $.get("handleAddToCart.php?itemID=-1&updateNumber=0", function(data, status){
    if (document.body.contains(document.getElementsByClassName("shopping_cart_item_list col-11")[0])){
      var elem = document.getElementsByClassName("shopping_cart_item_list col-11");
      elem[0].parentNode.removeChild(elem[0]);
    }

    if (document.body.contains(document.getElementById("shopping_cart_footer"))){
      var elem = document.getElementById("shopping_cart_footer");
      elem.parentNode.removeChild(elem);
    }

    document.getElementById("total_item_in_shopping_cart").innerHTML = "(" + data + ")";

    var shoppingSummary = document.createElement('p');
    shoppingSummary.innerHTML = "You have successfully placed order for " + total_number_of_items_in_shopping_cart + " item(s)<br><br> $" + total_price_of_items_in_shopping_cart + " paid";
    shoppingSummary.setAttribute('id', 'payment_summary');

    var backToMainPage = document.createElement('a');
    backToMainPage.innerHTML = "continue browsing >";
    backToMainPage.setAttribute("href","index.html");
    backToMainPage.setAttribute("id", "back_to_main_page");

    document.body.appendChild(shoppingSummary);
    document.body.appendChild(backToMainPage);
  });
}
