// js/nes-ui.js
// Требует, чтобы в странице раньше подключились:
// <script src="nsf-player/libgme/libgme.js"></script>
// <script src="nsf-player/index.js"></script>

// Дожидаемся полной инициализации libgme.js
if (typeof Module !== 'undefined') {
  Module.onRuntimeInitialized = function() {
    document.addEventListener('DOMContentLoaded', () => {
      // 1) Создаём плеер и сразу запускаем трек
      const nsf = createNsfPlayer();               // приходит из index.js
      nsf.play('music/Legend of Zelda, The (1987-08-22)(Nintendo EAD)(Nintendo).nsf', 0);               // первый трек в .nsf
    
      // 2) Подмешиваем узел громкости
      if (!nsf.ctx) {
        alert('Ошибка: nsf.ctx не инициализирован!');
        return;
      }
      const gain = nsf.ctx.createGain();
      nsf._node.disconnect();                      // _node — внутренний ScriptProcessor
      nsf._node.connect(gain).connect(nsf.ctx.destination);
    
      // 3) Мини-интерфейс под элементом #player
      const box = document.getElementById('player');
      box.innerHTML = `
        <button id="btnPlay">▶︎</button>
        <button id="btnStop">■</button>
        <label style="margin-left:.75rem">
          Vol <input id="vol" type="range" min="0" max="1" step="0.01" value="1">
        </label>
      `;
    
      // 4) Обработчики
      document.getElementById('btnPlay').onclick = () => nsf.play(); // продолжить
      document.getElementById('btnStop').onclick = () => nsf.stop(); // стоп
      document.getElementById('vol').oninput     = e => {
        gain.gain.value = Number(e.target.value);
      };
    
      // (опционально) экспорт для дальнейших экспериментов
      window.nsfDebug = { nsf, gain };
    });
  };
} else {
  document.addEventListener('DOMContentLoaded', () => {
    alert('Ошибка: libgme.js (Module) не загружен!');
  });
}
  