function wheelOfFortune(selector) {
    const node = document.querySelector(selector);
    if (!node) return;

    const spinBtn = node.querySelector('button');
    const wheel = node.querySelector('ul');
    const container = node;

    let animation;
    let previousEndDegree = 0;

    const editorDiv = document.getElementById('itemsEditor');
    const addBtn = document.getElementById('addItemBtn');
    const removeLastBtn = document.getElementById('removeLastBtn');
    const resetBtn = document.getElementById('resetWheelBtn');
    const resultDiv = document.getElementById('spinResult');

    const DEFAULT_ITEMS = ['$1000', '$2000', '$3000', '$4000', '$5000', '$6000', '$7000', '$8000', '$9000', '$10000', '$11000', '$12000'];
    let currentItems = [...DEFAULT_ITEMS];

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

    function rebuildWheel() {
        const count = currentItems.length;
        container.style.setProperty('--_items', count);

        const containerWidth = container.getBoundingClientRect().width;
        const radius = containerWidth / 2;

        wheel.innerHTML = '';
        wheel.style.transformOrigin = 'center center';

        if (count === 1) {
            // Один сектор – цельный круг
            const li = document.createElement('li');
            li.textContent = currentItems[0];
            li.classList.add('single');
            wheel.appendChild(li);
        } else if (count === 2) {
            // Два полукруга
            currentItems.forEach((text, idx) => {
                const li = document.createElement('li');
                li.textContent = text;
                li.classList.add('half');
                // Прямоугольник на всю высоту, шириной 50%, правый край в центре
                li.style.width = '50%';
                li.style.height = '100%';
                li.style.marginTop = '0';
                li.style.transform = `rotate(${idx * 180}deg)`;
                wheel.appendChild(li);
            });
        } else {
            // Три и более секторов – треугольники
            let sectorHeight;
            if (count === 2) {
                // tan(90°) бесконечность, но этот блок не выполнится, оставлено для логики
                sectorHeight = containerWidth * 2;
            } else {
                const angleRad = Math.PI / count;
                sectorHeight = 2 * radius * Math.tan(angleRad);
            }

            currentItems.forEach((text, idx) => {
                const li = document.createElement('li');
                li.textContent = text;
                li.style.height = `${sectorHeight}px`;
                li.style.marginTop = `-${sectorHeight / 2}px`;
                const rotateDeg = (360 / count) * idx;
                li.style.transform = `rotate(${rotateDeg}deg)`;
                wheel.appendChild(li);
            });
        }

        previousEndDegree = 0;
        wheel.style.transform = `rotate(0deg)`;
        if (animation) {
            animation.cancel();
            animation = null;
        }
        resultDiv.textContent = '';
    }

    function resetToDefault() {
        currentItems = [...DEFAULT_ITEMS];
        renderEditor();
        rebuildWheel();
    }

    function addItem() {
        currentItems.push('Новое');
        renderEditor();
        rebuildWheel();
    }

    function removeLastItem() {
        if (currentItems.length <= 1) {
            alert('Должен остаться хотя бы один сектор.');
            return;
        }
        currentItems.pop();
        renderEditor();
        rebuildWheel();
    }

    function init() {
        resetToDefault();
        addBtn.addEventListener('click', addItem);
        removeLastBtn.addEventListener('click', removeLastItem);
        resetBtn.addEventListener('click', resetToDefault);
        window.addEventListener('resize', rebuildWheel);
    }

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