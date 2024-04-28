let apiKeys = [
  "sk-DbWJ65c9a8ece67b83440",
  "sk-WibS65c7514f064cf3637",
  "sk-zC6q65c75117e99ec3938",
  "sk-CyhK65c750dfed5393940",
  "sk-fmhg65c750878c2833939",
  "sk-A6Bl65c7503dc69324096",
  "sk-Yscb65c74ff24be6f4097",
  "sk-g2ky65cddbd2b47114169",
  "sk-XQZr65cddca5381424170",
  "sk-7tR965cddd41e0ada4171",
  "sk-6Yt365cdddd4523b84172",
  "sk-YGxI65cdde53422c84173",
  "sk-ScwZ65cddeb9c26184174",
  "sk-0KWt65cddf220ead34175",
  "sk-o9vI65cddfeb8f2084176",
  "sk-15aZ65cde05ba8b0c4177",
  "sk-VZxr65cde0dc22e1d4178",
  "sk-EyK965cf2d363e4ce4205",
  "sk-YSQI65cf2da213a8a4206",
  "sk-zuOg65cf2e10b2be04207",
  "sk-dbev65cf2ee09ece74208",
  "sk-2ahk65cf2f907b59e4209",
  "sk-JgVw65cde1b5b24d34179",
  "sk-iH5y65cde261764634180",
  "sk-wezA65cde2d9c2cd54181",
  "sk-S7JX65cde3195612a4182",
  "sk-azYu65cde34f283864183",
  "sk-17vF65cde3b47a4754184",
  "sk-JgFW65cde5cacede74185",
  "sk-oBAy65cf3035184724210",
  "sk-IA5h65cf30958b6784211",
  "sk-ECMq65cf30d908f814212",
  "sk-Jpvn6609978f2def14926",
  "sk-yPsu660998580d4db4927",
  "sk-Vb5r660999080ff3f4929",
  "sk-h2Rr66099974c01344930",
  "sk-tPDA66099a1c8879d4931",
  "sk-UA7Y66099a8331b444932",
  "sk-noeE66099afd952a34933",
  "sk-dZlr66099b7b99f0b4935",
  "sk-bjmP66099bdbb18e24936",
  "sk-y8Ei66099c4f020334937",
  "sk-FwkD66099cb0e65294938",
  "sk-Bmqk66099d079857f4939",
  "sk-BZzG66099d59b76ca4940",
  "sk-1SLR66099e33ada4f4941",
  "sk-uwLB66099ec470ddb4942",
  "sk-GrdJ66099f2acc3ac4943",
  "sk-pqO066099f7c78eae4944",
  "sk-AXqK66099fd43d46d4945",
  "sk-fJWc6609a01bd55b04946",
];

let currentKeyIndex = 0;
let cost;
let api = "https://perenual.com/api/species-care-guide-list?key=";
let url1 = "https://perenual.com/api/species/details/";
let url2 = "?key=";

