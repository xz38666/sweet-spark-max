export const LEVEL_COUNT=100;
export const worlds=['Сахарный сад','Мятная долина','Медовые холмы','Ягодный лес','Лазурный берег','Кристальные пещеры','Карамельный город','Облачные острова','Звёздная тропа','Долина искр'];
export function levelConfig(level){const n=Math.max(1,Math.min(LEVEL_COUNT,Math.trunc(level)||1));return {target:900+(n-1)*24,moves:30-Math.floor((n-1)/20)*2-(n%10===0?2:0),world:worlds[Math.floor((n-1)/10)],chapter:Math.floor((n-1)/10),finale:n%10===0};}
export function starsFor(moves,total){return moves>=total*.4?3:moves>=total*.2?2:1;}
export function readProgress(raw){let data;try{data=JSON.parse(raw);}catch{}const stars={};for(let n=1;n<=LEVEL_COUNT;n++){const v=data?.stars?.[n];if(Number.isInteger(v)&&v>=1&&v<=3)stars[n]=v;}return {level:Math.max(1,Math.min(LEVEL_COUNT,Math.trunc(Number(data?.level))||1)),stars};}
