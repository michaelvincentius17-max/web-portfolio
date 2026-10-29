/**
 * MICHAEL VINCENTIUS - PORTFOLIO INTERACTION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initProjectFilter();
  initLightbox();
  initMbgScreenInspector();
  initContactForm();
  initCopyActions();
});

/* ==========================================================================
   NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   PROJECT FILTERING
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-case-study');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projects.forEach(project => {
        const category = project.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
          }, 10);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(15px)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   LIGHTBOX MODAL & GALLERY
   ========================================================================== */
let currentLightboxGallery = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!modal || !lightboxImg) return;

  function renderCurrentItem() {
    if (!currentLightboxGallery.length) return;
    const item = currentLightboxGallery[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;

    if (currentLightboxGallery.length > 1) {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    } else {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }
  }

  function openLightbox(src, caption, gallery, startIndex) {
    if (gallery && gallery.length > 0) {
      currentLightboxGallery = gallery;
      currentLightboxIndex = startIndex >= 0 ? startIndex : 0;
    } else {
      currentLightboxGallery = [{ src, caption }];
      currentLightboxIndex = 0;
    }

    renderCurrentItem();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prevImage() {
    if (currentLightboxGallery.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxGallery.length) % currentLightboxGallery.length;
    renderCurrentItem();
  }

  function nextImage() {
    if (currentLightboxGallery.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxGallery.length;
    renderCurrentItem();
  }

  // Global event delegation for all lightbox triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-src]');
    if (!trigger) return;

    // Do not open modal on MBG thumbnail click (thumbnail click switches the inspector)
    if (trigger.hasAttribute('data-mbg-screen') && !trigger.classList.contains('active')) {
      return;
    }

    const src = trigger.getAttribute('data-lightbox-src');
    const caption = trigger.getAttribute('data-lightbox-caption') || '';
    const galleryName = trigger.getAttribute('data-lightbox-gallery');

    let galleryItems = [];
    let activeIndex = 0;

    if (galleryName) {
      const group = Array.from(document.querySelectorAll(`[data-lightbox-gallery="${galleryName}"]`));
      galleryItems = group.map(el => ({
        src: el.getAttribute('data-lightbox-src'),
        caption: el.getAttribute('data-lightbox-caption') || ''
      }));
      activeIndex = group.indexOf(trigger);
      if (activeIndex < 0) activeIndex = 0;
    } else {
      galleryItems = [{ src, caption }];
      activeIndex = 0;
    }

    openLightbox(src, caption, galleryItems, activeIndex);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox-img') && !e.target.closest('.lightbox-nav-btn')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
}


/* ==========================================================================
   CONTACT FORM & WHATSAPP GENERATOR
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !message) {
      showToast('Harap lengkapi nama dan pesan Anda.');
      return;
    }

    // Compose formatted WhatsApp text
    const waText = encodeURIComponent(
      `Halo Michael Vincentius!\n\n` +
      `Saya: ${name}\n` +
      `Email: ${email || '-'}\n` +
      `Perihal: ${subject || 'Kolaborasi / Diskusi Proyek'}\n\n` +
      `Pesan:\n${message}\n\n` +
      `[Terkirim dari Portofolio Website]`
    );

    const waUrl = `https://wa.me/6285180654988?text=${waText}`;
    window.open(waUrl, '_blank');

    showToast('Membuka WhatsApp untuk mengirim pesan...');
    form.reset();
  });
}

/* ==========================================================================
   COPY ACTIONS & TOAST
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Tersalin ke clipboard: ${text}`);
      }).catch(() => {
        showToast(`Gagal menyalin: ${text}`);
      });
    });
  });
}

/* ==========================================================================
   MBG TRACKING - 8 SCREENS INTERACTIVE INSPECTOR
   ========================================================================== */
const mbgScreensData = [
  {
    idx: 1,
    badge: 'Layar 01 dari 08 · Inisialisasi Sistem',
    title: 'Splash Screen & Identitas Visual Desain',
    role: 'Pintu Gerbang Aplikasi & Brand Identity MBG Tracking',
    desc: 'Menampilkan logo resmi MBG Tracking (ikon pin lokasi dengan checklist verifikasi biru terang) dan latar belakang gelombang geometris biru elektrik. Dilengkapi penanda identitas perancang resmi "By: Michael Vincentius" untuk inisialisasi aplikasi yang bersih, modern, dan berwibawa.',
    tags: ['Logo MBG Tracking', 'Aksen Wave Geometric', 'Inisialisasi Sesi', 'By: Michael Vincentius'],
    imgSrc: 'assets/mbg-screen-1.png',
    caption: 'MBG Tracking — Layar 1: Splash Screen & Identitas Desain oleh Michael Vincentius'
  },
  {
    idx: 2,
    badge: 'Layar 02 dari 08 · Layar Komando Utama',
    title: 'Dashboard Status Armada & Daftar Unit Real-Time',
    role: 'Pusat Pemantauan Kesehatan & Kesiapan Operasional Armada',
    desc: 'Menyajikan visibilitas menyeluruh atas 8 unit armada dalam 4 kategori status ringkas: 8 Total, 5 Aktif, 2 Idle, dan 1 Offline. Dilengkapi bar pencarian armada instan "Cari kendaraan...", tombol penambahan armada, serta daftar unit aktif (Daihatsu Gran Max B 1234 MBG melaju 60 km/h di Jl. Sudirman; Suzuki New Carry; Toyota Hilux Rangga) dengan Bottom Navigation Bar ergonomis.',
    tags: ['Counter 4 Status (Total, Aktif, Idle, Offline)', 'Pencarian Unit Cepat', 'Kartu Armada Real-Time', 'Bottom Nav Bar'],
    imgSrc: 'assets/mbg-screen-2.png',
    caption: 'MBG Tracking — Layar 2: Dashboard Status Armada & Ringkasan 8 Unit Terpusat'
  },
  {
    idx: 3,
    badge: 'Layar 03 dari 08 · Diagnosa Spesifik',
    title: 'Detail Status Kendaraan & Telemetri Mesin',
    role: 'Pemantauan Parameter Kinerja Individual Unit (Daihatsu Gran Max)',
    desc: 'Menampilkan telemetri mendalam per armada yang dipilih secara presisi. Menyajikan status aktif, kecepatan aktual kendaraan (60 km/h), akumulasi jarak tempuh harian (12.4 km), plat nomor kendaraan (B 1234 MBG), serta tombol shortcut "Track" untuk langsung beralih ke peta rute satelit.',
    tags: ['Speedometer Telemetri (60 km/h)', 'Odometer Harian (12.4 km)', 'Plat Nomor B 1234 MBG', 'Pintas Live Tracking'],
    imgSrc: 'assets/mbg-screen-3.png',
    caption: 'MBG Tracking — Layar 3: Detail Status Kendaraan & Telemetri Daihatsu Gran Max'
  },
  {
    idx: 4,
    badge: 'Layar 04 dari 08 · Audit Operasional',
    title: 'Riwayat Perjalanan & Log Rute Driver (Trip History)',
    role: 'Transparansi Rute, Audit Waktu Tempuh, & Kepatuhan Driver',
    desc: 'Menyimpan riwayat perjalanan armada secara kronologis per tanggal dan jam. Pengawas dapat mengaudit titik awal keberangkatan (Pool Sudirman), titik tujuan (Jl. Gatot Subroto), durasi tempuh, jam keberangkatan-kedatangan, dan nama supir yang bertugas guna evaluasi rute dan efisiensi bahan bakar.',
    tags: ['Timeline Log Perjalanan', 'Titik Asal & Tujuan', 'Cap Waktu (Timestamp)', 'Nama Driver Bertugas'],
    imgSrc: 'assets/mbg-screen-4.png',
    caption: 'MBG Tracking — Layar 4: Riwayat Perjalanan & Audit Log Rute Driver'
  },
  {
    idx: 5,
    badge: 'Layar 05 dari 08 · Peta Real-Time',
    title: 'Live Tracking Peta GPS Interaktif Real-Time',
    role: 'Pengawasan Posisi & Pergerakan Armada di Peta Digital',
    desc: 'Visualisasi peta digital interaktif dengan penanda titik GPS armada yang bergerak dinamis. Pengawas dapat melihat rute jalan yang sedang dilalui driver, estimasi waktu kedatangan di lokasi tujuan, serta tombol kontrol darurat "Hentikan Tracking".',
    tags: ['Peta Satelit / Rute Jalan', 'Marker Koordinat GPS Real-Time', 'Panel Status Bawah', 'Tombol Hentikan Tracking'],
    imgSrc: 'assets/mbg-screen-5.png',
    caption: 'MBG Tracking — Layar 5: Live Tracking Peta GPS Interaktif Real-Time'
  },
  {
    idx: 6,
    badge: 'Layar 06 dari 08 · Sistem Peringatan Bahaya',
    title: 'Notifikasi Keamanan & Geofence Alert Otomatis',
    role: 'Deteksi Anomali Operasional & Mitigasi Risiko Keselamatan',
    desc: 'Sistem peringatan otomatis yang langsung memicu alarm dan notifikasi darurat seketika ketika armada terdeteksi keluar dari radius batas aman operasional (Keluar Zona Geofence), melanggar batas kecepatan aman (Over-speeding Alert), atau saat unit kembali masuk zona aman.',
    tags: ['Alert Keluar Zona Aman (Geofence)', 'Peringatan Kecepatan Lebih', 'Status Masuk Zona Aman', 'Push Notification'],
    imgSrc: 'assets/mbg-screen-6.png',
    caption: 'MBG Tracking — Layar 6: Notifikasi Keamanan, Geofence Breach, & Speeding Alert'
  },
  {
    idx: 7,
    badge: 'Layar 07 dari 08 · Tindakan Remote',
    title: 'Pusat Kontrol Armada & Pengaturan Mesin Jarak Jauh',
    role: 'Eksekusi Pengamanan Darurat & Verifikasi Kelayakan Unit',
    desc: 'Panel kontrol pengawas untuk mengambil langkah pencegahan langsung dari jarak jauh, seperti mematikan kontak mesin saat terindikasi pencurian atau rute mencurigakan, mengunci pintu armada secara remote, verifikasi kelistrikan, serta saluran telepon darurat ke supir.',
    tags: ['Pemutus Kontak Mesin Remote', 'Penguncian Pintu Jarak Jauh', 'Diagnosa Kelayakan Mesin', 'Emergency Contact'],
    imgSrc: 'assets/mbg-screen-7.png',
    caption: 'MBG Tracking — Layar 7: Panel Kontrol Pengawas & Remote Kendaraan'
  },
  {
    idx: 8,
    badge: 'Layar 08 dari 08 · Manajemen Akun',
    title: 'Profil Pengawas & Konfigurasi Sistem Operasional',
    role: 'Pengaturan Identitas Supervisor Michael Vincentius & Preferensi Sistem',
    desc: 'Layar profil personal pengawas atas nama Michael Vincentius (avatar MV) dengan otoritas Manajemen Operasional Armada. Menyediakan menu ubah sandi, pengaturan sensitivitas alarm geofence, preferensi push notification, dan pusat bantuan teknis operasional.',
    tags: ['Avatar MV & Supervisor Info', 'Konfigurasi Radius Geofence', 'Preferensi Alarm & Notifikasi', 'Bantuan & Dukungan'],
    imgSrc: 'assets/mbg-screen-8.png',
    caption: 'MBG Tracking — Layar 8: Profil Pengawas Michael Vincentius & Konfigurasi'
  }
];

let activeMbgScreenIdx = 2; // Default to Dashboard (Screen 2)

function initMbgScreenInspector() {
  const inspector = document.getElementById('mbgInspector');
  if (!inspector) return;

  const badgeElem = document.getElementById('mbgInspectorBadge');
  const titleElem = document.getElementById('mbgInspectorTitle');
  const roleElem = document.getElementById('mbgInspectorRole');
  const descElem = document.getElementById('mbgInspectorDesc');
  const tagsElem = document.getElementById('mbgInspectorTags');
  const zoomBtn = document.getElementById('mbgInspectorZoomBtn');
  const activeImg = document.getElementById('mbgInspectorActiveImg');
  const activeImgWrap = document.getElementById('mbgInspectorActiveImgWrap');
  const prevBtn = document.getElementById('mbgInspectorPrev');
  const nextBtn = document.getElementById('mbgInspectorNext');

  const thumbs = document.querySelectorAll('.screen-thumb-card[data-mbg-screen]');

  function updateInspector(screenIdx) {
    activeMbgScreenIdx = screenIdx;
    const data = mbgScreensData.find(d => d.idx === screenIdx) || mbgScreensData[0];

    // Highlight active thumbnail
    thumbs.forEach(t => {
      const idx = parseInt(t.getAttribute('data-mbg-screen'), 10);
      if (idx === screenIdx) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.classList.remove('active');
      }
    });

    // Animate inspector update
    inspector.style.opacity = '0.5';
    setTimeout(() => {
      if (badgeElem) badgeElem.innerHTML = `<i class="fa-solid fa-mobile-screen"></i> ${data.badge}`;
      if (titleElem) titleElem.textContent = data.title;
      if (roleElem) roleElem.innerHTML = `<i class="fa-solid fa-crosshairs"></i> ${data.role}`;
      if (descElem) descElem.textContent = data.desc;

      if (tagsElem) {
        tagsElem.innerHTML = data.tags.map(t => `<span class="mbg-tag-item"><i class="fa-solid fa-check"></i> ${t}</span>`).join('');
      }

      if (activeImg) activeImg.src = data.imgSrc;
      if (activeImgWrap) {
        activeImgWrap.setAttribute('data-lightbox-src', data.imgSrc);
        activeImgWrap.setAttribute('data-lightbox-caption', data.caption);
      }

      if (zoomBtn) {
        zoomBtn.setAttribute('data-lightbox-src', data.imgSrc);
        zoomBtn.setAttribute('data-lightbox-caption', data.caption);
      }

      inspector.style.opacity = '1';
    }, 150);
  }

  // Thumb clicks
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      const idx = parseInt(t.getAttribute('data-mbg-screen'), 10);
      updateInspector(idx);
    });
  });

  // Prev / Next button
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let newIdx = activeMbgScreenIdx - 1;
      if (newIdx < 1) newIdx = mbgScreensData.length;
      updateInspector(newIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let newIdx = activeMbgScreenIdx + 1;
      if (newIdx > mbgScreensData.length) newIdx = 1;
      updateInspector(newIdx);
    });
  }

  // Initial call
  updateInspector(2);
}

function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3200);
}
