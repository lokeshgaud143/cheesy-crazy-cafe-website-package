
const state = {
  localData: null,
  remoteData: null,
  googlePlaceData: null,
};

const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];

function formatINR(value){
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(number);
}
function slugify(str=''){
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function starsMarkup(rating=5){
  const full = Math.round(Number(rating) || 5);
  return '<span class="stars">' + '★'.repeat(full) + '</span>';
}

async function loadLocalData(){
  if (state.localData) return state.localData;
  const res = await fetch('assets/data/local-data.json');
  state.localData = await res.json();
  return state.localData;
}

async function loadRemoteData(){
  if (state.remoteData) return state.remoteData;
  const { sheetApiUrl, menuCsvUrl } = window.SITE_CONFIG || {};
  try{
    if(sheetApiUrl){
      const res = await fetch(sheetApiUrl + (sheetApiUrl.includes('?') ? '&' : '?') + 'v=' + Date.now());
      if(res.ok){
        state.remoteData = await res.json();
        return state.remoteData;
      }
    }
    if(menuCsvUrl){
      const csv = await fetch(menuCsvUrl).then(r => r.text());
      state.remoteData = { menu: parseCsvMenu(csv) };
      return state.remoteData;
    }
  }catch(err){
    console.warn('Remote data not loaded:', err);
  }
  return null;
}

function parseCsvMenu(csv){
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines.shift().split(',').map(v => v.trim().replace(/^"|"$/g,''));
  return lines.map(line => {
    const values = [];
    let current = '', inQuotes = false;
    for(let i=0;i<line.length;i++){
      const ch = line[i];
      if(ch === '"' && line[i+1] === '"'){ current += '"'; i++; continue; }
      if(ch === '"'){ inQuotes = !inQuotes; continue; }
      if(ch === ',' && !inQuotes){ values.push(current); current = ''; continue; }
      current += ch;
    }
    values.push(current);
    const row = {};
    headers.forEach((h, idx) => row[h] = (values[idx] || '').trim());
    return {
      category: row.category || row.Category || 'Menu',
      name: row.name || row.item_name || row['Item Name'] || '',
      price: Number(row.price || row['Price INR'] || 0),
      description: row.description || row.Description || '',
      image_url: row.image_url || row['Image URL'] || '',
      is_active: String(row.is_active || row['Is Active'] || 'true').toLowerCase() !== 'false',
      is_featured: String(row.is_featured || row['Is Featured'] || 'false').toLowerCase() === 'true',
    };
  }).filter(item => item.name);
}

async function getSiteData(){
  const [local, remote] = await Promise.all([loadLocalData(), loadRemoteData()]);
  const data = structuredClone(local);
  if(remote){
    if(remote.settings) data.settings = {...data.settings, ...remote.settings};
    if(remote.media) data.media = remote.media;
    if(remote.testimonials) data.testimonials = remote.testimonials;
    if(remote.menu?.length) data.menu = remote.menu.filter(item => item.is_active !== false);
  }
  return data;
}

function getSetting(data, key, fallback=''){
  return data?.settings?.[key] ?? fallback;
}

function buildHeader(activePage='home'){
  const links = [
    ['index.html','Home','home'],
    ['about.html','About','about'],
    ['menu.html','Menu','menu'],
    ['gallery.html','Gallery','gallery'],
    ['reviews.html','Reviews','reviews'],
    ['contact.html','Contact','contact']
  ];
  const nav = links.map(([href,label,key]) =>
    `<a href="${href}" class="${activePage===key?'active':''}">${label}</a>`).join('');
  return `
  <div class="progress"><span id="progressBar"></span></div>
  <div class="loader" id="pageLoader">
    <div>
      <div class="loader-ring"><div class="loader-inner">☕</div></div>
      <div class="loader-copy"><b>Cheesy Crazy Cafe</b><span>Preparing premium experience...</span></div>
    </div>
  </div>
  <header class="site-header">
    <div class="container inner">
      <a href="index.html" class="brand">
        <b>Cheesy Crazy Cafe</b>
        <span>Premium multipage website</span>
      </a>
      <nav class="primary-nav">${nav}</nav>
      <div class="header-cta">
        <a class="btn btn-primary" target="_blank" rel="noreferrer" href="https://wa.me/${window.SITE_CONFIG.whatsappNumber || '919509552466'}">Order on WhatsApp</a>
      </div>
      <button class="menu-toggle" aria-label="Open menu" id="menuToggle">☰</button>
    </div>
  </header>
  <div class="mobile-drawer" id="mobileDrawer">${nav}</div>
  <div class="page-header-spacer"></div>`;
}

function buildFooter(data){
  const settings = data.settings || {};
  return `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <div class="brand">
          <b>Cheesy Crazy Cafe</b>
          <span>Pratap Nagar, Jaipur</span>
        </div>
        <p class="lead" style="max-width:700px; margin-top:16px">${settings.tagline || ''}</p>
        <div class="tag-row">
          <span class="tag">Vegetarian friendly</span>
          <span class="tag">Large group seating</span>
          <span class="tag">Wifi</span>
          <span class="tag">Takeaway available</span>
          <span class="tag">Home delivery</span>
        </div>
        <div class="footer-note"></div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:18px">
        <div class="contact-card">
          <h3 style="margin-top:0">Visit & Contact</h3>
          <div class="info-list">
            <div class="info-line"><strong>Phone:</strong><br><span class="muted">${settings.phone_display || ''}</span></div>
            <div class="info-line"><strong>Address:</strong><br><span class="muted">${settings.address || ''}</span></div>
            <div class="info-line"><strong>Hours:</strong><br><span class="muted">${settings.open_hours || ''}</span></div>
          </div>
        </div>
        <div class="contact-card">
          <h3 style="margin-top:0">Quick Links</h3>
          <div class="info-list">
            <div class="info-line"><a href="menu.html">Full Menu</a></div>
            <div class="info-line"><a href="gallery.html">Gallery</a></div>
            <div class="info-line"><a href="reviews.html">Google Reviews</a></div>
            <div class="info-line"><a href="contact.html">Contact Form</a></div>
          </div>
        </div>
      </div>
    </div>
  </footer>`;
}

function initChrome(data){
  const active = document.body.dataset.page || 'home';
  document.body.insertAdjacentHTML('afterbegin', buildHeader(active));
  document.body.insertAdjacentHTML('beforeend', buildFooter(data));
  document.title = `${getPageTitle(active)} | ${data.settings.site_name}`;
  const mt = qs('#menuToggle');
  const drawer = qs('#mobileDrawer');
  if(mt && drawer) mt.addEventListener('click', () => drawer.classList.toggle('open'));
  qsa('.mobile-drawer a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  window.addEventListener('scroll', updateProgress);
  updateProgress();
  setTimeout(() => qs('#pageLoader')?.classList.add('hidden'), 1200);
  initReveal();
}

function getPageTitle(page){
  return ({
    home:'Home',
    about:'About',
    menu:'Menu',
    gallery:'Gallery',
    reviews:'Reviews',
    contact:'Contact',
  })[page] || 'Cheesy Crazy Cafe';
}

function updateProgress(){
  const bar = qs('#progressBar');
  if(!bar) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  bar.style.width = `${progress}%`;
}

function initReveal(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, {threshold:0.16});
  qsa('.reveal').forEach(el => observer.observe(el));
}

function getHeroImages(data){
  const images = (data.media || []).filter(i => i.type === 'hero' && i.is_active !== false).sort((a,b)=> (a.sort_order||0)-(b.sort_order||0));
  return images.length ? images : [{image_url:'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1400&q=80'}];
}

function getGalleryImages(data){
  const images = (data.media || []).filter(i => i.type === 'gallery' && i.is_active !== false).sort((a,b)=> (a.sort_order||0)-(b.sort_order||0));
  return images.length ? images : getHeroImages(data);
}

function renderHero(pageConfig, data){
  const heroImages = getHeroImages(data);
  return `
  <section class="hero">
    <div class="hero-bg" id="heroBg">
      ${heroImages.map((img,idx)=>`<img src="${img.image_url}" alt="${img.title || data.settings.site_name}" class="${idx===0?'active':''}">`).join('')}
    </div>
    <div class="hero-overlay"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="container hero-grid">
      <div class="reveal">
        <div class="badge">Premium Café Website</div>
        <h1 class="title-lg">${pageConfig.title}</h1>
        <p class="lead">${pageConfig.subtitle}</p>
        <div class="tag-row">
          <span class="tag">Pizzas</span>
          <span class="tag">Sandwiches</span>
          <span class="tag">Wraps</span>
          <span class="tag">Shakes</span>
          <span class="tag">Desserts</span>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:28px">
          <a class="btn btn-primary" href="${pageConfig.primaryLink || 'menu.html'}">${pageConfig.primaryText || 'Explore Menu'}</a>
          <a class="btn btn-secondary" target="_blank" rel="noreferrer" href="https://wa.me/${window.SITE_CONFIG.whatsappNumber || '919509552466'}">Order on WhatsApp</a>
        </div>
        <div class="stats">
          <div class="stat"><b>${data.settings.rating_display || '4.9'}</b><span>Google style rating</span></div>
          <div class="stat"><b>${data.settings.reviews_display || '1K+'}</b><span>Review count showcase</span></div>
          <div class="stat"><b>${data.settings.open_hours || 'Daily'}</b><span>Open hours</span></div>
        </div>
      </div>
      <div class="hero-card reveal">
        <img src="${heroImages[0].image_url}" alt="${data.settings.site_name}">
        <div class="floating-panel">
          <div class="badge">Pratap Nagar · Jaipur</div>
          <h3 style="font-size:2rem; margin:14px 0 8px">${data.settings.site_name}</h3>
          <p class="muted" style="line-height:1.8">${data.settings.tagline}</p>
        </div>
      </div>
    </div>
    <a class="scroll-indicator" href="#nextSection">↓</a>
  </section>`;
}

function rotateHero(){
  const imgs = qsa('#heroBg img');
  if(imgs.length < 2) return;
  let idx = 0;
  setInterval(() => {
    imgs[idx].classList.remove('active');
    idx = (idx + 1) % imgs.length;
    imgs[idx].classList.add('active');
  }, 4000);
}

function groupMenu(menu){
  const activeItems = (menu || []).filter(item => item.is_active !== false);
  return activeItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

function itemCard(item){
  const img = item.image_url || '';
  return `
    <article class="menu-card reveal" data-name="${(item.name || '').toLowerCase()}" data-category="${slugify(item.category)}">
      <img src="${img}" alt="${item.name}">
      <div class="content">
        <div class="meta-line">
          <h3>${item.name}</h3>
          <span class="price-pill">${formatINR(item.price)}</span>
        </div>
        <p>${item.description || 'Premium café item from the Cheesy Crazy Cafe menu.'}</p>
        <div style="display:flex; gap:10px; margin-top:18px">
          <a class="btn btn-primary btn-block" target="_blank" rel="noreferrer" href="https://wa.me/${window.SITE_CONFIG.whatsappNumber || '919509552466'}?text=${encodeURIComponent(`Hello Cheesy Crazy Cafe, I want to order:\n\nItem: ${item.name}\nPrice: ${formatINR(item.price)}\n\nPlease share availability and delivery/pickup details.`)}">Order Now</a>
        </div>
      </div>
    </article>`;
}

function renderFeaturedMenu(data, limit=6){
  const featured = (data.menu || []).filter(i => i.is_featured).slice(0, limit);
  return `
  <div class="menu-preview-grid">
    ${featured.map(itemCard).join('')}
  </div>`;
}

function renderMenuBlocks(data, filter='all', search=''){
  const menu = (data.menu || []).filter(item => {
    const matchesFilter = filter === 'all' || slugify(item.category) === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query);
    return item.is_active !== false && matchesFilter && matchesSearch;
  });
  const grouped = groupMenu(menu);
  if(!menu.length) return `<div class="empty-state">No menu items found for this filter.</div>`;
  return Object.entries(grouped).map(([category, items]) => `
    <section class="category-block" id="${slugify(category)}">
      <h2>${category}</h2>
      <p>${items.length} items available</p>
      <div class="menu-grid">${items.map(itemCard).join('')}</div>
    </section>
  `).join('');
}

function setupMenuPage(data){
  const categories = ['all', ...Array.from(new Set((data.menu || []).map(i => slugify(i.category))))];
  const categoryLookup = {};
  (data.menu || []).forEach(i => categoryLookup[slugify(i.category)] = i.category);
  const pills = categories.map(cat => `<button class="cat-pill ${cat==='all'?'active':''}" data-category="${cat}">${cat==='all' ? 'All' : categoryLookup[cat]}</button>`).join('');
  const root = qs('#menuRoot');
  const search = qs('#menuSearch');
  const render = () => {
    const active = qs('.cat-pill.active')?.dataset.category || 'all';
    root.innerHTML = renderMenuBlocks(data, active, search?.value || '');
    initReveal();
  };
  qs('#menuFilters').innerHTML = pills;
  qsa('.cat-pill', qs('#menuFilters')).forEach(btn => btn.addEventListener('click', () => {
    qsa('.cat-pill', qs('#menuFilters')).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  }));
  search?.addEventListener('input', render);
  render();
}

function renderGallery(data){
  const images = state.googlePlaceData?.photos?.length
    ? state.googlePlaceData.photos.map((src, idx) => ({image_url: src, title: `Google Photo ${idx+1}`}))
    : getGalleryImages(data);
  const root = qs('#galleryRoot');
  root.innerHTML = images.slice(0,9).map((img, idx) => `
    <article class="media-card reveal ${idx % 5 === 0 ? 'tall' : ''}">
      <img src="${img.image_url}" alt="${img.title || data.settings.site_name}" style="height:${idx % 5 === 0 ? '540px':'260px'}; object-fit:cover">
    </article>
  `).join('');
  initReveal();
}

function renderTestimonials(data){
  const items = data.testimonials || [];
  const root = qs('#testimonialRoot');
  if(!root) return;
  root.innerHTML = items.filter(i => i.is_active !== false).map(t => `
    <article class="testimonial reveal">
      ${starsMarkup(t.rating)}
      <p>“${t.quote}”</p>
      <span>${t.name}</span>
    </article>
  `).join('');
  initReveal();
}

function setupContactForm(data){
  const form = qs('#contactForm');
  if(!form) return;
  const success = qs('#formSuccess');
  const error = qs('#formError');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    success.style.display = 'none';
    error.style.display = 'none';
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.source = 'Cheesy Crazy Cafe Website';
    const endpoint = window.SITE_CONFIG.contactFormEndpoint || window.SITE_CONFIG.sheetApiUrl;
    try{
      if(endpoint){
        const res = await fetch(endpoint, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error('Request failed');
      }else{
        const subject = encodeURIComponent(`Website enquiry from ${payload.name}`);
        const body = encodeURIComponent(`Name: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nMessage: ${payload.message}`);
        window.location.href = `mailto:${window.SITE_CONFIG.contactEmail || data.settings.email}?subject=${subject}&body=${body}`;
      }
      success.textContent = data.settings.contact_form_success_message || 'Thanks! Your message has been sent.';
      success.style.display = 'block';
      form.reset();
    }catch(err){
      console.error(err);
      error.style.display = 'block';
    }
  });
}

