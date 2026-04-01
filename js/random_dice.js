        const diceTypeSelect = document.getElementById('diceType');
        const rollBtn = document.getElementById('rollBtn');
        const resultDiv = document.getElementById('result');
        


        function rollDice() {
            let changes = 0;
            const totalChanges = 12; // 12 смен за 1.2 секунды
            const sides = 6;
    
            const interval = setInterval(() => {
        // Показываем случайную грань во время анимации
        const randomResult = Math.floor(Math.random() * sides) + 1;
        diceImg.src = `images/6dice-${randomResult}.png`;
        changes++;
        
        // После окончания анимации - финальный результат
        if (changes >= totalChanges) {
            clearInterval(interval);
            
            // Финальный результат
            const finalResult = Math.floor(Math.random() * sides) + 1;
            diceImg.src = `images/6dice-${finalResult}.png`;
            
            return finalResult;
        }
    }, 100); // Меняется каждые 0.1 секунды
}

        rollBtn.addEventListener('click', rollDice);

document.addEventListener('keypress', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        rollDice();
    }
});