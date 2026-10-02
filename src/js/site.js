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

    // The layout re-reads the theme when a prerendered page is shown or one
    // comes back from the back/forward cache.
    document.addEventListener('prerenderingchange', updateToggleLabel);
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        updateToggleLabel();
      }
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
// towards the reader and lights a glow under it, which glides after the
// pointer a little behind the tilt. A finger dips the card
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

  var current = { rx: 0, ry: 0, px: 0, py: 0, mx: 50, my: 0 };
  var target = { rx: 0, ry: 0, px: 0, py: 0, mx: 50, my: 0 };
  // The light trails the tilt: a slower ease reads as weight, not lag.
  var ease = { rx: 0.12, ry: 0.12, px: 0.12, py: 0.12, mx: 0.07, my: 0.07 };
  var frame = 0;
  var maxAngle = 4;
  var press = null;

  function measure() {
    var size = Math.max(hero.offsetWidth, hero.offsetHeight);
    hero.style.setProperty('--hero-persp', Math.round(Math.max(1400, size * 2.6)) + 'px');
    maxAngle = Math.min(6, 5600 / Math.max(1, size));
  }

  function step() {
    var moving = false;
    Object.keys(current).forEach(function (key) {
      var delta = target[key] - current[key];
      if (Math.abs(delta) > 0.001) {
        current[key] += delta * ease[key];
        moving = true;
      } else {
        current[key] = target[key];
      }
    });
    hero.style.setProperty('--hero-rx', current.rx.toFixed(3) + 'deg');
    hero.style.setProperty('--hero-ry', current.ry.toFixed(3) + 'deg');
    hero.style.setProperty('--hero-px', current.px.toFixed(3));
    hero.style.setProperty('--hero-py', current.py.toFixed(3));
    hero.style.setProperty('--hero-mx', current.mx.toFixed(2) + '%');
    hero.style.setProperty('--hero-my', current.my.toFixed(2) + '%');
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
    target.mx = at.x * 100;
    target.my = at.y * 100;
    // Entering, the light appears where the pointer is instead of sliding
    // in from where it last faded out.
    if (!hero.classList.contains('is-lit')) {
      current.mx = target.mx;
      current.my = target.my;
    }
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

  // The card can change height on its own (the contact line opening), not
  // only with the window. offsetWidth/Height ignore the tilt, so measuring
  // here never feeds back into itself.
  measure();
  if ('ResizeObserver' in window) {
    new ResizeObserver(measure).observe(hero);
  } else {
    window.addEventListener('resize', measure);
  }
  hero.classList.add('is-3d');
}());

