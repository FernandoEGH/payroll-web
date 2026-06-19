export function Modal(title, content, onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="flex" style="justify-content:space-between;align-items:center;">
        <h3>${title}</h3>
        <button class="btn btn-outline" id="close-modal">✕</button>
      </div>
      <div class="mt-3">${content}</div>
    </div>
  `;
  document.getElementById('modal-container').appendChild(overlay);
  overlay.querySelector('#close-modal').addEventListener('click', () => {
    overlay.remove();
    if (onClose) onClose();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.remove(); if (onClose) onClose(); }
  });
  return overlay;
}