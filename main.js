// ==========================================
//   AURA — Elevated Living
//   main.js
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Custom Cursor ----------
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
  });

  // ---------- Nav Scroll ----------
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ---------- Cart ----------
  let cart = [];
  const cartCount = document.getElementById('cartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.closeCart = closeCart;

  document.querySelector('.cart-btn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function updateCartUI() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartCount.textContent = cart.length;
    cartCount.classList.add('bump');
    setTimeout(() => cartCount.classList.remove('bump'), 400);

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <span>✦</span>
          <p>Your cart is empty.</p>
          <a href="#featured" class="btn-primary" onclick="closeCart()">Discover Pieces</a>
        </div>`;
      cartFooter.style.display = 'none';
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img" style="background: ${item.bg}; border-radius: 2px;"></div>
          <div class="cart-item-body">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>`).join('');

      cartFooter.style.display = 'block';
      cartTotalEl.textContent = '₹' + total.toLocaleString('en-IN');

      cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          cart = cart.filter(item => item.id !== +btn.dataset.id);
          updateCartUI();
          showToast('Item removed');
        });
      });
    }
  }

  function addToCart(id, name, price) {
    const imgEl = document.querySelector(`.product-card[data-id="${id}"] .product-img`);
    const bg = imgEl ? imgEl.style.background : 'var(--sand)';

    cart.push({ id: +id, name, price: +price, bg });
    updateCartUI();
    showToast(`${name} added to cart`);
    openCart();
  }

  document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
    });
  });

  // ---------- Wishlist ----------
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
      showToast(btn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });

  // ---------- Toast ----------
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ---------- Scroll Reveal ----------
  const revealEls = document.querySelectorAll(
    '.section-header, .collection-card, .product-card, .stat, .banner-content, .banner-visual, .newsletter-inner, .footer-top'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---------- Counter Animation ----------
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(updateCounter);
          else el.textContent = target;
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  // ---------- Newsletter ----------
  document.querySelector('.subscribe-btn').addEventListener('click', () => {
    const input = document.querySelector('.email-input');
    if (input.value && input.value.includes('@')) {
      showToast('Welcome to the AURA Edit ✦');
      input.value = '';
    } else {
      showToast('Please enter a valid email');
      input.focus();
    }
  });

  document.querySelector('.email-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.querySelector('.subscribe-btn').click();
    }
  });

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
