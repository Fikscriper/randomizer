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
    const resetBtn = document.getElementById('resetWheelBtn');
    const resultDiv = document.getElementById('spinResult');

    const DEFAULT_ITEMS = ['1', '2', '3', '4', '5'];
    let currentItems = [...DEFAULT_ITEMS];

    function clearWinner() {
        const allLi = wheel.querySelectorAll('li');
        allLi.forEach(li => li.classList.remove('winner'));
    }

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
                rebuildWheel(false);
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

    function rebuildWheel(resetResult = true) {
        const count = currentItems.length;
        container.style.setProperty('--_items', count);

        const containerWidth = container.getBoundingClientRect().width;
        const radius = containerWidth / 2;

        wheel.innerHTML = '';
        wheel.style.transformOrigin = 'center center';

        if (count === 1) {
            const li = document.createElement('li');
            li.textContent = currentItems[0];
            li.classList.add('single');
            wheel.appendChild(li);
        } else
        if (count === 2) {
            currentItems.forEach((text, idx) => {
                const li = document.createElement('li');
                li.textContent = text;
                li.classList.add('half');
                li.style.width = '50%';
                li.style.height = '100%';
                li.style.marginTop = '0';
                li.style.transform = `rotate(${idx * 180}deg)`;
                wheel.appendChild(li);
            });
        } else {
            const angleRad = Math.PI / count;
            const sectorHeight = 2 * radius * Math.tan(angleRad);

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

        if (resetResult) {
            previousEndDegree = 0;
            wheel.style.transform = `rotate(0deg)`;
            if (animation) {
                animation.cancel();
                animation = null;
            }
            resultDiv.textContent = '';
            clearWinner();
        } else {
            wheel.style.transform = `rotate(${previousEndDegree}deg)`;
        }
    }

    function resetToDefault() {
        currentItems = [...DEFAULT_ITEMS];
        renderEditor();
        rebuildWheel();
    }

    function addItem() {
        currentItems.push('New');
        renderEditor();
        rebuildWheel();
    }

    function init() {
        resetToDefault();
        addBtn.addEventListener('click', addItem);
        resetBtn.addEventListener('click', resetToDefault);
        window.addEventListener('resize', () => rebuildWheel(false));
    }

    spinBtn.addEventListener('click', () => {
        const items = currentItems;

        if (animation) {
            animation.cancel();
        }
        clearWinner();


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

            const targetAngle = (90 + segmentAngle / 2) % 360;
            const adjustedAngle = (targetAngle - finalAngle + 360) % 360;
            const index = Math.floor(adjustedAngle / segmentAngle) % items.length;

            const result = items[index];
            resultDiv.textContent = `🎉 Выпало: ${result} 🎉`;

            const allLi = wheel.querySelectorAll('li');
            if (allLi[index]) {
                allLi[index].classList.add('winner');
            }

            previousEndDegree = newEndDegree;
            animation = null;
        };
    });

    init();
}

window.addEventListener('DOMContentLoaded', () => {
    wheelOfFortune('.ui-wheel-of-fortune');
});