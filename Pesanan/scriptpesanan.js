// scriptpesanan.js
// Clean Luxury - Black & White (Light mode)
// L-A layout functionality: add to cart, cart panel, totals, EmailJS + WhatsApp fallback.
// NOTE: Replace EMAILJS and WA placeholders with your credentials.

(function () {
  // ------- DATA -------
  const MENU = [
    {
      id: "m1",
      title: "Ayam Goreng Kalasan",
      price: 22000,
      img: "../img/menu/Ayam Goreng Kalasan.jpg",
    },
    {
      id: "m2",
      title: "Gudeg",
      price: 15000,
      img: "../img/menu/Gudeg.jpg",
    },
    {
      id: "m3",
      title: "Mangut Lele",
      price: 18000,
      img: "../img/menu/Mangut Lele.jpg",
    },
    {
      id: "m4",
      title: "Mie Lethek",
      price: 12000,
      img: "../img/menu/Mie Lethek.jpg",
    },
    {
      id: "m5",
      title: "Nasi Brongkos",
      price: 18000,
      img: "../img/menu/Nasi Brongkos.jpg",
    },
    {
      id: "m6",
      title: "Sate Klatak",
      price: 15000,
      img: "../img/menu/Sate Klatak.jpg",
    },
    {
      id: "m7",
      title: "Jadah Tempe",
      price: 15000,
      img: "../img/menu/Tempe.jpg",
    },
    { id: "m8", title: "Tiwul", price: 15000, img: "../img/menu/Tiwul.jpg" },
  ];

  const TAX_RATE = 0.1;
  const SERVICE_RATE = 0.05;

  // ------- ELEMENTS -------
  const itemsGrid = document.getElementById("itemsGrid");
  const subtotalTxt = document.getElementById("subtotalTxt");
  const taxTxt = document.getElementById("taxTxt");
  const serviceTxt = document.getElementById("serviceTxt");
  const totalTxt = document.getElementById("totalTxt");
  const ongkirInput = document.getElementById("ongkirInput");
  const openCartBtn = document.getElementById("openCartBtn");
  const checkoutQuick = document.getElementById("checkoutQuick");

  const cartPanel = document.getElementById("cartPanel");
  // Prevent cart from closing when clicking inside cart
  if (cartPanel) {
    cartPanel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  const cartItemsEl = document.getElementById("cartItems");
  const closeCart = document.getElementById("closeCart");

  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTax = document.getElementById("cartTax");
  const cartService = document.getElementById("cartService");
  const cartOngkir = document.getElementById("cartOngkir");
  const cartTotal = document.getElementById("cartTotal");

  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const sendWA = document.getElementById("sendWA");
  const toastEl = document.getElementById("toast");

  function toast(msg, ms = 2200) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => (toastEl.style.display = "none"), ms);
  }

  // ------- localStorage cart -------

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("spotfood_cart_v1")) || [];
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    localStorage.setItem("spotfood_cart_v1", JSON.stringify(cart));
  }

  function money(n) {
    if (!Number.isFinite(n)) n = 0;
    return "Rp" + n.toLocaleString("id-ID");
  }

  // ------- render menu -------
  function renderMenu() {
    if (!itemsGrid) return;
    itemsGrid.innerHTML = "";
    MENU.forEach((m) => {
      const inCart = cart.find((c) => c.id === m.id);
      const art = document.createElement("article");
      art.className = "item";
      art.innerHTML = `
        <div class="thumb"><img src="${m.img}" alt="${
        m.title
      }" onerror="this.src='../img/default.jpg'"></div>
        <div class="meta">
          <h4>${m.title}</h4>
          <p>${m.title} — porsi pas dan lezat.</p>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
            <div class="price">${money(m.price)}</div>
            <div class="controls">
              <button class="btn glass add-btn" data-id="${m.id}">${
        inCart ? "Tambah Lagi" : "Tambah"
      }</button>
            </div>
          </div>
        </div>
      `;
      itemsGrid.appendChild(art);
    });

    document.querySelectorAll(".add-btn").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        addToCart(id, 1);
        toast("Ditambahkan ke keranjang");
      });
    });
  }

  // ------- cart ops -------
  function addToCart(id, qty = 1) {
    const menu = MENU.find((m) => m.id === id);
    if (!menu) return;
    const exist = cart.find((c) => c.id === id);
    if (exist) exist.qty += qty;
    else
      cart.push({
        id: menu.id,
        title: menu.title,
        price: menu.price,
        img: menu.img,
        qty,
      });
    saveCart();
    renderCart();
    renderSummary();
  }

  function removeFromCart(id) {
    cart = cart.filter((c) => c.id !== id);
    saveCart();
    renderCart();
    renderSummary();
  }

  function changeQty(id, qty) {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart();
    renderCart();
    renderSummary();
  }

  // ------- render cart -------
  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";
    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p style="color:#777;padding:12px">Keranjang kosong — tambahkan menu.</p>`;
      updateCartTotalsDisplay(0, 0, 0, 0);
      return;
    }
    cart.forEach((c) => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${c.img}" alt="${
        c.title
      }" onerror="this.src='../img/default.jpg'">
        <div class="ci-info">
          <h4>${c.title}</h4>
          <div class="ci-meta">${money(c.price)} • x ${c.qty}</div>
          <div class="qty-controls">
            <button class="qty-minus" data-id="${c.id}">−</button>
            <span style="min-width:28px;text-align:center">${c.qty}</span>
            <button class="qty-plus" data-id="${c.id}">+</button>
            <button class="remove" data-id="${
              c.id
            }" style="margin-left:8px;background:none;border:none;color:#777;cursor:pointer">Hapus</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });

    cartItemsEl.querySelectorAll(".qty-plus").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const i = cart.find((c) => c.id === id);
        if (i) changeQty(id, i.qty + 1);
      });
    });
    cartItemsEl.querySelectorAll(".qty-minus").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const i = cart.find((c) => c.id === id);
        if (i) changeQty(id, i.qty - 1);
      });
    });
    cartItemsEl.querySelectorAll(".remove").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        removeFromCart(id);
        toast("Dihapus dari keranjang");
      });
    });
  }

  // ------- totals -------
  function calcTotals(ongkir = 0) {
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const service = Math.round(subtotal * SERVICE_RATE);
    const total = subtotal + tax + service + Number(ongkir || 0);
    return { subtotal, tax, service, total };
  }

  function updateCartTotalsDisplay(subtotal, tax, service, ongkir) {
    const total = subtotal + tax + service + Number(ongkir || 0);
    if (subtotalTxt) subtotalTxt.textContent = money(subtotal);
    if (taxTxt) taxTxt.textContent = money(tax);
    if (serviceTxt) serviceTxt.textContent = money(service);
    if (totalTxt) totalTxt.textContent = money(total);

    if (cartSubtotal) cartSubtotal.textContent = money(subtotal);
    if (cartTax) cartTax.textContent = money(tax);
    if (cartService) cartService.textContent = money(service);
    if (cartOngkir) cartOngkir.textContent = money(ongkir || 0);
    if (cartTotal) cartTotal.textContent = money(total);
  }

  function renderSummary() {
    const ongkir = Number(ongkirInput ? ongkirInput.value : 0);
    const { subtotal, tax, service, total } = calcTotals(ongkir);
    updateCartTotalsDisplay(subtotal, tax, service, ongkir);
  }

  try {
    if (window.emailjs && emailjs.init) {
      emailjs.init("YOUR_EMAILJS_USER_ID");
    }
  } catch (e) {
    console.warn("EmailJS belum diatur:", e);
  }

  // ------- UI events -------
  if (openCartBtn) {
    openCartBtn.addEventListener("click", () => {
      if (!cartPanel) return;
      cartPanel.classList.add("open");
      cartPanel.setAttribute("aria-hidden", "false");
      renderCart();
    });
  }
  if (closeCart)
    closeCart.addEventListener("click", () => {
      cartPanel.classList.remove("open");
      cartPanel.setAttribute("aria-hidden", "true");
    });

  if (ongkirInput) ongkirInput.addEventListener("input", () => renderSummary());

  if (checkoutQuick)
    checkoutQuick.addEventListener("click", () => {
      if (cart.length === 0) {
        toast("Keranjang kosong");
        return;
      }
      const { subtotal, tax, service, total } = calcTotals(
        Number(ongkirInput ? ongkirInput.value : 0)
      );
      let msg = `*Pesanan SpotFood*%0A`;
      cart.forEach(
        (c) =>
          (msg += `• ${c.title} x${c.qty} — Rp${(
            c.price * c.qty
          ).toLocaleString("id-ID")}%0A`)
      );
      msg += `%0ASubtotal: Rp${subtotal.toLocaleString("id-ID")}`;
      msg += `%0APajak: Rp${tax.toLocaleString("id-ID")}`;
      msg += `%0AService: Rp${service.toLocaleString("id-ID")}`;
      msg += `%0AOngkir: Rp${Number(
        ongkirInput ? ongkirInput.value : 0
      ).toLocaleString("id-ID")}`;
      msg += `%0ATotal: *Rp${total.toLocaleString("id-ID")}*`;
      // replace with your WhatsApp number (no +). Example: 6281234567890
      const waNumber = "62XXXXXXXXXXX";
      window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
    });

  // ------- EmailJS init (optional) -------
  try {
    if (window.emailjs) {
      // Replace with your EmailJS user id if you have one
      emailjs.init("REPLACE_EMAILJS_USERID");
    }
  } catch (e) {
    /* ignore */
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", async () => {
      if (cart.length === 0) {
        toast("Keranjang kosong");
        return;
      }
      const name = (document.getElementById("custName") || {}).value || "";
      const phone = (document.getElementById("custPhone") || {}).value || "";
      const address =
        (document.getElementById("custAddress") || {}).value || "";
      const notes = (document.getElementById("custNotes") || {}).value || "";
      if (!name.trim() || !phone.trim() || !address.trim()) {
        toast("Lengkapi nama, telepon, dan alamat");
        return;
      }

      const ongkir = Number(ongkirInput ? ongkirInput.value : 0);
      const { subtotal, tax, service, total } = calcTotals(ongkir);
      const orderItems = cart
        .map(
          (c) =>
            `${c.title} x${c.qty} — Rp${(c.price * c.qty).toLocaleString(
              "id-ID"
            )}`
        )
        .join("\n");

      const emailParams = {
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        customer_notes: notes || "-",
        order_items: orderItems,
        subtotal: `Rp${subtotal.toLocaleString("id-ID")}`,
        tax: `Rp${tax.toLocaleString("id-ID")}`,
        service: `Rp${service.toLocaleString("id-ID")}`,
        ongkir: `Rp${ongkir.toLocaleString("id-ID")}`,
        total: `Rp${total.toLocaleString("id-ID")}`,
      };

      const SERVICE_ID = "REPLACE_SERVICE_ID";
      const TEMPLATE_ID = "REPLACE_TEMPLATE_ID";

      if (!window.emailjs) {
        toast("EmailJS tidak tersedia — gunakan WhatsApp");
        return;
      }

      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams);
        toast("Pesanan terkirim via email. Terima kasih!");
        // clear cart
        cart = [];
        saveCart();
        renderCart();
        renderSummary();
        if (cartPanel) {
          cartPanel.classList.remove("open");
          cartPanel.setAttribute("aria-hidden", "true");
        }
      } catch (err) {
        console.error(err);
        toast("Gagal kirim email — gunakan WhatsApp sebagai alternatif");
      }
    });
  }

  if (sendWA) {
    sendWA.addEventListener("click", () => {
      if (cart.length === 0) {
        toast("Keranjang kosong");
        return;
      }
      const name = (document.getElementById("custName") || {}).value || "";
      const phone = (document.getElementById("custPhone") || {}).value || "";
      const address =
        (document.getElementById("custAddress") || {}).value || "";
      const notes = (document.getElementById("custNotes") || {}).value || "";
      if (!name.trim() || !phone.trim() || !address.trim()) {
        toast("Lengkapi nama, telepon, dan alamat");
        return;
      }
      const ongkir = Number(ongkirInput ? ongkirInput.value : 0);
      const { subtotal, tax, service, total } = calcTotals(ongkir);

      let msg = `*Pesanan SpotFood*%0A`;
      msg += `Nama: ${encodeURIComponent(name)}%0A`;
      msg += `Telepon: ${encodeURIComponent(phone)}%0A`;
      msg += `Alamat: ${encodeURIComponent(address)}%0A`;
      msg += `Catatan: ${encodeURIComponent(notes || "-")}%0A%0A`;
      cart.forEach((c) => {
        msg +=
          encodeURIComponent(
            `• ${c.title} x${c.qty} — Rp${(c.price * c.qty).toLocaleString(
              "id-ID"
            )}`
          ) + "%0A";
      });
      msg += `%0ASubtotal: Rp${subtotal.toLocaleString("id-ID")}`;
      msg += `%0APajak: Rp${tax.toLocaleString("id-ID")}`;
      msg += `%0AService: Rp${service.toLocaleString("id-ID")}`;
      msg += `%0AOngkir: Rp${ongkir.toLocaleString("id-ID")}`;
      msg += `%0ATotal: *Rp${total.toLocaleString("id-ID")}*`;
      const waNumber = "62XXXXXXXXXXX"; // replace with your number
      window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
    });
  }

  // ------- init -------
  function init() {
    renderMenu();
    renderCart();
    renderSummary();
    // ESC closes cart
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cartPanel) cartPanel.classList.remove("open");
    });

    document.addEventListener("DOMContentLoaded", () => {
      const navbar = document.querySelector(".navbar");
      const menuToggle = document.getElementById("menuToggle");
      const navLinks = document.getElementById("navLinks");

      // Efek navbar saat di-scroll
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      });

      // Toggle menu hamburger
      menuToggle.addEventListener("click", function () {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("show");
      });
    });

    // Accessibility: clicking outside cart closes it on small screens
    document.addEventListener("click", (e) => {
      if (!cartPanel || !cartPanel.classList.contains("open")) return;

      const clickedInsideCart = cartPanel.contains(e.target);
      const clickedOpenBtn = openCartBtn.contains(e.target);

      if (!clickedInsideCart && !clickedOpenBtn) {
        cartPanel.classList.remove("open");
      }
    });
  }

  init();
})();