function renderMap(){
  const frame = qs('#mapFrame');
  if(frame){
    frame.innerHTML = `<iframe loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="${window.SITE_CONFIG.mapEmbedUrl}"></iframe>`;
  }
}

function renderAboutStats(data){
  const settings = data.settings;
  const tags = ['Vegetarian only', 'Takeaway', 'Home delivery', 'Large group seating', 'Wifi', 'Drive thru'];
  const root = qs('#aboutTags');
  if(root){
    root.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
  }
  qsa('[data-setting]').forEach(el => {
    const key = el.dataset.setting;
    el.textContent = settings[key] ?? '';
  });
}

function loadGooglePlacesData(){
  return new Promise(resolve => {
    const key = window.SITE_CONFIG.googleMapsApiKey;
    if(!key){ resolve(null); return; }
    if(window.google?.maps?.places){ init(); return; }
    window.__cccGoogleReady = init;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=__cccGoogleReady`;
    script.async = true;
    script.defer = true;
    script.onerror = () => resolve(null);
    document.head.appendChild(script);

    function init(){
      try{
        const query = window.SITE_CONFIG.googleBusinessQuery;
        const mapEl = document.createElement('div');
        mapEl.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px';
        document.body.appendChild(mapEl);
        const map = new google.maps.Map(mapEl, {center:{lat:26.85,lng:75.80}, zoom:15});
        const service = new google.maps.places.PlacesService(map);
        service.findPlaceFromQuery({
          query,
          fields:['place_id','name','formatted_address']
        }, (results, status) => {
          if(status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]){
            resolve(null); return;
          }
          service.getDetails({
            placeId: results[0].place_id,
            fields:['name','rating','reviews','formatted_address','photos','url','website']
          }, (place, detailsStatus) => {
            if(detailsStatus !== google.maps.places.PlacesServiceStatus.OK || !place){
              resolve(null); return;
            }
            const photos = (place.photos || []).slice(0, 9).map(photo => {
              try { return photo.getUrl({maxWidth: 1400, maxHeight: 1000}); }
              catch { return null; }
            }).filter(Boolean);
            state.googlePlaceData = {
              name: place.name,
              rating: place.rating,
              address: place.formatted_address,
              reviews: place.reviews || [],
              photos,
              url: place.url,
              website: place.website,
            };
            resolve(state.googlePlaceData);
          });
        });
      }catch(err){
        console.warn('Google reviews/photos not loaded', err);
        resolve(null);
      }
    }
  });
}

function renderReviews(data){
  const root = qs('#googleReviewsRoot');
  if(!root) return;
  const googleData = state.googlePlaceData;
  if(googleData?.reviews?.length){
    root.innerHTML = `
      <div class="contact-card reveal" style="margin-bottom:20px">
        <div class="meta-line">
          <div>
            <div class="badge">Live from Google Maps</div>
            <h2 style="margin:16px 0 8px">${googleData.name}</h2>
            <p class="muted">${googleData.address || ''}</p>
          </div>
          <div class="price-pill">${googleData.rating ? `${googleData.rating} ★` : 'Google Reviews'}</div>
        </div>
      </div>
      <div class="review-list">
        ${googleData.reviews.map(review => `
          <article class="review-card reveal">
            ${starsMarkup(review.rating || 5)}
            <p style="line-height:1.9">${review.text || ''}</p>
            <small>${review.author_name || 'Google user'}${review.relative_time_description ? ` · ${review.relative_time_description}` : ''}</small>
          </article>
        `).join('')}
      </div>
    `;
  }else{
    root.innerHTML = `
      <div class="empty-state">
        <strong></strong><br><br>
        
      </div>`;
  }
  initReveal();
}

function setContactDetails(data){
  qsa('[data-text]').forEach(el => {
    el.textContent = data.settings[el.dataset.text] || '';
  });
  qsa('[data-href]').forEach(el => {
    const key = el.dataset.href;
    const val = data.settings[key] || '#';
    el.setAttribute('href', val);
  });
}

async function boot(){
  const data = await getSiteData();
  initChrome(data);
  await loadGooglePlacesData();
  const page = document.body.dataset.page || 'home';
  if(page === 'home') initHomePage(data);
  if(page === 'about') initAboutPage(data);
  if(page === 'menu') initMenuPage(data);
  if(page === 'gallery') initGalleryPage(data);
  if(page === 'reviews') initReviewsPage(data);
  if(page === 'contact') initContactPage(data);
  rotateHero();
  renderMap();
  setContactDetails(data);
}
document.addEventListener('DOMContentLoaded', boot);