// Research map notes (see the map in style.css): each box of the map on the
// home opens the note whose id its `aria-controls` names, and closes it on a
// second press, on the note's close button or on Escape. Only one note is
// open at a time. It is slid under the box it belongs to and its tab points
// at the box's centre. Without this script every note is listed under the
// map and the hint that invites a click stays hidden.
(function () {
  var tree = document.querySelector('[data-topic-tree]');
  if (!tree) {
    return;
  }

  var box = tree.querySelector('.topic-tree__notes');
  var buttons = Array.prototype.slice.call(tree.querySelectorAll('.topic-tree__node[aria-controls]'));
  var hint = document.querySelector('[data-topic-hint]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = null;

  function noteOf(button) {
    return document.getElementById(button.getAttribute('aria-controls'));
  }

  function place() {
    if (!current) {
      return;
    }
    var note = noteOf(current);
    var area = box.getBoundingClientRect();
    var node = current.getBoundingClientRect();
    var centre = node.left + node.width / 2 - area.left;
    var width = note.offsetWidth;
    var left = Math.max(0, Math.min(centre - width / 2, area.width - width));
    note.style.setProperty('--note-left', left + 'px');
    note.style.setProperty('--note-x', Math.max(22, Math.min(centre - left, width - 22)) + 'px');
  }

  function close() {
    if (!current) {
      return;
    }
    current.setAttribute('aria-expanded', 'false');
    noteOf(current).hidden = true;
    current = null;
  }

  function open(button) {
    close();
    current = button;
    button.setAttribute('aria-expanded', 'true');
    var note = noteOf(button);
    note.hidden = false;
    place();
    if (note.getBoundingClientRect().bottom > window.innerHeight) {
      note.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  buttons.forEach(function (button) {
    button.setAttribute('aria-expanded', 'false');
    noteOf(button).hidden = true;
    button.addEventListener('click', function () {
      if (current === button) {
        close();
      } else {
        open(button);
      }
    });
  });

  Array.prototype.forEach.call(tree.querySelectorAll('.topic-note__close'), function (closer) {
    closer.hidden = false;
    closer.addEventListener('click', function () {
      var button = current;
      close();
      if (button) {
        button.focus();
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !current) {
      return;
    }
    var button = current;
    var inside = tree.contains(document.activeElement);
    close();
    if (inside) {
      button.focus();
    }
  });

  window.addEventListener('resize', place);

  tree.classList.add('is-interactive');
  if (hint) {
    hint.hidden = false;
  }
}());

// Contact line (see "Contact (home)" in style.css): the line rotates every
// three seconds through the profiles — LinkedIn, X, email and the rest — and
// the arrow beside it slides it open onto all five at once. Rotation holds
// while a pointer or the keyboard is on the line (so the link cannot change
// under a click), while the tab is in the background and while the line is
// open; reduced motion leaves it still on the first profile. Without this
// script the arrow stays hidden, the first profile shows and the list below
// carries the others.
(function () {
  var box = document.querySelector('[data-contact-box]');
  if (!box) {
    return;
  }

  var toggle = box.querySelector('.hero-contact__toggle');
  var panel = document.getElementById(toggle.getAttribute('aria-controls'));
  var rotate = box.querySelector('.hero-contact__rotate');
  var profiles = rotate ? Array.prototype.slice.call(rotate.children) : [];
  var rows = panel ? Array.prototype.slice.call(panel.querySelectorAll('li')) : [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = 0;
  var timer = null;
  var hover = false;
  var focused = false;

  function activeHref() {
    return profiles[active] ? profiles[active].getAttribute('href') : null;
  }

  // Only the active profile shows on the line. The list below repeats it, so
  // the row with the same address steps aside while that profile is active;
  // every other row comes back.
  // The box takes the width of the active profile, so the arrow glides
  // beside it; it is measured each time, so a late web font corrects itself.
  function show(index) {
    var previous = active;
    active = index;
    profiles.forEach(function (profile, position) {
      profile.classList.toggle('is-leaving', position === previous && position !== index);
      profile.classList.toggle('is-active', position === index);
    });
    if (profiles[index] && box.classList.contains('is-rotating')) {
      rotate.style.width = profiles[index].offsetWidth + 'px';
    }
    rows.forEach(function (row) {
      var link = row.querySelector('a');
      row.hidden = Boolean(link) && link.getAttribute('href') === activeHref();
    });
  }

  function stop() {
    window.clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();
    if (reduceMotion.matches || profiles.length < 2 || box.classList.contains('is-open') || hover || focused) {
      return;
    }
    timer = window.setInterval(function () {
      show((active + 1) % profiles.length);
    }, 3000);
  }

  function sync() {
    if (hover || focused) {
      stop();
    } else {
      start();
    }
  }

  function setOpen(open) {
    box.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    show(active);
    sync();
  }

  // The rotation stops while the reader is on the line — pointer or keyboard,
  // so the link cannot change under a click — and never runs with the panel
  // open; both resume when the reason goes away.
  box.addEventListener('pointerenter', function () {
    hover = true;
    sync();
  });
  box.addEventListener('pointerleave', function () {
    hover = false;
    sync();
  });
  // Only keyboard focus holds it: a tap leaves focus on the arrow, and that
  // would otherwise stop the line on a phone until the next tap elsewhere.
  box.addEventListener('focusin', function (event) {
    try {
      focused = event.target.matches(':focus-visible');
    } catch (error) {
      focused = true;
    }
    sync();
  });
  box.addEventListener('focusout', function () {
    focused = false;
    sync();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else {
      sync();
    }
  });

  // A change to the motion preference takes effect without a reload.
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', sync);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(sync);
  }

  box.classList.add('is-collapsible');
  toggle.hidden = false;
  if (profiles.length > 1) {
    box.classList.add('is-rotating');
  }
  setOpen(false);
  if (profiles.length > 1) {
    // Let the first width settle before transitions switch on.
    void rotate.offsetWidth;
    box.classList.add('is-ready');
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        show(active);
      });
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(!box.classList.contains('is-open'));
  });
}());
