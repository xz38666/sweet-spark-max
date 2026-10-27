import {freshBoard,matches,swap,adjacent,legalMoves,collapse,levelConfig,points} from './engine.mjs';
import {LEVEL_COUNT,worlds,starsFor,readProgress} from './campaign.mjs';
import {themes,artwork} from './themes.mjs';
const $=id=>document.getElementById(id);
let board,selected=null,busy=false,finished=false,level=1,score=0,levelScore=0,moves=30,best=0,sound=false,audio=null,modalAction=null,pointer=null,swiped=false,theme='candy',progress={level:1,stars:{}},chapter=0;
let hintTimer;
try{best=Number(localStorage.getItem('sweet-spark-best'))||0;sound=localStorage.getItem('sweet-spark-sound')==='1';}catch{}
try{progress=readProgress(localStorage.getItem('sweet-spark-campaign'));level=progress.level;const saved=localStorage.getItem('sweet-spark-theme');if(Object.hasOwn(themes,saved))theme=saved;}catch{}
function store(key,value){try{localStorage.setItem(key,String(value));}catch{}}
function gem(type,index){return artwork(theme,type,'g'+index);}
function render(drops=[]){
 const focused=document.activeElement?.dataset?.index;
 $('board').innerHTML=board.map((t,i)=>`<button class="cell${i===selected?' selected':''}${drops.some(d=>d.index===i&&d.distance>0)?' falling':''}" style="--drop:${drops.find(d=>d.index===i)?.distance||0}" data-index="${i}" aria-label="${themes[theme].names[t]}, ряд ${Math.floor(i/8)+1}, столбец ${i%8+1}" aria-pressed="${i===selected}" ${(busy||finished)?'disabled':''}>${gem(t,i)}</button>`).join('');
 if(focused!==undefined&&!busy)$('board').children[Number(focused)]?.focus({preventScroll:true});update();scheduleHint();
}
function canHint(){return !busy&&!finished&&!document.hidden&&!$('modal').open&&!$('picker').open;}
function scheduleHint(){clearTimeout(hintTimer);if(canHint())hintTimer=setTimeout(()=>showHint(true),50000);}
function showHint(automatic=false){
 clearTimeout(hintTimer);if(!canHint())return;
 const hint=legalMoves(board)[0];if(!hint)return;
 selected=null;render();clearTimeout(hintTimer);
 hint.forEach(i=>$('board').children[i].classList.add('hinted'));
 message(automatic?'Есть ход! Поменяй две подсвеченные фишки ✨':'Поменяй две подсвеченные фишки — получится три в ряд ✧');
}
function update(){const target=levelConfig(level).target;$('level').textContent='Уровень '+level+' / '+LEVEL_COUNT;$('score').textContent=score.toLocaleString('ru-RU');$('moves').textContent=moves;$('target').textContent=target.toLocaleString('ru-RU');$('best').textContent=best.toLocaleString('ru-RU');$('progress').style.width=Math.min(100,levelScore/target*100)+'%';const p=document.querySelector('.progress');p.setAttribute('aria-valuemax',target);p.setAttribute('aria-valuenow',Math.min(target,levelScore));for(const id of ['hint','restart','levels','theme'])$(id).disabled=busy;$('theme').textContent=themes[theme].icon+' '+themes[theme].label+' ▾';$('world-name').textContent=levelConfig(level).world+(levelConfig(level).finale?' · Финал главы ✦':' · '+(progress.stars[level]?'★'.repeat(progress.stars[level]):'Вперёд к новым искрам'));}
function soundUI(){$('sound').setAttribute('aria-pressed',sound);$('sound').setAttribute('aria-label',sound?'Выключить звук':'Включить звук');$('sound').textContent=sound?'♫':'♪';}
function tone(chain=1){if(!sound||document.hidden)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const now=audio.currentTime;[0,4,7].forEach((n,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=330*2**((n+chain*2)/12);g.gain.setValueAtTime(0,now+i*.055);g.gain.linearRampToValueAtTime(.045,now+i*.055+.01);g.gain.exponentialRampToValueAtTime(.001,now+i*.055+.22);o.connect(g);g.connect(audio.destination);o.start(now+i*.055);o.stop(now+i*.055+.23);});}catch{}}
const delay=ms=>new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?1:ms));
function message(text){$('message').textContent=text;}
function modal(title,text,actionLabel,action,cancel=false){$('modal-title').textContent=title;$('modal-text').textContent=text;$('modal-action').textContent=actionLabel;$('modal-cancel').hidden=!cancel;modalAction=action;$('modal').showModal();}
function start(reset=true){if(reset)score=0;finished=false;levelScore=0;moves=levelConfig(level).moves;selected=null;busy=false;board=freshBoard();progress.level=level;saveProgress();message('Твой следующий ход может быть волшебным ✨');render();}
function saveProgress(){store('sweet-spark-campaign',JSON.stringify(progress));}
function themePicker(){if(busy)return;$('picker-title').textContent='Чем играем?';$('picker-content').innerHTML='<p class="picker-subtitle">Меняй настроение в любой момент — твой ход сохранится.</p><div class="theme-options">'+Object.entries(themes).map(([id,t])=>`<button class="theme-option ${theme===id?'active':''}" data-theme="${id}" aria-pressed="${theme===id}"><span class="theme-preview">${[0,1,2,3,4,5].map((n)=>artwork(id,n,'preview-'+id+n)).join('')}</span><strong>${t.icon} ${t.label} ${theme===id?'✓':''}</strong><span>${t.description}</span></button>`).join('')+'</div>';$('picker').showModal();}
function levelPicker(){if(busy)return;$('picker-title').textContent='100 маленьких приключений';drawMap();$('picker').showModal();}
function drawMap(){const completed=Object.keys(progress.stars).length,total=Object.values(progress.stars).reduce((a,b)=>a+b,0);$('picker-content').innerHTML=`<p class="picker-subtitle">Пройдено ${completed} / 100 · ★ ${total} / 300<br>Все уровни открыты. Выбирай любой!</p><div class="chapter-tabs" aria-label="Главы">${worlds.map((w,i)=>`<button data-chapter="${i}" aria-pressed="${i===chapter}" title="${w}">${i+1}</button>`).join('')}</div><h3 class="chapter-title">${worlds[chapter]}</h3><div class="level-grid">${Array.from({length:10},(_,i)=>{const n=chapter*10+i+1,c=levelConfig(n);return `<button class="level-card ${n===level?'current':''} ${progress.stars[n]?'complete':''}" data-level="${n}" aria-label="Уровень ${n}, цель ${c.target}, ${c.moves} ходов${progress.stars[n]?', пройден на '+progress.stars[n]+' звезды':''}"><strong>${n}${c.finale?' ✦':''}</strong><span>${progress.stars[n]?'★'.repeat(progress.stars[n]):'☆☆☆'}</span><small>${c.target} очков</small></button>`;}).join('')}</div><p class="picker-footnote">Выбор уровня начинает новую попытку. Звёзды и рекорд сохраняются.</p>`;}
$('theme').onclick=themePicker;$('levels').onclick=()=>{chapter=levelConfig(level).chapter;levelPicker();};$('picker-close').onclick=()=>$('picker').close();
$('picker-content').onclick=e=>{const option=e.target.closest('[data-theme]');if(option){theme=option.dataset.theme;store('sweet-spark-theme',theme);selected=null;render();$('picker').close();message('Играем: '+themes[theme].label.toLowerCase()+' ✨');return;}const tab=e.target.closest('[data-chapter]');if(tab){chapter=Number(tab.dataset.chapter);drawMap();return;}const card=e.target.closest('[data-level]');if(card){level=Number(card.dataset.level);$('picker').close();start();}};
async function animateSwap(a,b){const ca=$('board').children[a],cb=$('board').children[b],dx=(b%8-a%8)*ca.getBoundingClientRect().width+(b%8-a%8)*parseFloat(getComputedStyle($('board')).gap),dy=((b/8|0)-(a/8|0))*(ca.getBoundingClientRect().height+parseFloat(getComputedStyle($('board')).gap));ca.style.transition=cb.style.transition='transform .18s';ca.style.zIndex=cb.style.zIndex='2';ca.style.transform=`translate(${dx}px,${dy}px)`;cb.style.transform=`translate(${-dx}px,${-dy}px)`;await delay(190);}
async function move(a,b){
 if(busy||finished||!adjacent(a,b)||$('modal').open)return;
 busy=true;selected=null;clearTimeout(hintTimer);update();[...$('board').children].forEach(c=>{c.disabled=true;c.classList.remove('hinted');});await animateSwap(a,b);board=swap(board,a,b);render();
 let hit=matches(board);
 if(!hit.length){await animateSwap(a,b);board=swap(board,a,b);busy=false;render();message('Собери хотя бы три одинаковых. Ход сохранён!');return;}
 moves--;let chain=0,gained=0;
 while(hit.length){chain++;const add=points(hit.length,chain);score+=add;levelScore+=add;gained+=add;if(score>best){best=score;store('sweet-spark-best',best);}update();tone(chain);hit.forEach(i=>$('board').children[i].classList.add('popping'));$('combo').textContent=chain>1?`Каскад ×${chain} · +${add}`:`+${add} ✦`;$('combo').classList.remove('show');void $('combo').offsetWidth;$('combo').classList.add('show');await delay(250);
  const result=collapse(board,hit);board=result.board;render(result.drops);await delay(320);hit=matches(board);
 }
 busy=false;render();message(chain>1?`Сладкий каскад ×${chain}! +${gained} очков ✨`:`Отлично! +${gained} очков ✨`);
 if(levelScore>=levelConfig(level).target){finished=true;render();const stars=starsFor(moves,levelConfig(level).moves);progress.stars[level]=Math.max(progress.stars[level]||0,stars);saveProgress();update();tone(5);modal(level===LEVEL_COUNT?'Сотый уровень покорён! ✨':'Ты — искра! '+ '★'.repeat(stars),`Уровень ${level} пройден на ${stars} из 3 звёзд.\nВсего ${score.toLocaleString('ru-RU')} очков.${level===LEVEL_COUNT?' Вернись на карту и собери звёзды на остальных уровнях!':' Впереди ещё больше маленьких побед!'}`,level===LEVEL_COUNT?'На карту':'Уровень '+(level+1),()=>{if(level===LEVEL_COUNT){chapter=9;levelPicker();}else{level++;start(false);}});}
 else if(moves===0){finished=true;render();modal('Сладкий перерыв 🍬',`Ходы закончились. Ты набрала ${score.toLocaleString('ru-RU')} очков!\nПопробуем ещё раз?`,'Играть снова',()=>start());}
 else if(!legalMoves(board).length){board=freshBoard();render();message('Новых комбинаций не было — я перемешала поле ✨');}
}
function choose(i){if(busy||$('modal').open)return;document.querySelectorAll('.hinted').forEach(c=>c.classList.remove('hinted'));if(selected===i){selected=null;render();return;}if(selected!==null&&adjacent(selected,i)){void move(selected,i);return;}selected=i;render();}
$('board').addEventListener('click',e=>{if(swiped){swiped=false;return;}const cell=e.target.closest('.cell');if(cell)choose(Number(cell.dataset.index));});
$('board').addEventListener('pointerdown',e=>{swiped=false;const cell=e.target.closest('.cell');if(cell&&!busy){pointer={id:e.pointerId,index:Number(cell.dataset.index),x:e.clientX,y:e.clientY};}});
$('board').addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const {index,x,y}=pointer;pointer=null;const dx=e.clientX-x,dy=e.clientY-y;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;swiped=true;const to=index+(Math.abs(dx)>Math.abs(dy)?(dx>0?1:-1):(dy>0?8:-8));if(adjacent(index,to))void move(index,to);});
$('board').addEventListener('pointercancel',()=>{pointer=null;swiped=false;});
$('board').addEventListener('keydown',e=>{const cell=e.target.closest('.cell');if(!cell)return;const i=Number(cell.dataset.index),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8}[e.key];if(delta){e.preventDefault();if(adjacent(i,i+delta))$('board').children[i+delta].focus();}if(e.key==='Escape'){selected=null;render();}});
$('hint').onclick=()=>showHint();
$('restart').onclick=()=>modal('Повторить уровень '+level+'?', 'Текущая попытка начнётся заново. Звёзды и рекорд сохранятся.','Начать заново',()=>start(),true);
$('help').onclick=()=>modal('Три шага к магии','1. Нажми на конфету и на соседнюю — или смахни её в сторону.\n2. Собери от 3 одинаковых по горизонтали или вертикали. Каскады приносят больше очков.\n3. Набери цель уровня, пока есть ходы. Подсказки бесплатные!\n\nКлавиатура: стрелки — выбор клетки, Enter или пробел — выбор конфеты.','Понятно!',()=>{});
$('sound').onclick=()=>{sound=!sound;store('sweet-spark-sound',sound?'1':'0');soundUI();if(sound)tone();};
$('modal-action').onclick=()=>{$('modal').close();const action=modalAction;modalAction=null;action?.();};$('modal-cancel').onclick=()=>$('modal').close();
$('modal').addEventListener('cancel',e=>{if($('modal-cancel').hidden)e.preventDefault();});
for(const dialog of [$('modal'),$('picker')])dialog.addEventListener('close',scheduleHint);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(hintTimer);else scheduleHint();});
function ready(){try{window.WebApp?.ready?.();}catch{}}
soundUI();start();ready();document.querySelector('script[src*="max-web-app.js"]')?.addEventListener('load',ready,{once:true});window.addEventListener('load',ready,{once:true});
