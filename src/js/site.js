// The few strings this script writes itself, in the page's language
// (<html lang>, set by the layout).
var siteStringsByLang = {
  en: {
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    copied: 'Copied',
    pageSections: 'Page sections',
  },
  es: {
    switchToDark: 'Cambiar a modo oscuro',
    switchToLight: 'Cambiar a modo claro',
    copied: 'Copiado',
    pageSections: 'Secciones de la página',
  },
};
var siteStrings = siteStringsByLang[document.documentElement.lang] || siteStringsByLang.en;

(function () {
  var toggle = document.querySelector('.theme-toggle');

  if (toggle && typeof window.__setSiteTheme === 'function') {
    function getActiveTheme() {
      if (typeof window.__getAppliedSiteTheme === 'function') {
        return window.__getAppliedSiteTheme();
      }

      return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    }

    function getNextTheme() {
      return getActiveTheme() === 'dark' ? 'light' : 'dark';
    }

    function updateToggleLabel() {
      var activeTheme = getActiveTheme();
      var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', nextTheme === 'dark' ? siteStrings.switchToDark : siteStrings.switchToLight);
      toggle.dataset.theme = activeTheme;
    }

    toggle.addEventListener('click', function () {
      window.__setSiteTheme(getNextTheme());
      updateToggleLabel();
    });

    updateToggleLabel();
  }
}());

// The menu scrolls sideways on narrow windows (see the matching block in
// style.css). It fades only while there really is more of it to reach, so a
// menu that fits keeps its last item crisp.
(function () {
  var nav = document.querySelector('.site-nav');

  if (!nav) {
    return;
  }

  // Measured without the class: it adds a spacer at the end of the menu,
  // which would keep the menu "scrollable" after the window grows to fit it.
  function syncNavFade() {
    nav.classList.remove('is-scrollable');
    nav.classList.toggle('is-scrollable', nav.scrollWidth - nav.clientWidth > 1);
  }

  syncNavFade();
  window.addEventListener('resize', syncNavFade);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavFade, syncNavFade);
  }
}());

(function () {
  var dropdowns = document.querySelectorAll('[data-nav-dropdown]');

  if (!dropdowns.length) {
    return;
  }

  // The width below which the header scrolls: keep in step with style.css.
  var headerScrollQuery = window.matchMedia('(max-width: 1100px)');

  function clearPosition(dropdown) {
    var menu = dropdown.querySelector('.site-nav__dropdown');

    if (menu) {
      menu.style.top = '';
      menu.style.right = '';
      menu.style.left = '';
    }
  }

  // A narrow header scrolls horizontally, so its fixed dropdown is anchored
  // under the trigger instead of being clipped by the header overflow.
  function positionDropdown(dropdown, button) {
    var menu = dropdown.querySelector('.site-nav__dropdown');

    if (!menu || !headerScrollQuery.matches) {
      return;
    }

    var rect = button.getBoundingClientRect();
    menu.style.top = (rect.bottom + 6) + 'px';
    menu.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
    menu.style.left = 'auto';
  }

  function closeAll(except) {
    dropdowns.forEach(function (dropdown) {
      if (dropdown === except) {
        return;
      }

      dropdown.classList.remove('is-open');
      clearPosition(dropdown);
      var button = dropdown.querySelector('.site-nav__trigger');

      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdowns.forEach(function (dropdown) {
    var button = dropdown.querySelector('.site-nav__trigger');

    if (!button) {
      return;
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();
      var isOpen = dropdown.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      closeAll(dropdown);

      if (isOpen) {
        positionDropdown(dropdown, button);
      } else {
        clearPosition(dropdown);
      }
    });
  });

  headerScrollQuery.addEventListener('change', function () {
    dropdowns.forEach(clearPosition);
    closeAll(null);
  });

  document.addEventListener('click', function (event) {
    var insideDropdown = event.target.closest('[data-nav-dropdown]');

    if (!insideDropdown) {
      closeAll(null);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAll(null);
    }
  });
}());

(function () {
  var shareLinks = document.querySelectorAll('[data-share-link]');

  if (!shareLinks.length) {
    return;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        if (document.execCommand('copy')) {
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  }

  function showTemporaryLabel(link, label) {
    var originalLabel = link.dataset.shareOriginalLabel || link.textContent;
    link.dataset.shareOriginalLabel = originalLabel;
    link.textContent = label;
    window.clearTimeout(link.__shareLabelTimer);
    link.__shareLabelTimer = window.setTimeout(function () {
      link.textContent = originalLabel;
    }, 1800);
  }

  shareLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var shareUrl = link.dataset.shareUrl || link.href;
      var shareTitle = link.dataset.shareTitle || document.title;

      event.preventDefault();

      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          url: shareUrl,
        }).catch(function (error) {
          if (error && error.name === 'AbortError') {
            return;
          }

          copyText(shareUrl).then(function () {
            showTemporaryLabel(link, siteStrings.copied);
          }).catch(function () {
            window.location.href = shareUrl;
          });
        });

        return;
      }

      copyText(shareUrl).then(function () {
        showTemporaryLabel(link, siteStrings.copied);
      }).catch(function () {
        window.location.href = shareUrl;
      });
    });
  });
}());

