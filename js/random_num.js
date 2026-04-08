const minim = document.getElementById('min');
const maxim = document.getElementById('max');
const generation = document.getElementById('genNum');
const result = document.getElementById('resultNum');

function generateNum()
{
   let min = Number(minim.value);
   let max = Number(maxim.value);

   if (min > max) 
   {
    [min, max] = [max, min]
   }

   const RandNum = Math.floor(Math.random() * (max - min + 1)) + min;

    animateNumber(result, RandNum, 800);

    console.log(min, max, RandNum);
}

generation.addEventListener('click', generateNum);

function animateNumber(element, targetValue, duration = 800) {
    const startValue = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(update);
}