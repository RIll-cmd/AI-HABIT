// Defensive share-modal listener with safe element null-checks
document.addEventListener("DOMContentLoaded", () => {
  const shareModal = document.getElementById("share-modal");
  const shareButton = document.getElementById("share-button");
  const closeButton = document.getElementById("close-share-modal");

  if (shareButton) {
    shareButton.addEventListener("click", () => {
      if (shareModal) {
        shareModal.classList.remove("hidden");
        shareModal.setAttribute("aria-hidden", "false");
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (shareModal) {
        shareModal.classList.add("hidden");
        shareModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (shareModal && event.target === shareModal) {
      shareModal.classList.add("hidden");
      shareModal.setAttribute("aria-hidden", "true");
    }
  });
});
