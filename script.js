// --- LÓGICA DE CAMBIO DE PESTAÑAS ---
function cambiarPestana(event, tabId) {
  // Ocultar todos los paneles de pestañas
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabPanes.forEach(pane => pane.classList.remove('active'));

  // Desactivar estado activo en todos los botones
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));

  // Activar la pestaña y el botón seleccionados
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

// --- LÓGICA DE MODO CLARO / OSCURO CON PERSISTENCIA ---
document.addEventListener('DOMContentLoaded', () => {
  const btnTema = document.getElementById('btnTema');
  const temaGuardado = localStorage.getItem('theme');

  if (temaGuardado === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (btnTema) btnTema.textContent = '☀️ Modo Claro';
  }

  if (btnTema) {
    btnTema.addEventListener('click', () => {
      const temaActual = document.documentElement.getAttribute('data-theme');

      if (temaActual === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        btnTema.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        btnTema.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark');
      }
    });
  }
});

// --- IMPRESIÓN COMPLETA A PDF ---
// Al presionar "Exportar Hoja de Vida (PDF)", abre todas las pestañas y acordones para que la impresión salga completa
window.onbeforeprint = () => {
  document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'block');
  document.querySelectorAll('details').forEach(d => d.setAttribute('open', 'true'));
};

window.onafterprint = () => {
  document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = '');
};