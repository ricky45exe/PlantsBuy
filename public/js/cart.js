var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
console.log(cartItems);

// Function to remove an item from the cart
function removeItem(index) {
  cartItems.splice(index, 1);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  displayCartItems();
}

// Display items in the cart
function displayCartItems() {
  var cartContainer = document.getElementById("cartItems");
  var summaryItemsCount = document.getElementById("summaryItemsCount");
  var summaryTotalPrice = document.getElementById("summaryTotalPrice");
  var totalPrice = document.getElementById("totalPrice");
  var summary = document.getElementsByClassName("summary");

  cartContainer.innerHTML = "";
  summaryItemsCount.textContent = "0";
  summaryTotalPrice.textContent = "0.00";
  totalPrice.textContent = "0.00";
  let tprice = 0;
  var headDiv = document.createElement("div");
  headDiv.className = "head-item";

  headDiv.innerHTML =
    '<div class="headitem-div">' +
    '<div class="head-p">' +
    "<p><strong>Shopping Cart" +
    "</strong></p>" +
    "</div>" +
    '<div class="item-v"><strong><span class="itemv">' +
    cartItems.length +
    "</span>" +
    "<span> Items</span></strong>" +
    "</div>" +
    "</div>";
  cartContainer.appendChild(headDiv);
  if (cartItems.length === 0) {
    cartContainer.innerHTML =
      '<div class="cartheader"><p>Your cart is empty.</p></div>';
  } else {
    cartItems.forEach(function (item, index) {
      item.quantity = 1;
      var itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";

      itemDiv.innerHTML =
        '<div class="item-image">' +
        '<img src="' +
        item.image +
        '" alt="' +
        item.name +
        '">' +
        "</div>" +
        '<div class="item-details">' +
        "<p><strong>" +
        item.name +
        "</strong></p>" +
        "<p>" +
        item.category +
        "</p>" +
        "</div>" +
        '<div class="quantity">' +
        "<button class='minus' aria-label='Decrease' onclick='decreaseValue(" +
        index +
        ")'>-</button>" +
        ' <input type="number" class="input-box" value="' +
        item.quantity +
        '" min="1" max="10" />' +
        "<button class='plus' aria-label='Increase' onclick='increaseValue(" +
        index +
        ")'>+</button>" +
        "</div>" +
        '<div class="price">₹' +
        item.price +
        "</div>" +
        '<div class="remove-button">' +
        '<button class="remove-button" onclick="removeItem(' +
        index +
        ')">&#10005;</button>' +
        "</div>";
      headDiv.appendChild(itemDiv);
      tprice = tprice + item.price;
      summaryItemsCount.textContent = parseInt(cartItems.length);
      summaryTotalPrice.textContent = parseInt(tprice);
      totalPrice.textContent = parseInt(50 + tprice);
      console.log(item.price, item.quantity);

      (function () {
        const quantityContainer = itemDiv.querySelector(".quantity");
        const minusBtn = quantityContainer.querySelector(".minus");
        const plusBtn = quantityContainer.querySelector(".plus");
        const inputBox = quantityContainer.querySelector(".input-box");
        const priceElement = itemDiv.querySelector(".price");
        const itemv = document.querySelector(".itemv");

        updateButtonStates();

        quantityContainer.addEventListener("click", handleButtonClick);
        inputBox.addEventListener("input", handleQuantityChange);

        function updateButtonStates() {
          const value = parseInt(inputBox.value);
          minusBtn.disabled = value <= 1;
          plusBtn.disabled = value >= parseInt(inputBox.max);
        }

        function handleButtonClick(event) {
          if (event.target.classList.contains("minus")) {
            decreaseValue();
          } else if (event.target.classList.contains("plus")) {
            increaseValue();
          }
        }

        function decreaseValue() {
          let value = parseInt(inputBox.value);
          value = isNaN(value) ? 1 : Math.max(value - 1, 1);
          inputBox.value = value;
          const newPrice = value * item.price;
          priceElement.textContent = newPrice;
          updateButtonStates();
          handleQuantityChange();

          item.quantity = value;

          summaryItemsCount.textContent = String(
            parseInt(summaryItemsCount.textContent) - 1
          );
          itemv.textContent = String(parseInt(summaryItemsCount.textContent));

          updateTotalPrice();
          var inputField = document.getElementById("code");
          inputField.value = ""; // Clear the input field
          inputField.placeholder = "Enter Coupon Code";
          let applyButton = document.querySelector(".Apply");

          if (applyButton) {
            applyButton.disabled = false;
          }
        }

        function increaseValue() {
          let value = parseInt(inputBox.value);
          value = isNaN(value) ? 1 : Math.min(value + 1, 10); // Assuming a maximum quantity of 10
          inputBox.value = value;
          const newPrice = value * item.price;
          priceElement.textContent = newPrice;
          updateButtonStates();
          handleQuantityChange();

          item.quantity = value;

          // Update the total count of unique items
          summaryItemsCount.textContent = String(
            parseInt(summaryItemsCount.textContent) + 1
          );
          itemv.textContent = String(parseInt(summaryItemsCount.textContent));
          updateTotalPrice();
          var inputField = document.getElementById("code");
          inputField.value = ""; // Clear the input field
          inputField.placeholder = "Enter Coupon Code";
          let applyButton = document.querySelector(".Apply");

          if (applyButton) {
            applyButton.disabled = false;
          }
        }
        function updateTotalPrice() {
          // Recalculate the total price of the cart after updating quantities
          let totalItemsPrice = 0;

          cartItems.forEach(function (item) {
            // alert(item.price);
            // alert(item.quantity);
            console.log(item.price, item.quantity);

            // Check if item.quantity is defined before using it
            const quantity = item.quantity || 0;

            const itemTotalPrice = parseFloat(item.price) * parseInt(quantity);

            if (!isNaN(itemTotalPrice) && isFinite(itemTotalPrice)) {
              totalItemsPrice += itemTotalPrice;
            }
          });

          if (!isNaN(totalItemsPrice) && isFinite(totalItemsPrice)) {
            summaryTotalPrice.textContent = totalItemsPrice;
            totalPrice.textContent = totalItemsPrice + 50;
          }
        }

        function handleQuantityChange() {
          let value = parseInt(inputBox.value);
          value = isNaN(value) ? 1 : value;
          priceElement.textContent = "₹" + value * item.price;

          // Execute your code here based on the updated quantity value
          console.log("Quantity changed:", value);
          updateTotalPrice();
        }
      })();
    });
  }
}
function applyCoupon() {
  let code = document.getElementById("code").value;
  if (code == "new100") {
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = totalPrice.textContent - 100;
    let applyButton = document.querySelector(".Apply");

    if (applyButton) {
      applyButton.disabled = true;
    }
  } else {
    if (applyButton) {
      applyButton.disabled = true;
    }
  }
}
displayCartItems();
