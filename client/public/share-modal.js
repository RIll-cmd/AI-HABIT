// Share Modal Helper - Defensive Event Binding
(function () {
  'use strict';

  function safeAddEventListener(target, eventType, listener, options) {
    if (target && typeof target.addEventListener === 'function') {
      try {
        target.addEventListener(eventType, listener, options);
      } catch (err) {
        // Silently prevent errors
      }
    }
  }

  function initShareModal() {
    try {
      if (typeof document === 'undefined') return;

      var shareModal = document.getElementById('share-modal');
      var shareButton = document.getElementById('share-button');
      var closeButton = document.getElementById('close-share-modal');

      if (shareButton) {
        safeAddEventListener(shareButton, 'click', function () {
          if (shareModal) {
            shareModal.classList.remove('hidden');
            shareModal.setAttribute('aria-hidden', 'false');
          }
        });
      }

      if (closeButton) {
        safeAddEventListener(closeButton, 'click', function () {
          if (shareModal) {
            shareModal.classList.add('hidden');
            shareModal.setAttribute('aria-hidden', 'true');
          }
        });
      }

      if (typeof window !== 'undefined') {
        safeAddEventListener(window, 'click', function (event) {
          if (shareModal && event && event.target === shareModal) {
            shareModal.classList.add('hidden');
            shareModal.setAttribute('aria-hidden', 'true');
          }
        });
      }
    } catch (e) {
      // Ignore missing DOM nodes
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      safeAddEventListener(document, 'DOMContentLoaded', initShareModal);
    } else {
      initShareModal();
    }
  }
})();
