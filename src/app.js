document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Product 1", price: 100000, img: "1.jpg" },
      { id: 2, name: "Product 2", price: 200000, img: "1.jpg" },
      { id: 3, name: "Product 3", price: 300000, img: "img1.jpg" },
      { id: 4, name: "Product 4", price: 400000, img: "img1.jpg" },
      { id: 5, name: "Product 5", price: 500000, img: "1.jpg" },
    ],
    selectedItem: null, // Untuk menyimpan item yang dipilih
    openModal(item) {
      this.selectedItem = item; // Simpan item yang dipilih
      const modal = document.querySelector("#item-detail-modal");
      modal.querySelector("h3").textContent = item.name;
      modal.querySelector("img").src = `img/${item.img}`;
      modal.querySelector(".product-price span").textContent = this.rupiah(item.price);
      modal.classList.add("active");
       // Tampilkan modal
    },
    rupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);
      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form validation
const checkoutbutton = document.querySelector(".checkout-button");
checkoutbutton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutbutton.classList.remove("disabled");
      checkoutbutton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutbutton.disabled = false;
  checkoutbutton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutbutton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open('http://wa.me/6288276313294?text=' + encodeURIComponent(message));

  //  minta transaction token menggunakan ajax / fetch

  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.nama}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

// konversi harga ke format rupiah
function rupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}