// Scroll story (see "Scroll story" in style.css), on the pages whose markup
// asks for it:
// - `data-scroll-step` marks a step of the page (a home section, a role, a
//   publication). It gets a square on the rail on the left, which follows
//   the scroll and lights each square as its step is reached. A square is a
//   button: clicking it brings its step's title just under the header, the
//   point at which it lights. The attribute's value, if any, names the step
//   for screen readers; empty, the step's heading does.
// - Each step's children rise into place one after another when it comes
//   into view; a child with `data-reveal-each` passes that on to its own
//   children. `data-reveal` outside a step rises as a single block.
// Reduced motion keeps only the rail, which moves with the reader's own
// scrolling. What is already on screen when the page opens is left still.
(function () {
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-step]'));
  if (!steps.length) {
    return;
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'))
      .filter(function (block) {
        return !block.closest('[data-scroll-step]');
      });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // A step above the window (a reload halfway down) shows at once.
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          return;
        }
        entry.target.__revealItems.forEach(function (item) {
          item.classList.add('is-visible');
        });
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    steps.concat(blocks).forEach(function (target) {
      if (target.getBoundingClientRect().top < window.innerHeight) {
        return;
      }
      var items = target.hasAttribute('data-reveal') ? [target] : [];
      if (!items.length) {
        Array.prototype.forEach.call(target.children, function (child) {
          items = items.concat(child.hasAttribute('data-reveal-each')
            ? Array.prototype.slice.call(child.children)
            : [child]);
        });
      }
      items.forEach(function (item, index) {
        item.classList.add('reveal');
        item.style.setProperty('--reveal-delay', Math.min(index * 0.09, 0.45) + 's');
      });
      target.__revealItems = items;
      observer.observe(target);
    });
  }

  // Each mark names its step for screen readers, preferring the step's own
  // label and falling back to the heading it points to.
  function stepTitle(step, index) {
    var name = step.getAttribute('data-scroll-step');
    if (name) {
      return name;
    }

    var labelledBy = step.getAttribute('aria-labelledby');
    if (labelledBy) {
      var target = document.getElementById(labelledBy.split(/\s+/)[0]);
      if (target) {
        return target.textContent.trim();
      }
    }

    var heading = step.querySelector('h1, h2, h3');
    if (heading) {
      return heading.textContent.trim();
    }

    return String(index + 1);
  }

  var rail = document.createElement('nav');
  rail.className = 'scroll-rail';
  rail.setAttribute('aria-label', siteStrings.pageSections);
  rail.innerHTML = '<span class="scroll-rail__fill"></span>';

  var marks = steps.map(function (step, index) {
    var mark = document.createElement('button');
    mark.type = 'button';
    mark.className = 'scroll-rail__mark';
    mark.setAttribute('aria-label', stepTitle(step, index));
    rail.appendChild(mark);
    return { step: step, el: mark, at: 0, target: 0 };
  });
  document.body.appendChild(rail);

  var header = document.querySelector('.site-header');
  var maxScroll = 1;
  var ticking = false;

  // The marks are spread evenly down the track, whatever the length of their
  // steps, so none of them crowds or hides another.
  marks.forEach(function (mark, index) {
    mark.at = marks.length > 1 ? index / (marks.length - 1) : 0.5;
    mark.el.style.setProperty('--at', mark.at);
  });

  // Each step's target is the scroll position that puts its top just under
  // the sticky header; that is where a click on its mark goes and where the
  // mark lights. Steps too near the foot of the page to get there share out
  // the last stretch of scroll, a little apart, so each still has its own
  // position and they light one by one.
  function measure() {
    var headerHeight = header ? header.offsetHeight : 0;
    var rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    var line = headerHeight + rem * 1.5;
    rail.style.setProperty('--rail-top', headerHeight + 'px');
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    var next = maxScroll;
    for (var i = marks.length - 1; i >= 0; i--) {
      var top = marks[i].step.getBoundingClientRect().top + window.scrollY - line;
      marks[i].target = Math.round(Math.max(0, Math.min(top, next)));
      next = marks[i].target - rem * 3;
    }
    update();
  }

  // Where the fill's tip goes for a scroll position: between two targets it
  // runs from one mark to the next, so it reaches each square exactly when
  // its step arrives under the header.
  function trackAt(y) {
    var first = marks[0];
    var last = marks[marks.length - 1];
    if (y <= first.target) {
      return first.target > 0 ? first.at * y / first.target : first.at;
    }
    if (y >= last.target) {
      var rest = maxScroll - last.target;
      return rest > 0 ? last.at + (1 - last.at) * Math.min(1, (y - last.target) / rest) : last.at;
    }
    for (var i = 1; i < marks.length; i++) {
      var a = marks[i - 1];
      var b = marks[i];
      if (y < b.target) {
        return a.at + (b.at - a.at) * (y - a.target) / Math.max(1, b.target - a.target);
      }
    }
    return last.at;
  }

  function scrollToStep(mark) {
    window.scrollTo({
      top: mark.target,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  marks.forEach(function (mark) {
    mark.el.addEventListener('click', function () {
      scrollToStep(mark);
    });
  });

  // `--progress` is the whole page's, for the thin bar of narrow screens;
  // `--track` is the fill of the track with its marks.
  function update() {
    ticking = false;
    var y = window.scrollY;
    rail.style.setProperty('--progress', Math.min(1, Math.max(0, y / maxScroll)));
    rail.style.setProperty('--track', trackAt(y));
    // The thin bar shows once the reader is under way; the track with its
    // squares only when the first square lights.
    rail.classList.toggle('is-shown', y > window.innerHeight * 0.15);
    rail.classList.toggle('is-started', y >= marks[0].target - 1);
    marks.forEach(function (mark) {
      mark.el.classList.toggle('is-passed', y >= mark.target - 1);
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) {
    new ResizeObserver(measure).observe(document.body);
  }
  measure();
}());

// Welcome card (see "Welcome card" in style.css): the home hero follows the
// pointer in 3D. A mouse or pen lifts the side of the card it is over
// towards the reader and lights a glow under it. A finger dips the card
// where it rests, but only once it has stayed still for a moment, so a
// swipe to scroll or a quick tap leaves the card alone; it springs back
// when the finger lifts or the page starts scrolling. The values ease
// towards their targets frame by frame. Tall cards get a deeper perspective
// and a gentler angle, so their far edges never swing out. Reduced motion
// leaves the card still.
(function () {
  var hero = document.querySelector('[data-hero]');

  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var current = { rx: 0, ry: 0, px: 0, py: 0 };
  var target = { rx: 0, ry: 0, px: 0, py: 0 };
  var frame = 0;
  var maxAngle = 4;
  var press = null;

  function measure() {
    var size = Math.max(hero.offsetWidth, hero.offsetHeight);
    hero.style.setProperty('--hero-persp', Math.round(Math.max(1400, size * 2.6)) + 'px');
    maxAngle = Math.min(6, 4200 / Math.max(1, size));
  }

  function step() {
    var moving = false;
    Object.keys(current).forEach(function (key) {
      var delta = target[key] - current[key];
      if (Math.abs(delta) > 0.001) {
        current[key] += delta * 0.12;
        moving = true;
      } else {
        current[key] = target[key];
      }
    });
    hero.style.setProperty('--hero-rx', current.rx.toFixed(3) + 'deg');
    hero.style.setProperty('--hero-ry', current.ry.toFixed(3) + 'deg');
    hero.style.setProperty('--hero-px', current.px.toFixed(3));
    hero.style.setProperty('--hero-py', current.py.toFixed(3));
    frame = moving ? window.requestAnimationFrame(step) : 0;
  }

  function animate() {
    if (!frame) {
      frame = window.requestAnimationFrame(step);
    }
  }

  // Where (x, y), from 0 to 1 across the card, the pointer is.
  function locate(clientX, clientY) {
    var rect = hero.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }

  function hover(event) {
    var at = locate(event.clientX, event.clientY);
    target.rx = (at.y * 2 - 1) * maxAngle;
    target.ry = (1 - at.x * 2) * maxAngle;
    target.px = at.x * 2 - 1;
    target.py = at.y * 2 - 1;
    hero.style.setProperty('--hero-mx', (at.x * 100).toFixed(1) + '%');
    hero.style.setProperty('--hero-my', (at.y * 100).toFixed(1) + '%');
    hero.classList.add('is-lit');
    animate();
  }

  function dip(clientX, clientY) {
    var at = locate(clientX, clientY);
    target.rx = (1 - at.y * 2) * maxAngle * 0.6;
    target.ry = (at.x * 2 - 1) * maxAngle * 0.6;
    animate();
  }

  function release() {
    if (press) {
      window.clearTimeout(press.timer);
      press = null;
    }
    target.rx = target.ry = target.px = target.py = 0;
    hero.classList.remove('is-lit');
    animate();
  }

  hero.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'touch') {
      hover(event);
    } else if (press && Math.abs(event.clientX - press.x) + Math.abs(event.clientY - press.y) > 10) {
      release();
    }
  });
  hero.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'touch' || !event.isPrimary) {
      return;
    }
    release();
    press = { x: event.clientX, y: event.clientY };
    press.timer = window.setTimeout(function () {
      dip(press.x, press.y);
    }, 150);
  });
  hero.addEventListener('pointerup', function (event) {
    if (event.pointerType === 'touch') {
      release();
    }
  });
  hero.addEventListener('pointercancel', release);
  hero.addEventListener('pointerleave', release);
  window.addEventListener('scroll', function () {
    if (press) {
      release();
    }
  }, { passive: true });

  measure();
  window.addEventListener('resize', measure);
  hero.classList.add('is-3d');
}());
