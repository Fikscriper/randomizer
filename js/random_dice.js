        const diceTypeSelect = document.getElementById('diceType');
        const rollBtn = document.getElementById('rollBtn');
        const resultDiv = document.getElementById('result');
        


        function rollDice() {
            let changes = 0;
            const totalChanges = 12;
            const sides = 6;
    
            const interval = setInterval(() => {

        const randomResult = Math.floor(Math.random() * sides) + 1;
        diceImg.src = `images/6dice-${randomResult}.png`;
        changes++;
        
        if (changes >= totalChanges) {
            clearInterval(interval);
            
            const finalResult = Math.floor(Math.random() * sides) + 1;
            diceImg.src = `images/6dice-${finalResult}.png`;
            
            return finalResult;
        }
    }, 100);
}

        rollBtn.addEventListener('click', rollDice);

document.addEventListener('keypress', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        rollDice();
    }
});