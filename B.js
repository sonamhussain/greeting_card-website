// Simple front-end logic: products, cart, wishlist, auth using localStorage

const products = [
  // greeting cards
  { id: "card1", type: "greeting", title: "Handmade Roses Card", price: 299, img: "images/card1.jpg" },
  { id: "card2", type: "greeting", title: "Birthday Wishes Card", price: 249, img: "images/card2.jpg" },

  // bouquets
  { id: "flower1", type: "bouquet", title: "Pink Roses Bouquet", price: 899, img: "images/flower1.jpg" },
  { id: "flower2", type: "bouquet", title: "Mixed Seasonal Bouquet", price: 749, img: "images/flower2.jpg" },

  // cakes
  { id: "cake1", type: "cake", title: "Vanilla Celebration Cake", price: 1299, img: "images/cake1.jpg" }
];

const cartKey = "cardist_cart_v1";
const wishKey = "cardist_wish_v1";
const usersKey = "cardist_users_v1";
const currentUserKey = "cardist_current_v1";

function $(s){return document.querySelector(s)}
function $all(s){return document.querySelectorAll(s)}

// initial render
document.addEventListener("DOMContentLoaded", () => {
  renderSections();
  initSlideshow();
  wireUI();
  updateCounts();
  document.getElementById('year').textContent = new Date().getFullYear();
});

function renderSections(){
  const gEl = document.getElementById('productGridGreeting');
  const bEl = document.getElementById('productGridBouquet');
  const cEl = document.getElementById('productGridCake');

  products.forEach(p=>{
    const card = createProductCard(p);
    if(p.type==="greeting") gEl.appendChild(card);
    if(p.type==="bouquet") bEl.appendChild(card);
    if(p.type==="cake") cEl.appendChild(card);
  });
}

function createProductCard(p){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <img src="${p.img}" alt="${p.title}" onerror="this.src='images/WhatsApp Image 2025-09-10 at 10.28.59_ae375316.jpg'">
    <div class="title">${p.title}</div>
    <div class="price">₹ ${p.price}</div>
    <div class="actions">
      <button class="small-icon btnAdd" data-id="${p.id}">Add to Cart</button>
      <button class="small-icon btnWish" data-id="${p.id}">♡ Wishlist</button>
    </div>
  `;
  return el;
}

/* cart & wishlist functions */
function getCart(){ return JSON.parse(localStorage.getItem(cartKey) || '[]') }
function setCart(c){ localStorage.setItem(cartKey, JSON.stringify(c)) }
function getWish(){ return JSON.parse(localStorage.getItem(wishKey) || '[]') }
function setWish(w){ localStorage.setItem(wishKey, JSON.stringify(w)) }

function addToCart(id){
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({ id, qty: 1 });
  setCart(cart);
  updateCounts();
  openCart();
}

function addToWish(id){
  const wish = getWish();
  if(!wish.includes(id)) wish.push(id);
  setWish(wish);
  updateCounts();
  openWish();
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  setCart(cart);
  renderCartItems();
  updateCounts();
}

function changeQty(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item){
    item.qty = Math.max(1, qty);
    setCart(cart);
    renderCartItems();
    updateCounts();
  }
}

function updateCounts(){
  document.getElementById('cartCount').textContent = getCart().reduce((s,i)=>s+i.qty,0);
  document.getElementById('wishCount').textContent = getWish().length;
  document.getElementById('cartCount').textContent = getCart().reduce((s,i)=>s+i.qty,0);
}

/* drawers rendering */
function renderCartItems(){
  const wrap = document.getElementById('cartItems');
  wrap.innerHTML = '';
  const cart = getCart();
  if(cart.length===0){ wrap.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('cartTotal').textContent = 0; return; }
  let total = 0;
  cart.forEach(ci=>{
    const p = products.find(x=>x.id===ci.id);
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
        <img src="${p.img}" style="width:60px;height:60px;object-fit:cover;border-radius:6px">
        <div>
          <div style="font-weight:600">${p.title}</div>
          <div>₹ ${p.price} x <input type="number" min="1" value="${ci.qty}" data-id="${ci.id}" class="qtyInput" style="width:60px"></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px">
        <button class="btn" data-remove="${ci.id}">Remove</button>
      </div>
      <hr/>
    `;
    wrap.appendChild(row);
    total += p.price * ci.qty;
  });

  document.getElementById('cartTotal').textContent = total;

  // bind qty and remove
  wrap.querySelectorAll('.qtyInput').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = e.target.dataset.id;
      const newQty = parseInt(e.target.value) || 1;
      changeQty(id, newQty);
    });
  });
  wrap.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      removeFromCart(e.target.dataset.remove);
    });
  });
}

