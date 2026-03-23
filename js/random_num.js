const minim = document.getElementById('min');
const maxim = document.getElementById('max');
const generation = document.getElementById('genNum');
const result = document.getElementById('resultNum');

function generateNum()
{
   let min = Number(minim.value);
   let max = Number(maxim.value);

   const RandNum = Math.floor(Math.random() * (max - min + 1)) + min;
    result.textContent = RandNum;

    console.log(min, max, RandNum);
}

generation.addEventListener('click', generateNum);