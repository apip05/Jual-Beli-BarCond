// toggle class active hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
//ketika hamburger menu diklik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// toggle class active search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};
// toggle class aktive untuk shopping cart

const shoppingCart = document.querySelector(".shopping-cart");
document.querySelector("#shopping-cart-button").onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};
// klik di luar elemen
const hm = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");
const sc = document.querySelector("#shopping-cart-button");

document.addEventListener("click", function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// modal box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();

    // Ambil elemen produk terkait
    const productCard = btn.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;
    const productImage = productCard.querySelector("img").src;
    const productPrice = productCard.querySelector(".product-price span").textContent;

    // Update konten modal
    itemDetailModal.querySelector("h3").textContent = productName;
    itemDetailModal.querySelector("img").src = productImage;
    itemDetailModal.querySelector(".product-price").textContent = productPrice;

    // Tampilkan modal
    itemDetailModal.style.display = "flex";
  };
});

// Klik di luar elemen modal untuk menutup
window.addEventListener("click", (e) => {
  const modal = document.querySelector("#item-detail-modal");
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

// Tombol close modal
const closeModalButton = document.querySelector(".close-icon");
closeModalButton.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#item-detail-modal").classList.remove("active");
});