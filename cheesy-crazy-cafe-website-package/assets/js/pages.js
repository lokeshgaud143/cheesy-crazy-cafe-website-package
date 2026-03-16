
function initHomePage(data){
  const pageConfig = {
    title: `Where crazy taste meets premium café design.`,
    subtitle: data.settings.tagline,
    primaryText: 'Explore Full Menu',
    primaryLink: 'menu.html'
  };
  qs('#pageRoot').innerHTML = `
    ${renderHero(pageConfig, data)}
    <section class="section" id="nextSection">
      <div class="container cards-2">
        <div class="image-panel reveal">
          <img src="${getGalleryImages(data)[0]?.image_url || ''}" alt="${data.settings.site_name}">
        </div>
        <div class="glass-card reveal">
          <div class="badge">About the brand</div>
          <h2 class="title">A café experience made to feel premium, social, and memorable.</h2>
          <p class="lead">Cheesy Crazy Cafe serves one of the most diverse vegetarian café menus in Pratap Nagar — from pizzas, sandwiches, wraps, momos, and Maggi to pancakes, waffles, brownies, soups, mocktails, iced teas, coffees, mastani, and premium shakes.</p>
          <div class="feature-grid">
            <div class="feature-item"><div>📍</div><b>Prime Jaipur location</b><p>${data.settings.address}</p></div>
            <div class="feature-item"><div>🕒</div><b>Open daily</b><p>${data.settings.open_hours}</p></div>
            <div class="feature-item"><div>📞</div><b>Fast ordering</b><p>Direct WhatsApp ordering built into every menu card.</p></div>
            <div class="feature-item"><div>✨</div><b>Huge menu range</b><p>${data.menu.length}+ listed items with categories and prices.</p></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <div class="badge">Featured dishes</div>
          <h2 class="title">Signature picks designed to increase clicks and cravings.</h2>
          <p class="lead">Top picks are highlighted first to improve product discovery and drive more direct orders.</p>
        </div>
        ${renderFeaturedMenu(data)}
      </div>
    </section>
    <section class="section-sm">
      <div class="container cta-band reveal">
        <div class="page-intro-grid">
          <div>
            <div class="badge">Instant conversion</div>
            <h2 class="title">Ready to order your favourites?</h2>
            <p class="lead">Each item on the menu can redirect to WhatsApp with the product name prefilled. This reduces friction and helps the café capture orders faster.</p>
          </div>
          <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap">
            <a class="btn btn-primary" href="menu.html">Browse Full Menu</a>
            <a class="btn btn-secondary" href="contact.html">Contact the Café</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <div class="badge">Customer love</div>
          <h2 class="title">Social proof that makes the brand feel trusted.</h2>
          <p class="lead">These testimonial cards can stay as branded proof blocks or be replaced with live Google reviews.</p>
        </div>
        <div class="testimonial-grid" id="testimonialRoot"></div>
      </div>
    </section>`;
  renderTestimonials(data);
}

function initAboutPage(data){
  qs('#pageRoot').innerHTML = `
    <section class="page-hero">
      <img class="bg" src="${getHeroImages(data)[0].image_url}" alt="${data.settings.site_name}">
      <div class="container">
        <div class="badge">About Cheesy Crazy Cafe</div>
        <h1 class="title-lg">Premium comfort food, fast ordering, and a social atmosphere in Pratap Nagar.</h1>
        <p class="lead" style="max-width:820px">Cheesy Crazy Cafe is positioned as a vibrant vegetarian café experience with a broad menu that serves casual hangouts, family visits, student groups, dessert cravings, and quick food orders from one polished digital storefront.</p>
      </div>
    </section>
    <section class="section" id="nextSection">
      <div class="container page-intro-grid">
        <div class="glass-card reveal">
          <div class="badge">Brand profile</div>
          <h2 class="title">What makes the café stand out?</h2>
          <p class="lead">It combines menu variety with visual appeal. Guests can explore hot drinks, iced beverages, shakes, wraps, sandwiches, Maggi, garlic bread, pizzas, momos, desserts, waffles, brownies, soups, and much more.</p>
          <div class="tag-row" id="aboutTags"></div>
        </div>
        <div class="image-panel reveal">
          <img src="${getGalleryImages(data)[1]?.image_url || getHeroImages(data)[0].image_url}" alt="Cafe Image">
        </div>
      </div>
    </section>
    <section class="section-sm">
      <div class="container cards-2">
        <div class="contact-card reveal">
          <h3 style="margin-top:0">Business Details</h3>
          <div class="info-list">
            <div class="info-line"><strong>Name:</strong><br><span class="muted" data-setting="site_name"></span></div>
            <div class="info-line"><strong>Phone:</strong><br><span class="muted" data-setting="phone_display"></span></div>
            <div class="info-line"><strong>Hours:</strong><br><span class="muted" data-setting="open_hours"></span></div>
            <div class="info-line"><strong>Cost for Two:</strong><br><span class="muted">₹${data.settings.cost_for_two}</span></div>
          </div>
        </div>
        <div class="contact-card reveal">
          <h3 style="margin-top:0">Cuisine & Menu Focus</h3>
          <p class="lead">Pizza, sandwich, wraps, coffee, Chinese, shakes, pasta and desserts are widely associated with the café listing, while the current website package includes the full provided menu and direct order flow.</p>
          <div class="tag-row">
            <span class="tag">Pizza</span><span class="tag">Sandwich</span><span class="tag">Wraps</span><span class="tag">Coffee</span><span class="tag">Chinese</span><span class="tag">Shakes</span><span class="tag">Pasta</span><span class="tag">Desserts</span>
          </div>
        </div>
      </div>
    </section>`;
  renderAboutStats(data);
}

