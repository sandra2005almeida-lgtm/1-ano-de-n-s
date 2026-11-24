/* Animações e interações do site "O nosso primeiro ano" */
(function () {
  var reduzir = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- Foto ampliada (páginas dos meses) ---- */
  var lb = null;
  function abrirFoto(src) {
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lb';
      lb.innerHTML = '<img alt="Foto ampliada">';
      document.body.appendChild(lb);
    }
    lb.firstChild.src = src;
    lb.classList.add('on');
  }
  function fecharFoto() { if (lb) lb.classList.remove('on'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharFoto(); });

  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.fig img');
    if (img) { abrirFoto(img.src); return; }
    if (e.target.closest && e.target.closest('#lb')) { fecharFoto(); return; }

    /* Anterior / Seguinte: passa pela página inicial com o coração a voar */
    var a = e.target.closest && e.target.closest('a[data-voo]');
    if (a && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      location.href = 'index.html?voo=' + a.getAttribute('data-voo');
    }
  });

  /* ---- Página inicial: coração a passar de mês em mês ---- */
  var grid = document.getElementById('grid');
  if (!grid) return;
  var par = new URLSearchParams(location.search).get('voo');
  if (!par) return;
  var ids = par.split(',');
  var a = grid.querySelector('.m[data-id="' + ids[0] + '"]');
  var b = grid.querySelector('.m[data-id="' + ids[1] + '"]');
  if (!a || !b) return;
  var destino = b.getAttribute('href');

  function seguir() { location.replace(destino); }
  if (reduzir) { seguir(); return; }

  function voar() {
    a.scrollIntoView({ block: 'center' });
    var rb = b.getBoundingClientRect();
    if (rb.top < 20 || rb.bottom > innerHeight - 20) b.scrollIntoView({ block: 'center' });
    var A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
    var x0 = A.left + A.width / 2, y0 = A.top + A.height / 2;
    var x1 = B.left + B.width / 2, y1 = B.top + B.height / 2;
    var mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 70;
    var dur = 1100;
    [[34, 0, 1], [18, 90, .7], [14, 170, .5], [11, 250, .35], [9, 330, .25]].forEach(function (c, k) {
      var s = c[0], dl = c[1], op = c[2];
      var e = document.createElement('div');
      e.className = 'flyh';
      e.textContent = '\u2764\ufe0f';
      e.style.fontSize = s + 'px';
      document.body.appendChild(e);
      var o = s / 2;
      function t(x, y, sc) { return 'translate(' + (x - o) + 'px,' + (y - o) + 'px) scale(' + sc + ')'; }
      var an = e.animate([
        { transform: t(x0, y0, .4), opacity: 0 },
        { transform: t(x0, y0, 1.1), opacity: op, offset: .12 },
        { transform: t(mx, my, 1.5), opacity: op, offset: .55 },
        { transform: t(x1, y1, 1), opacity: op, offset: .9 },
        { transform: t(x1, y1, 1.6), opacity: 0 }
      ], { duration: dur, delay: dl, easing: 'ease-in-out', fill: 'both' });
      an.onfinish = function () { e.remove(); };
      if (k === 0) an.onfinish = function () {
        e.remove();
        b.classList.add('pulse');
        setTimeout(seguir, 550);
      };
    });
  }
  if (document.readyState === 'complete') setTimeout(voar, 150);
  else window.addEventListener('load', function () { setTimeout(voar, 150); });
})();
