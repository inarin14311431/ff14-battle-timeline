export const parts={raidwide:'全体攻撃',buster:'強攻撃',right:'右',left:'左',spread:'散開',center:'中央',stack:'頭割り',gather:'集合',outer:'外周',front:'前',back:'後ろ',move:'移動',wait:'待機',mitigate:'軽減',tank:'タンク',healer:'ヒーラー',marked:'マーカー対象',three:'3',two:'2',one:'1'};
export const partGroups=[
 {label:'攻撃・対処',ids:['raidwide','buster','stack','pair','lightparty','spread','eightspread','gather','mitigate','heal','barrier','invuln','swap','tanklb','knockback','antiknockback','pull','distance','tower','tether','breaktether','taketether','bait','drop','dodge','lookaway','stop','keepmoving','move','wait','checkcast','checkdebuff','checkmarker','interrupt','esuna','adds','chase','takeorb','checkexpiry']},
 {label:'位置・方向',ids:['right','left','center','outer','inner','front','back','under','away','north','south','east','west','northeast','northwest','southeast','southwest','clockwise','counterclockwise','opposite','diagonal','safe','bossrelative','fieldrelative','leading']},
 {label:'範囲・順番',ids:['circle','donut','cone','line','cross','inout','outin','first','second','third','fourth','then']},
 {label:'対象・人数',ids:['tank','healer','dps','melee','ranged','mt','st','h1','h2','d1','d2','d3','d4','marked','unmarked','everyone','one','two','three','four','five','six','seven','eight']}
];
Object.assign(parts,{pair:'ペア頭割り',lightparty:'4人頭割り',eightspread:'8方向散開',heal:'回復',barrier:'バリア',invuln:'無敵',swap:'スイッチ',tanklb:'タンクリミットブレイク',knockback:'ノックバック',antiknockback:'ノックバック無効',pull:'引き寄せ',distance:'距離減衰',tower:'塔踏み',tether:'線',breaktether:'線を切る',taketether:'線を取る',bait:'誘導',drop:'範囲を捨てる',dodge:'避ける',lookaway:'視線を外す',stop:'動かない',keepmoving:'動き続ける',checkcast:'詠唱を確認',checkdebuff:'デバフを確認',checkmarker:'マーカーを確認',inner:'内周',under:'足元',away:'離れる',north:'北',south:'南',east:'東',west:'西',northeast:'北東',northwest:'北西',southeast:'南東',southwest:'南西',clockwise:'時計回り',counterclockwise:'反時計回り',opposite:'反対側',diagonal:'対角',safe:'安置',circle:'円範囲',donut:'ドーナツ範囲',cone:'扇範囲',line:'直線範囲',cross:'十字範囲',inout:'内から外',outin:'外から内',first:'1回目',second:'2回目',third:'3回目',fourth:'4回目',then:'その後',dps:'DPS',melee:'近接',ranged:'遠隔',mt:'メインタンク',st:'サブタンク',h1:'ヒーラー1',h2:'ヒーラー2',d1:'D1',d2:'D2',d3:'D3',d4:'D4',unmarked:'マーカーなし',everyone:'全員',four:'4',five:'5',six:'6',seven:'7',eight:'8',interrupt:'詠唱を中断',esuna:'エスナ',adds:'雑魚処理',chase:'追跡',takeorb:'玉を取る',checkexpiry:'デバフが切れたら',bossrelative:'ボス基準',fieldrelative:'フィールド基準',leading:'先頭'});
export function upcoming(data,time){const p=position(data,time);return {next:p.next,visible:p.list.slice(p.current+1,p.current+5)};}

export function validate(raw){
 if(!raw||raw.version!==1||typeof raw.boss!=='string'||!raw.boss.trim()||raw.boss.length>200||!Array.isArray(raw.events)||raw.events.length>1000)throw Error('ボス名とversion: 1、eventsのあるJSONを指定してください。');
 return {version:1,boss:raw.boss,events:raw.events.map((e,i)=>{
 if(!e||typeof e.name!=='string'||!e.name.trim()||e.name.length>300||!(e.time===null||Number.isFinite(e.time)&&e.time>=0&&e.time<=86400)||!Array.isArray(e.voiceParts)||e.voiceParts.some(p=>!Object.hasOwn(parts,p))||e.voiceParts.length>20||!Number.isFinite(e.voiceBefore)||e.voiceBefore<0||e.voiceBefore>120||typeof e.note!=='string'||e.note.length>5000)throw Error(`${i+1}行目のデータが不正です。`);
 return {time:e.time,name:e.name,note:e.note,voiceParts:[...e.voiceParts],voiceBefore:e.voiceBefore};})};
}
export function shiftTimes(raw,offset){
 if(!Number.isFinite(offset))throw Error('補正秒数を入力してください。');
 const data=validate(raw);
 const events=data.events.map((e,i)=>{
  if(e.time===null)return e;
  const time=Number((e.time+offset).toFixed(9));
  if(time<0||time>86400)throw Error(`${i+1}行目が0〜86400秒の範囲を外れるため、全体の補正を適用できません。`);
  return {...e,time};
 });
 return {...data,events};
}
export function timedEvents(data){return data.events.map((e,index)=>({...e,index})).filter(e=>e.time!==null).sort((a,b)=>a.time-b.time||a.index-b.index);}
export function position(data,time){const list=timedEvents(data);let current=-1;for(let i=0;i<list.length;i++)if(list[i].time<=time)current=i;return {list,current,next:list[current+1]};}
export function due(data,from,to){return timedEvents(data).filter(e=>e.voiceParts.length&&Math.max(0,e.time-e.voiceBefore)>from&&Math.max(0,e.time-e.voiceBefore)<=to);}
export function clock(n){n=Math.max(0,Math.floor(n));return `${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;}
export const demo={version:1,boss:'操作サンプル（架空の時間）',events:[{time:10,name:'全体攻撃',note:'動作確認用のサンプルです。実際のボスの時間ではありません。',voiceParts:['raidwide','mitigate'],voiceBefore:5},{time:25,name:'右で頭割り',note:'右側に集合',voiceParts:['right','stack'],voiceBefore:5},{time:40,name:'中央で散開',note:'周囲と距離を取る',voiceParts:['center','spread'],voiceBefore:5},{time:55,name:'タンク強攻撃',note:'軽減を使用',voiceParts:['tank','buster'],voiceBefore:5}]};
export const peri={version:1,boss:'火精ペリ（秒数・行動順未確認）',events:[['熱波','全体攻撃、軽減'],['左方／右方炎舞 → 火の輪','詠唱と進行方向を確認。最後は足元へ'],['玉石混交・炎鎖','安全な場所へ移動して線を切る'],['昇り火','タンク強攻撃、軽減'],['炎舞四連・追火','半面を避けながら線を交代'],['左方炎舞・虚々実々','ボスの経路を確認'],['火精の呪い＋魔力の輝石','デバフを確認して散開または頭割り'],['玉石混交・幻影','最初の範囲後に対角へ移動'],['怒りの炎 → 焔光 → 叫怒の爆炎','全体攻撃、範囲回避、集合、回復']].map(([name,note])=>({time:null,name,note,voiceParts:[],voiceBefore:5}))};
