$(document).ready(function() {

  // --- CONFIGURACIÓN DE LA API ---
  const API_URL = 'http://localhost:5000/api/experiencias';

  // --- 1. CARGAR Y RENDERIZAR EXPERIENCIAS DESDE MONGODB ---
  function cargarExperiencias() {
    $.ajax({
      url: API_URL,
      type: 'GET',
      success: function(experiencias) {
        const $contenedor = $('#contenedorExperiencias');
        if (!$contenedor.length) return;

        $contenedor.empty();

        if (experiencias.length === 0) {
          $contenedor.html('<div class="col-12 text-center py-4"><div class="alert alert-info">No hay experiencias registradas aún.</div></div>');
          return;
        }

        experiencias.forEach(exp => {
          const tecsHtml = exp.tecnologias && exp.tecnologias.length 
            ? exp.tecnologias.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('')
            : '';

          const card = `
            <div class="col-12">
              <div class="card shadow-sm border-0 mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 class="card-title text-primary fw-bold mb-1">${exp.puesto}</h5>
                      <h6 class="card-subtitle text-muted"><i class="bi bi-building me-1"></i>${exp.empresa}</h6>
                    </div>
                    <div>
                      <button class="btn btn-sm btn-outline-warning btn-editar me-1" data-id="${exp._id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${exp._id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p class="text-muted small mb-2"><i class="bi bi-calendar me-1"></i>${exp.fechaInicio} - ${exp.fechaFin || 'Presente'}</p>
                  <p class="card-text">${exp.descripcion}</p>
                  <div class="mt-2">${tecsHtml}</div>
                </div>
              </div>
            </div>
          `;
          $contenedor.append(card);
        });
      },
      error: function(err) {
        console.error('Error al cargar experiencias:', err);
        $('#contenedorExperiencias').html('<div class="col-12 text-center py-4"><div class="alert alert-danger">Error al conectar con el servidor API (localhost:5000).</div></div>');
      }
    });
  }

  cargarExperiencias();

  // --- CONTROL MANUAL DE MODAL (SIN BLOQUEOS) ---
  function abrirModal() {
    $('.modal-backdrop').remove(); // Elimina posibles backdrops duplicados
    $('#modalExperiencia').fadeIn(200).addClass('show').css('display', 'block');
    $('body').css('overflow', 'hidden'); // Previene scroll mientras el modal esté abierto
  }

  function cerrarModal() {
    $('#modalExperiencia').fadeOut(200, function() {
      $(this).removeClass('show').css('display', 'none');
      $('body').css('overflow', 'auto');
      limpiarFormularioExp();
    });
    $('.modal-backdrop').remove();
  }

  // BOTÓN CANCELAR Y X
  $(document).on('click', '[data-bs-dismiss="modal"], #btnCancelarExp', function(e) {
    e.preventDefault();
    cerrarModal();
  });

  // BOTÓN AGREGAR NUEVA
  $(document).on('click', '#btnAgregarExp', function(e) {
    e.preventDefault();
    limpiarFormularioExp();
    $('#modalExpLabel').text('Agregar Nueva Experiencia');
    abrirModal();
  });

  // BOTÓN GUARDAR (AJAX)
  $(document).on('click', '#btnGuardarExp', function(e) {
    e.preventDefault();

    const empresa = $('#expEmpresa').val().trim();
    const puesto = $('#expPuesto').val().trim();
    const fechaInicio = $('#expFechaInicio').val().trim();
    const descripcion = $('#expDescripcion').val().trim();

    if (!empresa || !puesto || !fechaInicio || !descripcion) {
      alert('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    const expId = $('#expId').val();
    const expData = {
      empresa: empresa,
      puesto: puesto,
      fechaInicio: fechaInicio,
      fechaFin: $('#expFechaFin').val().trim() || 'Presente',
      descripcion: descripcion,
      tecnologias: $('#expTecnologias').val() 
        ? $('#expTecnologias').val().split(',').map(t => t.trim()).filter(t => t.length > 0)
        : []
    };

    const url = expId ? `${API_URL}/${expId}` : API_URL;
    const type = expId ? 'PUT' : 'POST';

    $.ajax({
      url: url,
      type: type,
      contentType: 'application/json',
      data: JSON.stringify(expData),
      success: function() {
        cerrarModal();
        cargarExperiencias();
      },
      error: function(err) {
        console.error('Error al guardar:', err);
        alert('Error al guardar en MongoDB. Verifica que la consola no tenga bloqueos.');
      }
    });
  });

  // BOTÓN EDITAR
  $(document).on('click', '.btn-editar', function(e) {
    e.preventDefault();
    const id = $(this).data('id');

    $.get(API_URL, function(experiencias) {
      const exp = experiencias.find(item => item._id === id);
      if (exp) {
        $('#expId').val(exp._id);
        $('#expEmpresa').val(exp.empresa);
        $('#expPuesto').val(exp.puesto);
        $('#expFechaInicio').val(exp.fechaInicio);
        $('#expFechaFin').val(exp.fechaFin);
        $('#expDescripcion').val(exp.descripcion);
        $('#expTecnologias').val(exp.tecnologias ? exp.tecnologias.join(', ') : '');

        $('#modalExpLabel').text('Editar Experiencia');
        abrirModal();
      }
    });
  });

  // BOTÓN ELIMINAR
  $(document).on('click', '.btn-eliminar', function(e) {
    e.preventDefault();
    const id = $(this).data('id');
    if (confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'DELETE',
        success: function() {
          cargarExperiencias();
        },
        error: function(err) {
          alert('Error al eliminar la experiencia.');
        }
      });
    }
  });

  // NAVEGACIÓN DE PESTAÑAS
  $('#cv-tabs button').on('click', function (e) {
    e.preventDefault();
    $('#cv-tabs button').removeClass('active');
    $(this).addClass('active');

    const target = $(this).attr('data-bs-target');
    $('.tab-pane').removeClass('show active');
    $(target).addClass('show active animate__animated animate__fadeIn');
  });

  // ACORDEONES
  $(document).on('click', '.accordion-button', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('data-bs-target');
    const $target = $(targetId);
    const $parentAccordion = $(this).closest('.accordion');

    if ($target.hasClass('show')) {
      $target.removeClass('show');
      $(this).addClass('collapsed');
    } else {
      $parentAccordion.find('.accordion-collapse').removeClass('show');
      $parentAccordion.find('.accordion-button').addClass('collapsed');

      $target.addClass('show');
      $(this).removeClass('collapsed');
    }
  });

  // MODO CLARO / MODO OSCURO
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

  // FORMULARIO DE CONTACTO
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

// FUNCIÓN GLOBAL LIMPIAR FORMULARIO
function limpiarFormularioExp() {
  $('#formExperiencia')[0].reset();
  $('#expId').val('');
  $('#modalExpLabel').text('Gestionar Experiencia');
}

// IMPRESIÓN PDF
window.onbeforeprint = () => {
  $('.tab-pane').addClass('show active');
  $('.accordion-collapse').addClass('show');
};

window.onafterprint = () => {
  $('.tab-pane').removeClass('show active');
  $('#perfil').addClass('show active');
};