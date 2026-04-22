function wheelOfFortune(selector) {
  const node = document.querySelector(selector);
  if (!node) return;

  const spinBtn = node.querySelector('button');
  const wheel = node.querySelector('ul');
  const container = node; // .ui-wheel-of-fortune

  let animation;
  let previousEndDegree = 0;

  // Элементы редактора
  const editorDiv = document.getElementById('itemsEditor');
  const addBtn = document.getElementById('addItemBtn');
  const removeLastBtn = document.getElementById('removeLastBtn');
  const resetBtn = document.getElementById('resetWheelBtn');
  const resultDiv = document.getElementById('spinResult');

  // Стандартный набор (12 секторов)
  const DEFAULT_ITEMS = ['$1000', '$2000', '$3000', '$4000', '$5000', '$6000', '$7000', '$8000', '$9000', '$10000', '$11000', '$12000'];

  // Текущий массив значений секторов
  let currentItems = [...DEFAULT_ITEMS];

  // === Функция перерисовки редактора (поля ввода) ===
  function renderEditor() {
      editorDiv.innerHTML = '';
      currentItems.forEach((value, index) => {
          const row = document.createElement('div');
          row.className = 'item-row';

          const input = document.createElement('input');
          input.type = 'text';
          input.value = value;
          input.addEventListener('input', (e) => {
              currentItems[index] = e.target.value;
          });

          const delBtn = document.createElement('button');
          delBtn.textContent = '✕';
          delBtn.title = 'Удалить сектор';
          delBtn.addEventListener('click', () => {
              if (currentItems.length <= 1) {
                  alert('Должен остаться хотя бы один сектор.');
                  return;
              }
              currentItems.splice(index, 1);
              rebuildWheel();
              renderEditor();
          });

          row.appendChild(input);
          row.appendChild(delBtn);
          editorDiv.appendChild(row);
      });
  }

  // === Расчёт ширины li для обеспечения полного круга ===
  function calculateLiWidth(count) {
      // Базовая ширина (радиус колеса) в процентах от container width (1cqi = 1% ширины контейнера)
      // Исходно было width: 50cqi, что соответствовало радиусу 50% от ширины контейнера.
      // При малом количестве секторов (1,2,3) угол сектора большой, и чтобы заполнить круг, ширина должна быть больше.
      // Формула: ширина = 50% / sin(180° / count) ? Это из геометрии: чтобы вершина сектора достигла центра, а основание покрывало дугу.
      // Практически: для count=1 нужен полный круг (можно задать width: 100cqi, но тогда clip-path даст треугольник на весь круг? 
      // Проще: при count=1 делаем width: 100cqi и aspect-ratio: 1/1, но тогда текст будет в центре? 
      // Лучше использовать другой подход: для любого количества задаём ширину как 50 / cos(180°/count) или что-то подобное.
      // Но изначальная формула aspect-ratio уже даёт правильную высоту для сектора, ширина должна быть подобрана так, чтобы сектора сошлись в центре.
      // На самом деле, правильная ширина li = 50cqi / sin(180°/count) (проверено для count=12: sin(15°)=0.2588, 50/0.2588≈193, что не соответствует 50).
      // Возможно, нужно оставить width: 50cqi всегда, а проблема была в aspect-ratio? Проверим.
      // Исходно работало для 12. Для малых count высота li становится огромной из-за tan(180/count), и сектора выходят за границы.
      // Решение: ограничить высоту li с помощью max-height или пересчитать aspect-ratio.
      // Я предлагаю оставить width: 50cqi, но ограничить высоту через max-height: 100cqi, чтобы сектор не вылезал за круг.
      // Альтернатива: для малых count задавать width меньше.
      // Давай сделаем динамически: width = 50 * tan(180/count) cqi? Но это даст очень маленькую ширину для малых count.
      // Проще: использовать JavaScript для установки кастомного значения --_item-width и задать width: var(--_item-width).
      // Начнём с простого: для count >= 4 оставим width: 50cqi, для count < 4 уменьшим ширину.
      if (count >= 4) return 50; // cqi
      else if (count === 3) return 35;
      else if (count === 2) return 25;
      else return 20; // для 1
  }

  // === Функция перестроения колеса из массива currentItems ===
  function rebuildWheel() {
      const count = currentItems.length;
      container.style.setProperty('--_items', count);

      // Очищаем ul
      wheel.innerHTML = '';

      // Вычисляем подходящую ширину li
      const widthCqi = calculateLiWidth(count);

      // Создаём li с нужным --_idx и шириной
      currentItems.forEach((text, idx) => {
          const li = document.createElement('li');
          li.textContent = text;
          li.style.setProperty('--_idx', idx + 1);
          li.style.width = widthCqi + 'cqi';
          // Для count=1 особый случай: делаем круг
          if (count === 1) {
              li.style.clipPath = 'circle(50% at 50% 50%)';
              li.style.aspectRatio = '1 / 1';
              li.style.rotate = '0deg';
              li.style.background = 'linear-gradient(90deg, #195210, #22854b)';
          } else {
              // восстанавливаем clip-path, если был изменён
              li.style.clipPath = 'polygon(0% 0%, 100% 50%, 0% 100%)';
              li.style.aspectRatio = `1 / calc(2 * tan(180deg / ${count}))`;
          }
          wheel.appendChild(li);
      });

      // Сбрасываем поворот
      previousEndDegree = 0;
      wheel.style.transform = `rotate(0deg)`;
      if (animation) {
          animation.cancel();
          animation = null;
      }
      resultDiv.textContent = '';
  }

  // === Сброс к стандартному набору ===
  function resetToDefault() {
      currentItems = [...DEFAULT_ITEMS];
      renderEditor();
      rebuildWheel();
  }

  // === Добавить новый сектор ===
  function addItem() {
      currentItems.push('Новое');
      renderEditor();
      rebuildWheel();
  }

  // === Удалить последний сектор ===
  function removeLastItem() {
      if (currentItems.length <= 1) {
          alert('Должен остаться хотя бы один сектор.');
          return;
      }
      currentItems.pop();
      renderEditor();
      rebuildWheel();
  }

  // === Инициализация ===
  function init() {
      resetToDefault();

      addBtn.addEventListener('click', addItem);
      removeLastBtn.addEventListener('click', removeLastItem);
      resetBtn.addEventListener('click', resetToDefault);
  }

  // === Вращение колеса с определением результата ===
  spinBtn.addEventListener('click', () => {
      const items = currentItems;
      if (items.length === 0) return;

      if (animation) {
          animation.cancel();
      }

      const randomAdditionalDegrees = Math.random() * 360 + 1800;
      const newEndDegree = previousEndDegree + randomAdditionalDegrees;

      animation = wheel.animate([
          { transform: `rotate(${previousEndDegree}deg)` },
          { transform: `rotate(${newEndDegree}deg)` }
      ], {
          duration: 4000,
          direction: 'normal',
          easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
          fill: 'forwards',
          iterations: 1
      });

      animation.onfinish = () => {
          const finalAngle = newEndDegree % 360;
          const segmentAngle = 360 / items.length;
          
          let normalizedAngle = (360 - finalAngle + segmentAngle / 2) % 360;
          let index = Math.floor(normalizedAngle / segmentAngle) % items.length;
          
          const result = items[index];
          resultDiv.textContent = `🎉 Выпало: ${result} 🎉`;
          
          previousEndDegree = newEndDegree;
          animation = null;
      };
  });

  init();
}

window.addEventListener('DOMContentLoaded', () => {
  wheelOfFortune('.ui-wheel-of-fortune');
});