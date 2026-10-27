const palette=[['#ff9bbf','#e94b88'],['#95e5ce','#38b99d'],['#ffe49b','#edb43d'],['#c4a2fa','#9560d6'],['#ffa8a8','#ed6c89'],['#9adff7','#4bb6df']];
export const themes={
 candy:{label:'Конфеты',icon:'🍬',description:'Леденцы, мармелад и сладкие сердечки',names:['Малиновый леденец','Мятная конфета','Медовый мармелад','Черничная конфета','Клубничное сердечко','Голубой леденец'],palette,shapes:[
 '<path d="m15 20-11-6 2 14-2 14 11-6m26-16 11-6-2 14 2 14-11-6"/><rect x="12" y="14" width="32" height="28" rx="11"/>',
 '<rect x="9" y="9" width="38" height="38" rx="14"/><path d="m15 15 26 26m-14-29 17 17" fill="none" stroke="white" stroke-opacity=".35" stroke-width="5"/>',
 '<path d="m28 5 7 14 16 3-12 12 2 17-13-8-14 8 3-17L5 22l16-3Z"/>',
 '<ellipse cx="28" cy="28" rx="23" ry="18" transform="rotate(-30 28 28)"/><path d="m20 15 15 25m-5-28 12 20" fill="none" stroke="white" stroke-opacity=".4" stroke-width="4"/>',
 '<path d="M28 49C15 40 4 32 6 20 8 7 22 7 28 17 35 6 49 8 51 20 53 32 40 42 28 49Z"/>',
 '<circle cx="28" cy="28" r="22"/><path d="M14 28c0-17 29-17 29 0S20 43 20 28s15-8 15 0" fill="none" stroke="white" stroke-opacity=".5" stroke-width="3"/>']},
 crystal:{label:'Кристаллы',icon:'💎',description:'Сияющие грани и драгоценные камни',names:['Розовый рубин','Зелёный изумруд','Золотой самоцвет','Фиолетовый аметист','Коралловый гранат','Голубой сапфир'],palette,shapes:[
 '<path d="m28 3 22 25-22 25L6 28Z"/><path d="m28 3 8 25-8 25-8-25Zm-22 25h44" fill="none" stroke="white" stroke-opacity=".4"/>',
 '<path d="m17 5 23 5 10 18-17 23-23-7-5-23Z"/><path d="m17 5 4 15 15 3 14 5M10 44l11-24m12 31 3-28" fill="none" stroke="white" stroke-opacity=".4"/>',
 '<path d="m15 7 26 0 12 17-25 28L3 24Z"/><path d="m15 7 4 17 9 28 9-28 4-17M3 24h50" fill="none" stroke="white" stroke-opacity=".45"/>',
 '<path d="m28 3 15 11 4 28-19 11L9 42l4-28Z"/><path d="m28 3-6 18 6 32 7-32L28 3M13 14l9 7 13 0 8-7M9 42l13-21m25 21L35 21" fill="none" stroke="white" stroke-opacity=".4"/>',
 '<path d="m17 5 23 0 12 13 0 23-13 11H16L4 39V17Z"/><path d="m17 5 2 13 20 0 1-13M4 17l15 1-2 21-13 0m48-21-13 0 0 21 13 2M16 52l1-13h22v13" fill="none" stroke="white" stroke-opacity=".4"/>',
 '<path d="m28 3 24 16-9 30H13L4 19Z"/><path d="m28 3-9 20 9 26 10-26L28 3M4 19l15 4h19l14-4" fill="none" stroke="white" stroke-opacity=".45"/>']},
 block:{label:'Блоки',icon:'🧩',description:'Объёмные кубики с шестью узорами',names:['Розовый блок с кругом','Мятный блок с крестом','Жёлтый блок с треугольником','Фиолетовый блок с ромбом','Коралловый блок с сердцем','Голубой блок с полосками'],palette,shapes:[
 '<rect x="6" y="6" width="44" height="44" rx="8"/><circle cx="28" cy="28" r="10" fill="white" fill-opacity=".6"/>',
 '<rect x="6" y="6" width="44" height="44" rx="8"/><path d="M28 17v22m-11-11h22" stroke="white" stroke-opacity=".65" stroke-width="6" stroke-linecap="round"/>',
 '<rect x="6" y="6" width="44" height="44" rx="8"/><path d="m28 16 13 23H15Z" fill="white" fill-opacity=".65"/>',
 '<rect x="6" y="6" width="44" height="44" rx="8"/><path d="m28 14 14 14-14 14-14-14Z" fill="white" fill-opacity=".65"/>',
 '<rect x="6" y="6" width="44" height="44" rx="8"/><path d="M28 39c-22-13-11-29 0-17 11-12 22 4 0 17Z" fill="white" fill-opacity=".65"/>',
 '<rect x="6" y="6" width="44" height="44" rx="8"/><path d="M17 19h22M17 28h22M17 37h22" stroke="white" stroke-opacity=".65" stroke-width="4" stroke-linecap="round"/>']}
};
export function artwork(theme,type,id){const t=themes[theme]||themes.candy,[a,b]=t.palette[type];return `<svg viewBox="0 0 56 56" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><g fill="url(#${id})" stroke="${b}" stroke-width="1.2">${t.shapes[type]}</g><path d="M16 21q1-7 9-7" fill="none" stroke="white" stroke-opacity=".6" stroke-width="2.5" stroke-linecap="round"/></svg>`;}
