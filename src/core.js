export const parts={raidwide:'全体攻撃',buster:'強攻撃',right:'右',left:'左',spread:'散開',center:'中央',stack:'頭割り',gather:'集合',outer:'外周',front:'前',back:'後ろ',move:'移動',wait:'待機',mitigate:'軽減',tank:'タンク',healer:'ヒーラー',marked:'マーカー対象',three:'3',two:'2',one:'1'};
export function validate(raw){
 if(!raw||raw.version!==1||typeof raw.boss!=='string'||!raw.boss.trim()||raw.boss.length>200||!Array.isArray(raw.events)||raw.events.length>1000)throw Error('ボス名とversion: 1、eventsのあるJSONを指定してください。');
 return {version:1,boss:raw.boss,events:raw.events.map((e,i)=>{
 if(!e||typeof e.name!=='string'||!e.name.trim()||e.name.length>300||!(e.time===null||Number.isFinite(e.time)&&e.time>=0&&e.time<=86400)||!Array.isArray(e.voiceParts)||e.voiceParts.some(p=>!Object.hasOwn(parts,p))||e.voiceParts.length>20||!Number.isFinite(e.voiceBefore)||e.voiceBefore<0||e.voiceBefore>120||typeof e.note!=='string'||e.note.length>5000)throw Error(`${i+1}行目のデータが不正です。`);
 return {time:e.time,name:e.name,note:e.note,voiceParts:[...e.voiceParts],voiceBefore:e.voiceBefore};})};
}
export function timedEvents(data){return data.events.map((e,index)=>({...e,index})).filter(e=>e.time!==null).sort((a,b)=>a.time-b.time||a.index-b.index);}
export function position(data,time){const list=timedEvents(data);let current=-1;for(let i=0;i<list.length;i++)if(list[i].time<=time)current=i;return {list,current,next:list[current+1]};}
export function due(data,from,to){return timedEvents(data).filter(e=>e.voiceParts.length&&Math.max(0,e.time-e.voiceBefore)>from&&Math.max(0,e.time-e.voiceBefore)<=to);}
export function clock(n){n=Math.max(0,Math.floor(n));return `${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;}
export const demo={version:1,boss:'操作サンプル（架空の時間）',events:[{time:10,name:'全体攻撃',note:'動作確認用のサンプルです。実際のボスの時間ではありません。',voiceParts:['raidwide','mitigate'],voiceBefore:5},{time:25,name:'右で頭割り',note:'右側に集合',voiceParts:['right','stack'],voiceBefore:5},{time:40,name:'中央で散開',note:'周囲と距離を取る',voiceParts:['center','spread'],voiceBefore:5},{time:55,name:'タンク強攻撃',note:'軽減を使用',voiceParts:['tank','buster'],voiceBefore:5}]};
export const peri={version:1,boss:'火精ペリ（秒数・行動順未確認）',events:[['熱波','全体攻撃、軽減'],['左方／右方炎舞 → 火の輪','詠唱と進行方向を確認。最後は足元へ'],['玉石混交・炎鎖','安全な場所へ移動して線を切る'],['昇り火','タンク強攻撃、軽減'],['炎舞四連・追火','半面を避けながら線を交代'],['左方炎舞・虚々実々','ボスの経路を確認'],['火精の呪い＋魔力の輝石','デバフを確認して散開または頭割り'],['玉石混交・幻影','最初の範囲後に対角へ移動'],['怒りの炎 → 焔光 → 叫怒の爆炎','全体攻撃、範囲回避、集合、回復']].map(([name,note])=>({time:null,name,note,voiceParts:[],voiceBefore:5}))};
