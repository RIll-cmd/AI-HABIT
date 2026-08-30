(function() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  
  function initShareModal() {
    try {
      const shareModal = document.getElementById("share-modal");
      const shareButton = document.getElementById("share-button");
      const closeButton = document.getElementById("close-share-modal");

      if (shareButton && typeof shareButton.addEventListener === "function") {
        shareButton.addEventListener("click", () => {
          if (shareModal) {
            shareModal.classList.remove("hidden");
            shareModal.setAttribute("aria-hidden", "false");
          }
        });
      }

      if (closeButton && typeof closeButton.addEventListener === "function") {
        closeButton.addEventListener("click", () => {
          if (shareModal) {
            shareModal.classList.add("hidden");
            shareModal.setAttribute("aria-hidden", "true");
          }
        });
      }

      if (typeof window.addEventListener === "function") {
        window.addEventListener("click", (event) => {
          if (shareModal && event.target === shareModal) {
            shareModal.classList.add("hidden");
            shareModal.setAttribute("aria-hidden", "true");
          }
        });
      }
    } catch (e) {
      // Silently ignore any missing elements
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShareModal);
  } else {
    initShareModal();
  }
})();
