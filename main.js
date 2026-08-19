// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Sticky topbar height ----------
  const topbar = document.querySelector('.topbar');
  const setTopbarH = () => {
    document.documentElement.style.setProperty('--topbar-h', (topbar ? topbar.offsetHeight : 0) + 'px');
  };
  setTopbarH();
  window.addEventListener('resize', setTopbarH);

  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
  }

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
    // Safety net: if an element never intersects (e.g. hidden container,
    // printing, or a tool that doesn't fire scroll/resize), reveal it
    // anyway after a short delay so content is never permanently invisible.
    setTimeout(() => {
      revealEls.forEach(el => el.classList.add('in'));
    }, 2500);
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---------- Helper: submit a form to Netlify Forms via fetch ----------
  function encodeFormData(form) {
    const data = new FormData(form);
    return new URLSearchParams(data).toString();
  }
  function submitToNetlify(form, onSuccess, onError) {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(form)
    })
      .then((res) => {
        if (res.ok) { onSuccess(); } else { onError(); }
      })
      .catch(() => onError());
  }

  // ---------- Admission form ----------
  const admissionForm = document.getElementById('admissionForm');
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!admissionForm.checkValidity()) {
        admissionForm.reportValidity();
        return;
      }
      const submitBtn = admissionForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'পাঠানো হচ্ছে...'; }
      submitToNetlify(admissionForm, () => {
        admissionForm.style.display = 'none';
        document.getElementById('admissionSuccess').style.display = 'block';
        window.scrollTo({ top: document.querySelector('.form-card').offsetTop - 100, behavior: 'smooth' });
      }, () => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'রেজিস্ট্রেশন জমা দিন'; }
        alert('দুঃখিত, ফরম পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা সরাসরি কল করুন।');
      });
    });
  }

  // ---------- Contact form ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'পাঠানো হচ্ছে...'; }
      submitToNetlify(contactForm, () => {
        contactForm.style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
      }, () => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'বার্তা পাঠান'; }
        alert('দুঃখিত, বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা সরাসরি কল করুন।');
      });
    });
  }

  // ---------- Gallery filter ----------
  const filters = document.querySelectorAll('.gfilter');
  const items = document.querySelectorAll('.gallery-item');
  if (filters.length && items.length) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        items.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------- Gallery lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg && items.length) {
    items.forEach(item => {
      item.addEventListener('click', () => {
        const imgs = item.querySelectorAll('img');
        let active = null;
        imgs.forEach(im => {
          const o = parseFloat(getComputedStyle(im).opacity);
          if (!isNaN(o) && o > 0.5) active = im;
        });
        if (!active && imgs.length) active = imgs[0];
        if (active) {
          lightboxImg.src = active.currentSrc || active.src;
          lightboxImg.alt = active.alt || '';
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxImg || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ---------- Hero background videos (slow motion) ----------
  const heroVideos = document.querySelectorAll('.hero-video');
  heroVideos.forEach(v => { v.playbackRate = 0.4; });

  // ---------- Scroll to top with progress ring ----------
  const stBtn = document.createElement('button');
  stBtn.className = 'scroll-top';
  stBtn.setAttribute('aria-label', 'উপরে যান');
  stBtn.innerHTML = '<svg viewBox="0 0 52 52"><circle class="ring-bg" cx="26" cy="26" r="24"/><circle class="ring-fg" cx="26" cy="26" r="24"/></svg><span class="st-arrow">↑</span><span class="st-pct">0%</span>';
  document.body.appendChild(stBtn);

  const stRing = stBtn.querySelector('.ring-fg');
  const stPct = stBtn.querySelector('.st-pct');
  const CIRC = 2 * Math.PI * 24;
  stRing.style.strokeDasharray = CIRC;
  stRing.style.strokeDashoffset = CIRC;

  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    const p = Math.min(100, Math.max(0, pct));
    stRing.style.strokeDashoffset = CIRC - (CIRC * p / 100);
    stPct.textContent = Math.round(p) + '%';
    if (window.scrollY > 300) {
      stBtn.classList.add('show');
    } else {
      stBtn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  stBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ===========================================================
   PHASE 2 ADDITIONS
   Mobile dropdown, notice cards + detail rendering,
   stats counter, testimonials carousel, live notice ticker.
=========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Gallery sub-nav (photos / videos) active state ----------
  const gallerySubnav = document.querySelectorAll('.gallery-subnav a');
  if (gallerySubnav.length) {
    gallerySubnav.forEach(link => {
      link.addEventListener('click', () => {
        gallerySubnav.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
    const photosSection = document.getElementById('photos');
    const videosSection = document.getElementById('videos');
    if (photosSection && videosSection && 'IntersectionObserver' in window) {
      const subnavIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            gallerySubnav.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
          }
        });
      }, { threshold: 0.4 });
      subnavIO.observe(photosSection);
      subnavIO.observe(videosSection);
    }
  }

  // ---------- Mobile "আমাদের সম্পর্কে" dropdown toggle ----------
  document.querySelectorAll('.dd-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const li = btn.closest('.has-dropdown');
      if (li) li.classList.toggle('open');
    });
  });

  // ---------- Notice card + detail helpers ----------
  const escapeHtml = (str) => {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : str;
    return d.innerHTML;
  };

  function noticeCardHTML(n, basePath) {
    basePath = basePath || '';
    const tagCls = n.tag.cls ? ' ' + n.tag.cls : '';
    return `
      <div class="notice-card" data-category="${n.category}">
        <div class="nc-top">
          <span class="tag${tagCls}">${escapeHtml(n.tag.label)}</span>
          <span class="nc-date">${n.date.d} ${n.date.m}, ${n.date.y}</span>
        </div>
        <h4>${escapeHtml(n.title)}</h4>
        <p>${escapeHtml(n.excerpt)}</p>
        <a class="nc-btn" href="${basePath}notice-detail.html?id=${encodeURIComponent(n.id)}">বিস্তারিত <span class="arrow">→</span></a>
      </div>`;
  }

  // ---------- Notices grid page (pages/notices.html) ----------
  const noticeGrid = document.getElementById('noticeGrid');
  if (noticeGrid && window.NOTICES) {
    const renderGrid = (list) => {
      if (!list.length) {
        noticeGrid.innerHTML = '<p class="notice-empty">এই মুহূর্তে কোনো নোটিশ পাওয়া যায়নি।</p>';
        return;
      }
      noticeGrid.innerHTML = list.map(n => noticeCardHTML(n, '')).join('');
    };
    renderGrid(window.NOTICES);

    const filters = document.querySelectorAll('.gfilter');
    const searchInput = document.getElementById('noticeSearch');

    const applyFilters = () => {
      const activeBtn = document.querySelector('.gfilter.active');
      const cat = activeBtn ? activeBtn.dataset.filter : 'all';
      const q = (searchInput && searchInput.value || '').trim().toLowerCase();
      const filtered = window.NOTICES.filter(n => {
        const catOk = (cat === 'all' || n.category === cat);
        const qOk = !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q);
        return catOk && qOk;
      });
      renderGrid(filtered);
    };

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
    });
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
  }

  // ---------- Homepage: latest notice preview cards ----------
  const latestWrap = document.getElementById('latestNoticeCards');
  if (latestWrap && window.NOTICES) {
    const latest = window.NOTICES.slice(0, 3);
    latestWrap.innerHTML = latest.map(n => noticeCardHTML(n, 'pages/')).join('');
  }

  // ---------- Live notice ticker (homepage left panel) ----------
  const lbTrack = document.getElementById('lbScrollTrack');
  if (lbTrack && window.NOTICES) {
    const rowsHTML = window.NOTICES.map(n => `
      <div class="lb-row">
        <span class="lb-tag">${escapeHtml(n.tag.label)}</span>
        <div>
          <h5>${escapeHtml(n.title)}</h5>
          <span class="lb-date">${n.date.d} ${n.date.m}, ${n.date.y}</span>
        </div>
      </div>`).join('');
    // duplicate the list once for a seamless CSS scroll loop
    lbTrack.innerHTML = rowsHTML + rowsHTML;
  }

  // ---------- Notice detail page (pages/notice-detail.html) ----------
  const ndRoot = document.getElementById('noticeDetailRoot');
  if (ndRoot) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const notice = (window.NOTICES || []).find(n => n.id === id);

    const renderBlock = (b) => {
      switch (b.type) {
        case 'p':
          return `<p>${escapeHtml(b.text)}</p>`;
        case 'h':
          return `<div class="nd-heading"><span class="hi">${b.icon || ''}</span>${escapeHtml(b.text)}</div>`;
        case 'list':
          return `<ul class="nd-list">${b.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
        case 'note':
          return `<div class="nd-note ${b.style === 'info' ? 'info' : ''}"><span class="ni">${b.icon || 'ℹ️'}</span><p>${escapeHtml(b.text)}</p></div>`;
        case 'seats':
          return `<div class="nd-seats">${b.items.map(i => `<div class="nd-seat-item"><span class="dot"></span>${escapeHtml(i.label)} — ${escapeHtml(i.value)}</div>`).join('')}</div>`;
        case 'link':
          return `<div class="nd-actions"><a href="${b.href}" class="btn btn-primary" style="border:none;">${escapeHtml(b.label)}</a></div>`;
        default:
          return '';
      }
    };

    if (notice) {
      document.title = notice.title + ' — Ibn Khaldun School, Banshkhali';
      const bc = document.getElementById('ndBreadcrumb');
      if (bc) bc.textContent = notice.title;
      const dd = document.getElementById('ndDateD');
      const dm = document.getElementById('ndDateM');
      if (dd) dd.textContent = notice.date.d;
      if (dm) dm.textContent = notice.date.m + ' ' + notice.date.y;
      const tagEl = document.getElementById('ndTag');
      if (tagEl) {
        tagEl.textContent = notice.tag.label;
        tagEl.className = 'tag' + (notice.tag.cls ? ' ' + notice.tag.cls : '');
      }
      const titleEl = document.getElementById('ndTitle');
      if (titleEl) titleEl.textContent = notice.title;
      const bodyEl = document.getElementById('ndBody');
      if (bodyEl) bodyEl.innerHTML = notice.body.map(renderBlock).join('');
    } else {
      const wrap = document.getElementById('noticeDetailRoot');
      if (wrap) {
        wrap.innerHTML = `
          <div class="center" style="padding:60px 0;">
            <h2 style="margin-bottom:12px;">নোটিশটি খুঁজে পাওয়া যায়নি</h2>
            <p style="color:#5A5F6B; margin-bottom:24px;">এই নোটিশটি হয়তো সরিয়ে ফেলা হয়েছে অথবা লিংকটি সঠিক নয়।</p>
            <a href="notices.html" class="btn btn-navy">সব নোটিশ দেখুন</a>
          </div>`;
      }
    }
  }

  // ---------- Stats counter (animate on scroll into view) ----------
  const statNums = document.querySelectorAll('.stat-box .num[data-target]');
  if (statNums.length) {
    const animateNum = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString('bn-BD') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const statIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateNum(entry.target);
            statIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statNums.forEach(el => statIO.observe(el));
    } else {
      statNums.forEach(animateNum);
    }
  }

  // ---------- Testimonials carousel ----------
  const testiWrap = document.querySelector('.testi-wrap');
  if (testiWrap) {
    const slides = testiWrap.querySelector('.testi-slides');
    const slideEls = testiWrap.querySelectorAll('.testi-slide');
    const dots = testiWrap.querySelectorAll('.testi-dot');
    const prevBtn = testiWrap.querySelector('.testi-arrow.prev');
    const nextBtn = testiWrap.querySelector('.testi-arrow.next');
    let idx = 0;
    let timer = null;

    const goTo = (i) => {
      idx = (i + slideEls.length) % slideEls.length;
      slides.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === idx));
    };
    const restartAutoplay = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => goTo(idx + 1), 5500);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(idx - 1); restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(idx + 1); restartAutoplay(); });
    dots.forEach((d, di) => d.addEventListener('click', () => { goTo(di); restartAutoplay(); }));

    if (slideEls.length > 1) {
      goTo(0);
      restartAutoplay();
    }
  }

});
