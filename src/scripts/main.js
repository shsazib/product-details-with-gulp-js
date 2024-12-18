(function () {
  "use strict";

  // Elements
  const modal = document.getElementById("modal");
  const checkoutBtn = document.getElementById("checkout-btn");
  const closeModal = document.getElementById("close-modal");
  const body = document.body;
  const colorOptions = document.getElementById("colorOptions");
  const sizeContainer = document.getElementById("sizeContainer");
  const decrementButton = document.getElementById("decrementButton");
  const incrementButton = document.getElementById("incrementButton");
  const counterValue = document.getElementById("counterValue");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const cartCountEl = document.getElementById("cart-count");
  const productImage = document.getElementById("productImage");
  const toastContainer = document.getElementById("toast-container");

  // Table Elements
  const productTableBody = document.querySelector(".checkout-table tbody");
  const totalQuantityElem = document.getElementById("total-quantity");
  const totalPriceElem = document.getElementById("total-price");

  // Default Values
  const imagePaths = {
    purple: "images/product-image-1.webp",
    cyan: "images/product-image-2.webp",
    blue: "images/product-image-3.webp",
    black: "images/product-image-4.webp",
  };

  const borderColors = {
    purple: "#816BFF",
    cyan: "#1FCEC9",
    blue: "#4B97D3",
    black: "#3B4747",
  };

  const sizePrices = {
    S: 69,
    M: 79,
    L: 89,
    XL: 99,
  };

  let count = 1;
  let selectedColor = "purple";
  let selectedSize = "S";
  let cartCount = 0;

  // Initialize the page with default settings
  const initPage = () => {
    setProductImage(selectedColor);
    setColorBorders(selectedColor);
    toggleEmptyCartMessage(); // Initial check for empty cart
  };

  const setProductImage = (color) => {
    productImage.src = imagePaths[color];
  };

  const setColorBorders = (color) => {
    colorOptions.querySelectorAll("[data-color]").forEach((option) => {
      option.style.borderColor = "";
    });
    const selectedColorElement = colorOptions.querySelector(`[data-color="${color}"]`);
    selectedColorElement.style.borderColor = borderColors[color];
  };

  const handleSizeSelection = (sizeElement) => {
    sizeContainer.querySelectorAll("div").forEach((div) => {
      div.classList.remove("border-primary", "text-primary");
      div.classList.add("border-border", "text-dark");
    });
    sizeElement.classList.add("border-primary", "text-primary");
    sizeElement.classList.remove("border-border", "text-dark");
    selectedSize = sizeElement.querySelector("span:nth-child(1)").innerText;
  };

  const handleColorSelection = (color) => {
    selectedColor = color;
    setProductImage(color);
    setColorBorders(color);
  };

  // Event listeners for checkout modal
  checkoutBtn.addEventListener("click", () => toggleModal(true));
  closeModal.addEventListener("click", () => toggleModal(false));
  modal.addEventListener("click", (e) => e.target === modal && toggleModal(false));

  // Event listeners for color and size selection
  colorOptions.addEventListener("click", (e) => {
    const selectedColorElement = e.target.closest("[data-color]");
    if (selectedColorElement) {
      handleColorSelection(selectedColorElement.getAttribute("data-color"));
    }
  });

  sizeContainer.addEventListener("click", (e) => {
    const target = e.target.closest("div");
    if (target) handleSizeSelection(target);
  });

  // Counter buttons
  decrementButton.addEventListener("click", () => {
    if (count > 1) {
      count--;
      counterValue.innerText = count;
    }
  });

  incrementButton.addEventListener("click", () => {
    count++;
    counterValue.innerText = count;
  });

  const calculateTotalCartItems = () => {
    const rows = productTableBody.querySelectorAll("tr:not(:last-child)");
    return rows.length;
  };

  const toggleEmptyCartMessage = () => {
    const emptyCartMessage = document.getElementById("empty-cart");
    const checkoutContent = document.querySelector(".checkout-content");

    const cartItems = productTableBody.querySelectorAll("tr:not(:last-child)");

    if (cartItems.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      checkoutContent.classList.add("hidden");
    } else {
      emptyCartMessage.classList.add("hidden");
      checkoutContent.classList.remove("hidden");
    }
  };

  const clearCart = () => {
    productTableBody.querySelectorAll("tr:not(:last-child)").forEach((row) => row.remove());
    cartCount = 0;
    cartCountEl.textContent = cartCount;
    updateTotal();
    toggleEmptyCartMessage();
  };

  const insertIntoTable = () => {
    const existingRows = Array.from(productTableBody.querySelectorAll("tr:not(:last-child)"));
    const duplicateRow = existingRows.find((row) => {
      const colorCell = row.querySelector("td:nth-child(2)");
      const sizeCell = row.querySelector("td:nth-child(3)");

      return (
        colorCell.innerText === selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) &&
        sizeCell.innerText === selectedSize
      );
    });

    if (duplicateRow) {
      const quantityCell = duplicateRow.querySelector("td:nth-child(4)");
      const priceCell = duplicateRow.querySelector("td:nth-child(5)");

      const currentQuantity = parseInt(quantityCell.innerText);
      const newQuantity = currentQuantity + count;
      quantityCell.innerText = newQuantity;

      const itemPrice = sizePrices[selectedSize] * newQuantity;
      priceCell.innerText = `$${itemPrice.toFixed(2)}`;

      cartCount = calculateTotalCartItems();
      cartCountEl.textContent = cartCount;
    } else {
      const row = document.createElement("tr");
      const itemPrice = sizePrices[selectedSize] * count;

      row.innerHTML = `
        <td class="flex items-center gap-2">
          <img src="${imagePaths[selectedColor]}" alt="Product Image" class="w-9 h-9 rounded">
          <p>Classy Modern Smartwatch</p>
        </td>
        <td>${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</td>
        <td class="font-bold">${selectedSize}</td>
        <td class="font-bold">${count}</td>
        <td class="font-bold">$${itemPrice.toFixed(2)}</td>
      `;

      productTableBody.insertBefore(row, productTableBody.querySelector("tr:last-child"));
      cartCount = calculateTotalCartItems();
      cartCountEl.textContent = cartCount;
    }

    updateTotal();
    toggleEmptyCartMessage();
  };

  const updateTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    productTableBody.querySelectorAll("tr:not(:last-child)").forEach((row) => {
      const quantityCell = row.querySelector("td:nth-child(4)");
      const priceCell = row.querySelector("td:nth-child(5)");

      const quantity = parseInt(quantityCell.innerText);
      const price = parseFloat(priceCell.innerText.replace("$", ""));

      if (!isNaN(quantity) && !isNaN(price)) {
        totalQuantity += quantity;
        totalPrice += price;
      }
    });

    totalQuantityElem.innerText = totalQuantity;
    totalPriceElem.innerText = `$${totalPrice.toFixed(2)}`;
  };

  addToCartBtn.addEventListener("click", () => {
    if (!selectedSize) {
      alert("Please select a size.");
    } else {
      insertIntoTable();
      showToast();
    }
  });

  const toggleModal = (show) => {
    modal.classList.toggle("hidden", !show);
    body.classList.toggle("overflow-hidden", show);
  };

  const showToast = () => {
    const toast = document.createElement("div");
    toast.className = "bg-green-500 text-white px-6 py-3 rounded shadow-lg transition transform opacity-0 translate-y-4";
    toast.innerText = "Item added to cart successfully!";
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-y-4");
      toast.classList.add("opacity-100", "translate-y-0");
    }, 10);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-4");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Initialize page on load
  initPage();

})();
