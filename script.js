$(document).ready(function() {

  // --- 1. CONTROL DIRECTO DE PESTAÑAS ---
  $('#cv-tabs button').on('click', function (e) {
    e.preventDefault();
    $('#cv-tabs button').removeClass('active');
    $(this).addClass('active');

    const target = $(this).attr('data-bs-target');
    $('.tab-pane').removeClass('show active');
    $(target).addClass('show active animate__animated animate__fadeIn');
  });

  // --- 2. CONTROL DIRECTO DE ACORDEONES (CURSOS Y REFERENCIAS) ---
  $(document).on('click', '.accordion-button', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('data-bs-target');
    const $target = $(targetId);
    const $parentAccordion = $(this).closest('.accordion');

    if ($target.hasClass('show')) {
      // Si ya está desplegado, lo cierra
      $target.removeClass('show');
      $(this).addClass('collapsed');
    } else {
      // Cierra los demás del mismo grupo y despliega este
      $parentAccordion.find('.accordion-collapse').removeClass('show');
      $parentAccordion.find('.accordion-button').addClass('collapsed');

      $target.addClass('show');
      $(this).removeClass('collapsed');
    }
  });

  // --- 3. MODO CLARO / OSCURO ---
  const $html = $('html');
  const $btnTema = $('#btnTema');

  if (localStorage.getItem('theme') === 'dark') {
    $html.attr('data-bs-theme', 'dark');
    $btnTema.html('<i class="bi bi-sun-fill"></i> <span>Modo Claro</span>');
  }

  $btnTema.on('click', function() {
    const isDark = $html.attr('data-bs-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    $html.attr('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    $btnTema.find('span').fadeOut(150, function() {
      $(this).text(isDark ? 'Modo Oscuro' : 'Modo Claro').fadeIn(150);
    });
    $btnTema.find('i').toggleClass('bi-moon-stars-fill bi-sun-fill');
  });

  // --- 4. VALIDACIÓN DE FORMULARIO DE CONTACTO ---
  $('#formContacto').on('submit', function(e) {
    e.preventDefault();

    let esValido = true;
    const nombre = $('#nombreContacto').val().trim();
    const email = $('#emailContacto').val().trim();
    const asunto = $('#asuntoContacto').val().trim();
    const mensaje = $('#mensajeContacto').val().trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre === '') {
      $('#nombreContacto').addClass('is-invalid').removeClass('is-valid');
      esValido = false;
    } else {
      $('#nombreContacto').addClass('is-valid').removeClass('is-invalid');
    }

    if (!regexEmail.test(email)) {
      $('#emailContacto').addClass('is-invalid').removeClass('is-valid');
      esValido = false;
    } else {
      $('#emailContacto').addClass('is-valid').removeClass('is-invalid');
    }

    if (asunto === '') {
      $('#asuntoContacto').addClass('is-invalid').removeClass('is-valid');
      esValido = false;
    } else {
      $('#asuntoContacto').addClass('is-valid').removeClass('is-invalid');
    }

    if (mensaje.length < 10) {
      $('#mensajeContacto').addClass('is-invalid').removeClass('is-valid');
      esValido = false;
    } else {
      $('#mensajeContacto').addClass('is-valid').removeClass('is-invalid');
    }

    if (esValido) {
      $('#alertSuccess').removeClass('d-none').hide().slideDown(400);
      this.reset();
      $('.form-control').removeClass('is-valid is-invalid');

      setTimeout(() => {
        $('#alertSuccess').slideUp(400);
      }, 4000);
    }
  });

});

// --- 5. PREPARACIÓN PARA IMPRESIÓN A PDF ---
window.onbeforeprint = () => {
  $('.tab-pane').addClass('show active');
  $('.accordion-collapse').addClass('show');
};

window.onafterprint = () => {
  $('.tab-pane').removeClass('show active');
  $('#perfil').addClass('show active');
};