async function makeApiCall(query) {
  console.log(currentKeyIndex);
  let apiKey = apiKeys[currentKeyIndex];
  let apiUrl = `${api}${apiKey}&q=${query}`;
  let url2Dynamic = `${url2}${apiKey}`;

  try {
    let response = await fetch(apiUrl);

    if (response.status === 429) {
      // Handle 429 error by switching to the next key in the array
      currentKeyIndex = currentKeyIndex + 1;
      console.log("error429");
      return makeApiCall(query); // Retry with the new key
    }

    let data = await response.json();

    return { data, url2Dynamic };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getapi() {
  let pname = document.getElementById("pname").value;

  try {
    let { data, url2Dynamic } = await makeApiCall(pname);

    if (data.data.length !== 0) {
      displayPlantCards(data.data, url2Dynamic);
    } else {
      loader = document.getElementById("preloader");
      loader.style.display = "none";
      openModall();
    }
  } catch (error) {
    console.error("API call failed:", error);
  }
}

// The displayPlantCards function and other utility functions go here...

function displayPlantCards(plantData, url2Dynamic) {
  let plantCardsContainer = document.getElementById("plantCardsContainer");
  plantCardsContainer.innerHTML = "";

  plantData.forEach(async function (plant) {
    let v = url1 + plant.species_id + url2Dynamic;
    let response2 = await fetch(v);
    let data2 = await response2.json();
    let randomPrice = generateConstantPrice(plant.species_id);

    let card = document.createElement("div");
    card.classList.add("card");

    let image = document.createElement("img");
    image.src = data2.default_image.original_url;
    image.alt = plant.common_name;
    image.id = "image";
    image.class = "images";
    image.onclick = function () {
      bodystyle = document.body.style;
      bodystyle.overflow = "hidden";

      var modalContent = `
      
  <div class="plant-container" style="display: flex;
  align-items: center;
  max-width: 100%;
  height: 100%; /* Adjust the height to your desired value */
  margin:0;
  padding:0;
  background-color: #fff;
  justify-content: space-between;
  font-family: "Poppins", sans-serif;
  border-radius: 10px;
 ">
  <div class="plant-image">
    <img src="${
      data2.default_image.original_url
    }" alt="" class="p-image" style="width:490px;height:700px;
    border-radius: 10px 10px 10px 10px;margin-left:5px" />
  </div>
  <div class="sep" style="width: 100%;
  margin-top: -30px;">
    <div class="plant-details" style="padding: 20px;">
      <p>
        <strong >Common Name:</strong> <span class="p-common-name" style="
        color: #333;">${capitalizeFirstLetter(plant.common_name)}</span>
      </p>
      <p>
        <strong>Scientific Name:</strong>
        <span class="p-scientific-name" style="
        color: #333;">${plant.scientific_name}</span>
      </p>
      <p>
        <strong>Description:</strong> <span class="p-description" style=" margin-top: 10px;
        color: #333;">${data2.description}</span>
      </p>
    </div>
    <div class="ic" style="margin-top: -10px;">
    <span style="color: Dodgerblue;">
      <i class="fa-solid fa-droplet fa-2x" id="p-water" style="margin-left: 20px;
      margin-right: 20px;
      margin-top: 0px;color:dodgerblue;"  title="${data2.watering}"></i></span>
      <span style="color: red;">
      <i class="fa-solid fa-heart fa-2x " id="p-care" style="margin-left: 20px;
      margin-right: 20px;
      margin-top: 0px;color:red" title="${changetitle(
        data2.care_level
      )}"></i><span>
      <span style="color: yellow;">
      <i class="fa-solid fa-sun fa-2x" id="p-sun" style="margin-left: 20px;
        margin-right: 20px;
        margin-top: 0px;color: yellow;" title="${capitalizeFirstLetter(
          data2.sunlight[0]
        )}"></i>
    </span>
    
    </div>
    <div class="li" style="display: flex;
    gap: 15px;
    margin-left: 20px;">
      <div>
        <p><strong>Type:</strong> <span id="p-type" style="color: #333;">${capitalizeFirstLetter(
          data2.type
        )}</span></p>
      </div>
      <div>
      ${
        data2.fruits
          ? `<p><strong>Fruits:</strong> <span id="p-fruits" style="color: #333;">Fruits</span></p>`
          : `<p><strong>Fruits:</strong> <span id="p-fruits" style="color: #333;">No Fruits</span></p>`
      }
      </div>
      <div>
        <p><strong>Growth Level:</strong> <span id="p-growth" style="color: #333;">${
          data2.growth_rate
        }</span></p>
      </div>
      <div>
      ${
        data2.fruits
          ? `<p><strong>Indoor:</strong> <span id="p-indoor" style="color: #333;">Indoor</span></p>`
          : `<p><strong>Indoor:</strong> <span id="p-indoor" style="color: #333;">Outdoor</span></p>`
      }
      </div>
    </div>
    <div class="last" style="margin-left: 20px;">
      <p><strong>Watering:</strong> <span id="p-watering" style="color: #333;">${
        plant.section[0].description
      }</span></p>
      <p><strong>Sunlight:</strong> <span id="p-sunlight" style="color: #333;">${
        plant.section[1].description
      }</span></p>
      <p><strong>Pruning:</strong></strong> <span id="p-pruning" style="color: #333;">${
        plant.section[2].description
      }</span></p>
    </div>
    <div class="price-buy-now" style="margin-left: 20px;">
      <p><strong>Price:</strong> <span id="p-price" style="color: #333;">₹${randomPrice}</span></p>
      <button class="buy-now button" style="border: none;background-color: lightgreen;
      border-radius: 24px;
      padding: 11px 16px 11px 16px;
       position:absolute;bottom:10px;right:120px;cursor:pointer" onclick="buyNow()">Buy Now</button>
      <button class="add-to-cart-button" style="background-color: lightgreen;
      border: none;
      border-radius: 24px;
      padding: 10px;
      position:absolute;bottom:10px;right:10px;cursor:pointer" onclick="addToCart('${
        plant.common_name
      }', '${data2.default_image.original_url}', ${generateConstantPrice(
        plant.species_id
      )}, '${
        data2.indoor ? "Indoor Plant" : "Outdoor Plant"
      }')">Add To Cart</button>

    </div>
  </div>
</div>
 
`;
      openModal(modalContent);
    };

    let details = document.createElement("div");
    details.classList.add("details");
    details.style.cssText = "margin-top:10px;";

    let desc = document.createElement("span");
    let change = capitalizeFirstLetter(plant.common_name);
    desc.innerText = change;
    desc.style.cssText = "font-size:20px; margin-left:15px;color:black;";

    let categoryParagraph = document.createElement("p");
    categoryParagraph.innerText = "Category: ";
    categoryParagraph.style.cssText = "margin-left:15px;color:black;";
    let categorySpan = document.createElement("span");
    categorySpan.style.cssText = "color:black;";

    if (data2.indoor) {
      categorySpan.innerText = "Indoor Plant";
    } else {
      categorySpan.innerText = "Outdoor Plant";
    }
    categoryParagraph.appendChild(categorySpan);
    let addToCartButton = document.createElement("button");
    addToCartButton.innerText = "Add to Cart";
    addToCartButton.className = "add-to-cart-button";
    addToCartButton.style.cssText =
      "border-radius:24px;padding:11px 16px 11px 16px;border:none;background-color:lightgreen;position:absolute;right:10px;bottom:10px;cursor:pointer;";
    addToCartButton.addEventListener("click", function () {
      // Add your logic for adding to cart here
      // Example: addToCart(plant);
      showCartModal();
    });
    //details.appendChild(categoryParagraph);
    let priceParagraph = document.createElement("p");
    priceParagraph.innerText = "Price: ₹" + randomPrice;
    priceParagraph.style.cssText = "margin-left:15px;color:black;";
    // New div for Buy Now and Add to Cart buttons
    cost = randomPrice;
    card.appendChild(image);
    card.appendChild(desc);
    card.appendChild(categoryParagraph);
    card.appendChild(priceParagraph);
    card.appendChild(addToCartButton);
    //details.appendChild(desc);

    //card.appendChild(details);

    plantCardsContainer.appendChild(card);
    addToCartButton.addEventListener("click", function () {
      // Add your logic for adding to cart here
      // Example: addToCart(plant);
      var itemName = capitalizeFirstLetter(plant.common_name);
      var itemImage = data2.default_image.original_url;
      var itemPrice = randomPrice;
      var itemcategory = categorySpan.innerText;

      // Create an object with dynamic item details
      var newItem = {
        name: itemName,
        image: itemImage,
        price: itemPrice,
        category: itemcategory,
      };

      // Retrieve existing items from local storage or create an empty array
      var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      // Add the new item to the array
      cartItems.push(newItem);

      // Save the updated array back to local storage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      showCartModal();
      console.log(cartItems);
    });
  });
}
function capitalizeFirstLetter(str) {
  // Split the string into an array of words
  let words = str.split(" ");

  // Capitalize the first letter of each word
  let capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the words back into a string
  let result = capitalizedWords.join(" ");

  return result;
}
function generateConstantPrice(plantId) {
  // You can implement your logic to generate a constant price here
  // For now, using a simple random number based on plantId
  return (plantId % 100) + 500;
}
// Function to open modal with content
function openModal(content) {
  var modal = document.getElementById("modal");
  var modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = content;
  modal.style.display = "block";
}

// Function to close modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
  document.body.style.overflow = "scroll";
}
function showCartModal() {
  var cartModal = document.getElementById("cartModal");
  cartModal.style.display = "block";
  cartModal.style.zIndex = "200";

  setTimeout(function () {
    closeCartModal();
  }, 2500);
}
function closeCartModal() {
  var cartModal = document.getElementById("cartModal");
  cartModal.style.display = "none";
}
function buyNow() {
  setTimeout(function () {
    window.location.href = "http://localhost:4500/billing";
  }, 2000);
}
function openModall() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}
function closeplantModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  window.location.href = "http://localhost:4500";
}
function addToCart(itemName, itemImage, itemPrice, itemCategory) {
  var newItem = {
    name: capitalizeFirstLetter(itemName),
    image: itemImage,
    price: itemPrice,
    category: itemCategory,
  };

  var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems.push(newItem);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  showCartModal();
}
function changetitle(value) {
  if (value == null) {
    value = "Average";
    return value;
  } else if (value == undefined) {
    value = "Average";
    return value;
  } else {
    return value;
  }
}