function renderWishItems(){
  const wrap = document.getElementById('wishItems');
  wrap.innerHTML = '';
  const wish = getWish();
  if(wish.length===0){ wrap.innerHTML = '<p>Your wishlist is empty.</p>'; return; }
  wish.forEach(id=>{
    const p = products.find(x=>x.id===id);
    const row = document.createElement('div');
    row.style.marginBottom = '10px';
    row.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <img src="${p.img}" style="width:60px;height:60px;object-fit:cover;border-radius:6px">
        <div style="flex:1">
          <div style="font-weight:600">${p.title}</div>
          <div>₹ ${p.price}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn" data-add="${p.id}">Add to Cart</button>
          <button class="btn outline" data-removewish="${p.id}">Remove</button>
        </div>
      </div>
      <hr/>
    `;
    wrap.appendChild(row);
  });

  wrap.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click', e=>addToCart(e.target.dataset.add)));
  wrap.querySelectorAll('[data-removewish]').forEach(b=>b.addEventListener('click', e=>{
    const id = e.target.dataset.removewish;
    const wish = getWish().filter(x => x !== id);
    setWish(wish);
    renderWishItems();
    updateCounts();
  }));
}

/* UI wiring */
function wireUI(){
  // product buttons
  document.body.addEventListener('click', (e)=>{
    if(e.target.matches('.btnAdd')) addToCart(e.target.dataset.id);
    if(e.target.matches('.btnWish')) addToWish(e.target.dataset.id);
  });

  // top buttons open drawers/modals
  $('#btnCartTop').addEventListener('click', openCart);
  $('#btnWishlistTop').addEventListener('click', openWish);

  $('#closeCart').addEventListener('click', closeCart);
  $('#closeWish').addEventListener('click', closeWish);

  $('#hamburger').addEventListener('click', ()=> $('#navList').classList.toggle('open'));

  // sign in modal
  $('#btnSign').addEventListener('click', ()=> showAuth());
  $('#closeAuth').addEventListener('click', ()=> hideAuth());
  $('#tabSignIn').addEventListener('click', ()=> switchAuthTab('in'));
  $('#tabSignUp').addEventListener('click', ()=> switchAuthTab('up'));

  $('#formSignUp').addEventListener('submit', (e)=>{ e.preventDefault(); handleSignUp(); });
  $('#formSignIn').addEventListener('submit', (e)=>{ e.preventDefault(); handleSignIn(); });

  // checkout
  $('#checkoutBtn').addEventListener('click', ()=> {
    if(getCart().length===0){ alert('Cart empty'); return; }
    const user = JSON.parse(localStorage.getItem(currentUserKey) || 'null');
    if(!user){ alert('Please sign in to checkout.'); showAuth(); return; }
    // simple checkout flow
    alert(`Thanks ${user.name || user.email}! Your order is placed.`);
    setCart([]);
    renderCartItems();
    updateCounts();
    closeCart();
  });

  // drawers initial render
  renderCartItems();
  renderWishItems();

  // product grid interactions already bound by event delegation
}

function openCart(){ $('#cartDrawer').classList.add('open'); renderCartItems(); }
function closeCart(){ $('#cartDrawer').classList.remove('open'); }
function openWish(){ $('#wishDrawer').classList.add('open'); renderWishItems(); }
function closeWish(){ $('#wishDrawer').classList.remove('open'); }

function showAuth(){ $('#authModal').classList.add('show'); }
function hideAuth(){ $('#authModal').classList.remove('show'); }
function switchAuthTab(t){
  if(t==='in'){
    $('#tabSignIn').classList.add('active');
    $('#tabSignUp').classList.remove('active');
    $('#formSignIn').classList.remove('hidden');
    $('#formSignUp').classList.add('hidden');
  } else {
    $('#tabSignUp').classList.add('active');
    $('#tabSignIn').classList.remove('active');
    $('#formSignUp').classList.remove('hidden');
    $('#formSignIn').classList.add('hidden');
  }
}

/* auth */
function handleSignUp(){
  const name = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim().toLowerCase();
  const pass = $('#signupPass').value;
  if(!email || !pass){ alert('Provide email and password'); return; }
  const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
  if(users.find(u=>u.email===email)){ alert('User exists — please sign in.'); switchAuthTab('in'); return; }
  const u = { name, email, pass };
  users.push(u);
  localStorage.setItem(usersKey, JSON.stringify(users));
  localStorage.setItem(currentUserKey, JSON.stringify({ name, email }));
  alert('Account created and signed in');
  hideAuth();
}

function handleSignIn(){
  const email = $('#signinEmail').value.trim().toLowerCase();
  const pass = $('#signinPass').value;
  const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
  const user = users.find(u=>u.email===email && u.pass===pass);
  if(!user){ alert('Invalid credentials'); return; }
  localStorage.setItem(currentUserKey, JSON.stringify({ name: user.name, email: user.email }));
  alert('Signed in');
  hideAuth();
}

/* slideshow */
function initSlideshow(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  let idx = 0;
  setInterval(()=>{
    slides[idx].classList.remove('show');
    idx = (idx+1) % slides.length;
    slides[idx].classList.add('show');
  }, 3200);
}

const hamburger = document.getElementById("hamburger");
const navList = document.getElementById("navList");

hamburger.addEventListener("click", () => {
  navList.classList.toggle("active");
});
