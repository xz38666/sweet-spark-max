export const SIZE=8, TYPES=6;
export const adjacent=(a,b)=>a>=0&&b>=0&&a<64&&b<64&&Math.abs(a%8-b%8)+Math.abs((a/8|0)-(b/8|0))===1;
export function matches(board){
 const hit=new Set();
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){
  const i=r*8+c,t=board[i]; if(t==null)continue;
  if(c<6&&board[i+1]===t&&board[i+2]===t){let x=c;while(x<8&&board[r*8+x]===t)hit.add(r*8+x++);}
  if(r<6&&board[i+8]===t&&board[i+16]===t){let y=r;while(y<8&&board[y*8+c]===t)hit.add(y++*8+c);}
 }return [...hit];
}
export function swap(board,a,b){const next=[...board];[next[a],next[b]]=[next[b],next[a]];return next;}
export function legalMoves(board){const out=[];for(let a=0;a<64;a++)for(const b of [a+1,a+8])if(adjacent(a,b)&&matches(swap(board,a,b)).length)out.push([a,b]);return out;}
export function freshBoard(random=Math.random){
 for(let attempt=0;attempt<1000;attempt++){
  const b=[];for(let i=0;i<64;i++){const choices=[0,1,2,3,4,5].filter(t=>!(i%8>=2&&b[i-1]===t&&b[i-2]===t)&&!(i>=16&&b[i-8]===t&&b[i-16]===t));b.push(choices[Math.floor(random()*choices.length)]);}
  if(legalMoves(b).length)return b;
 }throw Error('Не удалось создать поле');
}
export function collapse(board,hit,random=Math.random){
 const next=[...board],removed=new Set(hit),drops=[];
 for(let c=0;c<8;c++){let to=7;for(let r=7;r>=0;r--)if(!removed.has(r*8+c)){next[to*8+c]=board[r*8+c];drops.push({index:to*8+c,distance:to-r});to--;}
  while(to>=0){next[to*8+c]=Math.floor(random()*TYPES);drops.push({index:to*8+c,distance:to+1});to--;}
 }return {board:next,drops};
}
export {levelConfig} from './campaign.mjs';
export const points=(count,chain)=>count*30*Math.min(chain,5);
