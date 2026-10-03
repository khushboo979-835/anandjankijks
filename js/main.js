/**
 * Anand Janki Jankalyan Samiti - Main JavaScript Controller
 * High-performance, vanilla ES6+ logic for bilingual switching,
 * scroll animations, interactive modals, donation calculator & lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------- State Management ----------------
  let currentLang = localStorage.getItem('ngo_language') || 'en';
  let activeLightboxIndex = 0;
  let galleryItemsData = [];

  // ---------------- 1. Bilingual Translation Engine ----------------
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ngo_language', lang);

    document.documentElement.lang = lang;
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }

    const dict = translations[lang] || translations.en;

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update title/aria-label
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });

    // Update language switcher buttons text
    const langBtn = document.getElementById('langSwitchBtn');
    const langBtnMobile = document.getElementById('langSwitchBtnMobile');
    const targetLabel = lang === 'en' ? 'हिन्दी' : 'English';
    if (langBtn) langBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${targetLabel}`;
    if (langBtnMobile) langBtnMobile.innerHTML = `<i class="fa-solid fa-globe"></i> ${targetLabel}`;

    // Update donation impact text based on current selected amount
    updateDonationImpactDescription();

    // Update page title
    const isHindi = lang === 'hi';
    const currentTitle = document.title;
    if (currentTitle.includes('|')) {
      const prefix = currentTitle.split('|')[0].trim();
      document.title = isHindi 
        ? `${prefix} | आनंद जानकी जनकल्याण समिति`
        : `${prefix} | Anand Janki Jankalyan Samiti`;
    }
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    applyLanguage(nextLang);
    showToast(nextLang === 'hi' ? 'भाषा हिन्दी में बदली गई' : 'Language switched to English');
  }

  // Bind language switcher buttons
  const langSwitchBtn = document.getElementById('langSwitchBtn');
  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', toggleLanguage);
  }

  const langSwitchBtnMobile = document.getElementById('langSwitchBtnMobile');
  if (langSwitchBtnMobile) {
    langSwitchBtnMobile.addEventListener('click', toggleLanguage);
  }

  // ---------------- 2. Header Scroll & Nav Active Tracker ----------------
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // ---------------- 3. Mobile Navigation Drawer ----------------
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileNav() {
    if (mobileNavDrawer && mobileNavOverlay) {
      mobileNavDrawer.classList.add('active');
      mobileNavOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNavDrawer && mobileNavOverlay) {
      mobileNavDrawer.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileNav);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // ---------------- 4. Scroll Reveal Animations (IntersectionObserver) ----------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---------------- 5. Animated Number Counter ----------------
  let countersAnimated = false;
  const statNumbers = document.querySelectorAll('.counter-val');

  function animateCounters() {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.innerText = prefix + target.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = prefix + Math.floor(currentVal).toLocaleString() + suffix;
        }
      }, stepTime);
    });
  }

  const statsSection = document.getElementById('statsCounterSection');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    }, { threshold: 0.15 });
    statsObserver.observe(statsSection);
  }

  // ---------------- 6. Interactive Donation Calculator ----------------
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('customAmountInput');
  const donationDescElement = document.getElementById('donationImpactDesc');
  let selectedAmount = '1000';

  const donationImpactData = {
    '500': {
      en: 'Sponsor 1 child\'s study stationery, notebooks & bag for 6 months.',
      hi: '1 बच्चे के लिए 6 महीने की कॉपी, किताबें और स्टेशनरी का खर्च।'
    },
    '1000': {
      en: 'Fund a complete tailoring starter kit for a woman trainee.',
      hi: 'प्रशिक्षु महिला के लिए सिलाई टूलकिट व आवश्यक सामग्री।'
    },
    '2500': {
      en: 'Provide free health checkups and medicines for 25 village elders.',
      hi: '25 बुजुर्गों के लिए निःशुल्क स्वास्थ्य जांच व जरूरी दवाएं।'
    },
    '5000': {
      en: 'Sponsor an entire tailoring machine and 3-month course for a woman.',
      hi: 'एक जरूरतमंद महिला को सिलाई मशीन व संपूर्ण 3 माह का प्रशिक्षण।'
    },
    'custom': {
      en: 'Every contribution, big or small, directly empowers underprivileged families.',
      hi: 'आपका प्रत्येक सहयोग सीधे तौर पर जरूरतमंद परिवारों के उत्थान में उपयोगी है।'
    }
  };

  function updateDonationImpactDescription() {
    if (!donationDescElement) return;
    const impactInfo = donationImpactData[selectedAmount] || donationImpactData['custom'];
    donationDescElement.textContent = impactInfo[currentLang] || impactInfo.en;
  }

  amountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = btn.getAttribute('data-amount');
      if (customAmountInput) customAmountInput.value = '';
      updateDonationImpactDescription();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
      if (customAmountInput.value.trim() !== '') {
        amountBtns.forEach((b) => b.classList.remove('active'));
        selectedAmount = 'custom';
        updateDonationImpactDescription();
      }
    });
  }

  // ---------------- 7. Copy to Clipboard Utility ----------------
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Copy failed');
    }
    document.body.removeChild(tempInput);
  }

  const copyUpiBtns = document.querySelectorAll('.btn-copy-upi');
  copyUpiBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const upiId = 'anandjankijks@ybl';
      const msg = currentLang === 'hi' ? 'UPI ID कॉपी हो गई: ' + upiId : 'UPI ID copied: ' + upiId;
      copyTextToClipboard(upiId, msg);
    });
  });

  const copyBankBtns = document.querySelectorAll('.btn-copy-bank');
  copyBankBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const bankDetails = 'Bank Name: UNION BANK OF INDIA\nAccount Holder: Anand Janki Jankalyan Samiti\nAccount Number: 195721010000222\nIFSC Code: UBIN0919578\nUPI ID: anandjankijks@ybl';
      const msg = currentLang === 'hi' ? 'यूनियन बैंक विवरण कॉपी हो गया!' : 'Union Bank details copied to clipboard!';
      copyTextToClipboard(bankDetails, msg);
    });
  });

  // ---------------- 8. Toast Notification System ----------------
  function showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'toast-box';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  // ---------------- 9. Filterable Gallery & Fullscreen Lightbox ----------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (galleryItems.length > 0) {
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-caption');
      const category = item.getAttribute('data-category');
      galleryItemsData.push({
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        captionKey: cap ? cap.getAttribute('data-i18n') : '',
        category: category,
        element: item
      });

      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach((item) => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    function openLightbox(index) {
      activeLightboxIndex = index;
      updateLightboxContent();
      if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function updateLightboxContent() {
      const item = galleryItemsData[activeLightboxIndex];
      if (!item) return;
      if (lightboxImg) lightboxImg.src = item.src;
      if (lightboxCaption) {
        const dict = translations[currentLang] || translations.en;
        lightboxCaption.textContent = dict[item.captionKey] || item.alt;
      }
    }

    function closeLightbox() {
      if (lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => {
        activeLightboxIndex = (activeLightboxIndex - 1 + galleryItemsData.length) % galleryItemsData.length;
        updateLightboxContent();
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => {
        activeLightboxIndex = (activeLightboxIndex + 1) % galleryItemsData.length;
        updateLightboxContent();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
        if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
      }
    });
  }

  // ---------------- 10. Volunteer Registration Modal ----------------
  const volunteerModal = document.getElementById('volunteerModal');
  const openVolunteerBtns = document.querySelectorAll('.open-volunteer-modal');
  const closeVolunteerModalBtn = document.getElementById('closeVolunteerModal');
  const volunteerForm = document.getElementById('volunteerForm');

  openVolunteerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (volunteerModal) {
        volunteerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeVolunteerModalBtn) {
    closeVolunteerModalBtn.addEventListener('click', () => {
      volunteerModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = volunteerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (volunteerModal) volunteerModal.classList.remove('active');
        document.body.style.overflow = '';
        volunteerForm.reset();

        const dict = translations[currentLang] || translations.en;
        showToast(dict['modal.volSuccess'] || 'Application received successfully!');
      }, 1000);
    });
  }

  // ---------------- 11. Contact Form Handling ----------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        const dict = translations[currentLang] || translations.en;
        showToast(dict['contact.formSuccess'] || 'Message sent successfully!');
      }, 1200);
    });
  }

  // ---------------- 12. Newsletter Form ----------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast(currentLang === 'hi' ? 'न्यूज़लेटर सब्सक्राइब करने के लिए धन्यवाद!' : 'Thank you for subscribing to our newsletter!');
    });
  }

  // ---------------- 13. Initialize Default Language ----------------
  applyLanguage(currentLang);
});
