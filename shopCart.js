let htmlIconCart = document.querySelector(".cart-icon");
let closingCartBtn = document.querySelector(".closeBtn");
let htmlBody = document.querySelector("body");
let listProductHTml = document.querySelector(".product-List");
let htmlSpanTag = document.querySelector(".iconIncrease");
let listCartHtml = document.querySelector(".listCart");
let spanIconCart = document.querySelector(".cart-icon span");

let carts = [];
let productList = [];

htmlIconCart.addEventListener("click", () => {
  htmlBody.classList.toggle("showCart");
});

closingCartBtn.addEventListener("click", () => {
  htmlBody.classList.toggle("showCart");
});

listProductHTml.addEventListener("click", (evt) => {
  let positionClick = evt.target;
  if (positionClick.classList.contains("cartBtn")) {
    let product_id = positionClick.parentElement.dataset.id;

    addToCart(product_id);
  }
});

listCartHtml.addEventListener("click", (e) => {
  let positionClick = e.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => (value.product_id == product_id)
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;
      default:
        let valueChnage = carts[positionItemInCart].quantity - 1;
        if (valueChnage > 0) {
          carts[positionItemInCart].quantity = valueChnage;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToMemory();
  addCartToHtml();
};

const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );

  if (positionThisProductInCart === -1) { // Product not found in cart
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity += 1; // Increment quantity if found
  }

  addCartToHtml();
  addCartToMemory();
  console.log(carts);
};

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};
const addCartToHtml = () => {
  listCartHtml.innerHTML = " ";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = productList.findIndex(
        (value) => value.id == cart.product_id
      );

      if (positionProduct !== -1) { // Check if a matching product was found
        let info = productList[positionProduct];
        newCart.innerHTML = `
          <div class="image">
            <img src="${info.image}" alt="">
          </div>
          <div class="productName">
            ${info.name}
          </div>
          <div class="totalPrice">
            ${info.price}
          </div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity * cart.quantity}</span>
            <span class="plus">></span>
          </div>`;
        listCartHtml.appendChild(newCart);
      } else {
        // Handle the case where the product is not found in productList
        console.warn(`Product with ID ${cart.product_id} not found in productList`);
        // You might want to display a message to the user or skip adding this cart item
      }
    });
  }
  spanIconCart.innerHTML = totalQuantity;
};
const addDataContentToHtml = () => {
  listProductHTml.innerHTML = "";
  if (productList.length > 0) {
    productList.forEach((product) => {
      let newProducts = document.createElement("div");
      newProducts.classList.add("item");
      newProducts.dataset.id = product.id;
      newProducts.innerHTML = `
      <img src="${product.image}" alt="Image of ${product.name}">
      <h2>${product.name}</h2>
      <div class="productPrice">R${product.price}</div>
      <button class="cartBtn" type="button" aria-label="Add ${product.name} to cart">Add to Cart</button>
    `;

      listProductHTml.appendChild(newProducts);
    });
  }
};
const initApp = async () => {
  try {
    const response = await fetch("productItems.json");
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    productList = data;
    console.log(productList);
    addDataContentToHtml();

    //* get cart from memory
    if (localStorage.clear("cart")) {
      carts = JSON.parse(localStorage.getItem("cart"));

      addCartToHtml();
    }
  } catch (err) {
    console.log(err);
  }
};
initApp();
