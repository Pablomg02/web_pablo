// The few strings this script writes itself, in the page's language
// (<html lang>, set by the layout).
var siteStringsByLang = {
  en: {
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    copied: 'Copied',
  },
  es: {
    switchToDark: 'Cambiar a modo oscuro',
    switchToLight: 'Cambiar a modo claro',
    copied: 'Copiado',
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
//   publication). It gets a numbered mark on the rail on the left, which
//   follows the scroll and lights each mark as its step is reached. The
//   attribute's value is the label; empty, the steps are numbered 01, 02...
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

  var rail = document.createElement('div');
  rail.className = 'scroll-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="scroll-rail__fill"></span>';

  var marks = steps.map(function (step, index) {
    var mark = document.createElement('span');
    mark.className = 'scroll-rail__mark';
    var label = document.createElement('span');
    label.className = 'scroll-rail__label';
    label.textContent = step.getAttribute('data-scroll-step') || String(index + 1).padStart(2, '0');
    mark.appendChild(label);
    rail.appendChild(mark);
    return { step: step, el: mark, at: 0 };
  });
  document.body.appendChild(rail);

  var header = document.querySelector('.site-header');
  var maxScroll = 1;
  var ticking = false;

  // A step counts as reached when its top crosses the middle of the window;
  // its mark sits at that point of the page's scroll.
  function measure() {
    rail.style.setProperty('--rail-top', (header ? header.offsetHeight : 0) + 'px');
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    marks.forEach(function (mark) {
      var top = mark.step.getBoundingClientRect().top + window.scrollY;
      mark.at = Math.min(1, Math.max(0, (top - window.innerHeight * 0.5) / maxScroll));
      mark.el.style.setProperty('--at', mark.at);
    });
    update();
  }

  function update() {
    ticking = false;
    var progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    rail.style.setProperty('--progress', progress);
    rail.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.15);
    marks.forEach(function (mark) {
      mark.el.classList.toggle('is-passed', progress >= mark.at - 0.001);
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
