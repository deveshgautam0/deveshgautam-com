document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // (1) Theme toggle
  const themeToggle = document.querySelector('button[data-theme-toggle]');
  if (themeToggle) {
    const setTheme = (dark) => {
      if (dark) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      }
    };
    const stored = localStorage.getItem('theme');
    const initial = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(initial);
    themeToggle.addEventListener('click', () => setTheme(!html.classList.contains('dark')));
  }

  // (2) Mobile menu
  const menuToggle = document.querySelector('button[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (menuToggle && menu) {
    const closeMenu = () => {
      menu.removeAttribute('data-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      menu.setAttribute('data-open', '');
      menuToggle.setAttribute('aria-expanded', 'true');
    };
    menuToggle.addEventListener('click', () => {
      if (menu.hasAttribute('data-open')) closeMenu(); else openMenu();
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.hasAttribute('data-open')) closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (menu.hasAttribute('data-open') && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  // (3) Copy buttons on code blocks
  document.querySelectorAll('pre.astro-code').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon-btn copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.setAttribute('title', 'Copy code');
    btn.innerHTML = '<span class="copy-icon"><span class="copy-label">Copy</span></span>';
    const showCopied = () => {
      const label = btn.querySelector('.copy-label');
      const prev = label.textContent;
      label.textContent = 'Copied';
      btn.setAttribute('aria-checked', 'true');
      setTimeout(() => {
        label.textContent = prev;
        btn.removeAttribute('aria-checked');
      }, 1500);
    };
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(showCopied);
    });
    pre.style.position = 'relative';
    btn.style.position = 'absolute';
    btn.style.top = 'var(--space-3)';
    btn.style.right = 'var(--space-3)';
    pre.appendChild(btn);
  });

  // (4) Heading anchors
  document.querySelectorAll('.prose h2, .prose h3, .prose h4').forEach((heading) => {
    if (!heading.id) return;
    if (heading.querySelector('.anchor')) return;
    const anchor = document.createElement('a');
    anchor.className = 'anchor';
    anchor.href = `#${heading.id}`;
    anchor.setAttribute('aria-label', `Link to ${heading.textContent}`);
    anchor.textContent = '#';
    heading.appendChild(anchor);
  });

  // (5) Gallery lightbox
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (items.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
      <div class="dialog-box">
        <button class="dialog-close" aria-label="Close lightbox">×</button>
        <img class="lightbox-img" alt="" />
        <div class="lightbox-nav">
          <button class="icon-btn lightbox-prev" aria-label="Previous image">‹</button>
          <button class="icon-btn lightbox-next" aria-label="Next image">›</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    const img = dialog.querySelector('.lightbox-img');
    const closeBtn = dialog.querySelector('.dialog-close');
    const prevBtn = dialog.querySelector('.lightbox-prev');
    const nextBtn = dialog.querySelector('.lightbox-next');
    let index = 0;

    const open = (i) => {
      index = i;
      const item = items[index];
      const itemImg = item.querySelector('img');
      if (itemImg) {
        img.src = itemImg.src;
        img.alt = itemImg.alt || '';
      }
      dialog.showModal();
      closeBtn.focus();
    };
    const close = () => dialog.close();

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => open((index - 1 + items.length) % items.length));
    nextBtn.addEventListener('click', () => open((index + 1) % items.length));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close();
    });
    document.addEventListener('keydown', (event) => {
      if (!dialog.open) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') open((index - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight') open((index + 1) % items.length);
    });
  }
});