function initMenuPage(data){
  qs('#pageRoot').innerHTML = `
    <section class="page-hero">
      <img class="bg" src="${getHeroImages(data)[1]?.image_url || getHeroImages(data)[0].image_url}" alt="Menu">
      <div class="container">
        <div class="badge">Full menu</div>
        <h1 class="title-lg">${data.menu.length}+ menu items across drinks, snacks, mains and desserts.</h1>
        <p class="lead" style="max-width:820px">The menu page is designed for direct conversion. Search items, filter by category, and place a WhatsApp enquiry from any product card.</p>
      </div>
    </section>
    <section class="section" id="nextSection">
      <div class="container">
        <div class="search-row reveal">
          <input id="menuSearch" type="text" placeholder="Search pizza, shake, momos, pancake, brownie...">
          <a class="btn btn-primary" target="_blank" rel="noreferrer" href="https://wa.me/${window.SITE_CONFIG.whatsappNumber}">Quick WhatsApp Order</a>
        </div>
        <div class="cat-wrap reveal" id="menuFilters"></div>
        <div id="menuRoot"></div>
      </div>
    </section>`;
  setupMenuPage(data);
}

function initGalleryPage(data){
  qs('#pageRoot').innerHTML = `
    <section class="page-hero">
      <img class="bg" src="${getGalleryImages(data)[0]?.image_url || getHeroImages(data)[0].image_url}" alt="Gallery">
      <div class="container">
        <div class="badge">Gallery</div>
        <h1 class="title-lg">A premium visual story for food, vibe, and brand atmosphere.</h1>
        <p class="lead" style="max-width:820px">This gallery can use local curated images, sheet-managed image links, or live Google Maps business photos when a Maps API key is configured.</p>
      </div>
    </section>
    <section class="section" id="nextSection">
      <div class="container">
        <div class="section-head reveal">
          <div class="badge">Photo showcase</div>
          <h2 class="title">Photos that increase trust and appetite.</h2>
          <p class="lead">Use your real café interior, exterior, food and dessert shots here. The Google Sheet media tab can change these without touching the code.</p>
        </div>
        <div class="gallery-grid" id="galleryRoot"></div>
      </div>
    </section>`;
  renderGallery(data);
}

function initReviewsPage(data){
  qs('#pageRoot').innerHTML = `
    <section class="page-hero">
      <img class="bg" src="${getHeroImages(data)[0].image_url}" alt="Reviews">
      <div class="container">
        <div class="badge">Google reviews</div>
        <h1 class="title-lg">Turn Google Maps trust into on-site social proof.</h1>
        <p class="lead" style="max-width:820px">This page is prepared to load live Google Maps reviews via the Google Maps JavaScript Places library. If no API key is added, it gracefully shows a setup-ready state.</p>
      </div>
    </section>
    <section class="section" id="nextSection">
      <div class="container">
        <div id="googleReviewsRoot"></div>
        <div class="section-head reveal" style="margin-top:50px">
          <div class="badge">Curated testimonials</div>
          <h2 class="title">Optional fallback review blocks</h2>
          <p class="lead"></p>
        </div>
        <div class="testimonial-grid" id="testimonialRoot"></div>
      </div>
    </section>`;
  renderReviews(data);
  renderTestimonials(data);
}

function initContactPage(data){
  const root = qs('#pageRoot') || qs('main');
  if(!root) return;

  root.innerHTML = `
    ${renderHero({
      title: 'Contact Cheesy Crazy Cafe',
      subtitle: 'Send an enquiry for bookings, parties, custom orders, collaborations, or general questions. You can also call, WhatsApp, or visit us directly in Pratap Nagar, Jaipur.',
      primaryText: 'View Full Menu',
      primaryLink: 'menu.html'
    }, data)}
    <section class="section" id="nextSection">
      <div class="container contact-grid">
        <div class="contact-card reveal">
          <div class="badge">Send a message</div>
          <h2 class="title">Let’s talk about your order or booking.</h2>
          <form class="contact-form" id="contactForm" action="https://formspree.io/f/xdawzowy" method="POST">
            <input name="name" placeholder="Your Name" required>
            <input name="phone" placeholder="Phone Number" required>
            <input name="email" type="email" placeholder="Email Address">
            <textarea name="message" placeholder="Tell us what you need..." required></textarea>
            <button class="btn btn-primary" type="submit">Send Enquiry</button>
            <div class="success-msg" id="formSuccess"></div>
            <div class="error-msg" id="formError">Something went wrong. Please try again or contact us on WhatsApp.</div>
          </form>
        </div>
        <div class="grid">
          <div class="contact-card reveal">
            <div class="badge">Contact details</div>
            <div class="info-list">
              <div class="info-line"><strong>Phone</strong><br><span class="muted" data-text="phone_display"></span></div>
              <div class="info-line"><strong>Email</strong><br><span class="muted" data-text="email"></span></div>
              <div class="info-line"><strong>Address</strong><br><span class="muted" data-text="address"></span></div>
              <div class="info-line"><strong>Hours</strong><br><span class="muted" data-text="open_hours"></span></div>
            </div>
            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:18px">
              <a class="btn btn-primary" target="_blank" rel="noreferrer" href="https://wa.me/${window.SITE_CONFIG.whatsappNumber}">WhatsApp Now</a>
              <a class="btn btn-secondary" data-href="instagram_url" target="_blank" rel="noreferrer" href="#">Instagram</a>
            </div>
          </div>
          <div class="map-frame reveal" id="mapFrame"></div>
        </div>
      </div>
    </section>`;
  renderMap();
  setupContactForm(data);
  setContactDetails(data);
  initReveal();
}