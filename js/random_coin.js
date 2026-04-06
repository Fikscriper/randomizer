function tossCoinAnimation(coinImg) {
    // Добавляем класс для анимации подкидывания
    coinImg.classList.add('coin-tossing');
    
    // Убираем класс после окончания анимации
    setTimeout(() => {
        coinImg.classList.remove('coin-tossing');
        
        // Добавляем эффект "пружинки"
        coinImg.classList.add('coin-bounce');
        setTimeout(() => {
            coinImg.classList.remove('coin-bounce');
        }, 150);
    }, 800);
}

const generation = document.getElementById('genNum');
const result = document.getElementById('resultNum');

function CoinRoll()
{
   const RandNum = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    result.textContent = RandNum;
    minim.

    console.log(RandNum);
}

generation.addEventListener('click', CoinRoll);