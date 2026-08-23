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
      toggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');
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

  var mobileQuery = window.matchMedia('(max-width: 600px)');

  function clearPosition(dropdown) {
    var menu = dropdown.querySelector('.site-nav__dropdown');

    if (menu) {
      menu.style.top = '';
      menu.style.right = '';
      menu.style.left = '';
    }
  }

  // The mobile header scrolls horizontally, so its fixed dropdown is anchored
  // under the trigger instead of being clipped by the header overflow.
  function positionDropdown(dropdown, button) {
    var menu = dropdown.querySelector('.site-nav__dropdown');

    if (!menu || !mobileQuery.matches) {
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

  mobileQuery.addEventListener('change', function () {
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
            showTemporaryLabel(link, 'Copied');
          }).catch(function () {
            window.location.href = shareUrl;
          });
        });

        return;
      }

      copyText(shareUrl).then(function () {
        showTemporaryLabel(link, 'Copied');
      }).catch(function () {
        window.location.href = shareUrl;
      });
    });
  });
}());
