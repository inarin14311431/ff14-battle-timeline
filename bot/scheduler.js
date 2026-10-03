import {due,position} from '../src/core.js';
export class Scheduler{
 constructor(data,{clock=()=>performance.now(),emit=()=>{},cancel=()=>{}}={}){this.data=data;this.clock=clock;this.emit=emit;this.cancel=cancel;this.elapsed=0;this.running=false;this.last=-.001;}
 time(){return this.elapsed+(this.running?(this.clock()-this.anchor)/1000:0)}
 start(){if(this.running)return;this.anchor=this.clock();this.running=true;this.tick();}
 pause(){this.elapsed=this.time();this.running=false;this.last=this.elapsed;this.cancel();}
 reset(){this.pause();this.elapsed=0;this.last=-.001;}
 seek(seconds){if(!Number.isFinite(seconds)||seconds<0||seconds>86400)throw Error('秒数は0〜86400で指定してください。');this.cancel();this.elapsed=seconds;this.anchor=this.clock();this.last=seconds;}
 tick(){if(!this.running)return;const t=this.time();if(t-this.last<3)for(const e of due(this.data,this.last,t))this.emit(e);this.last=t;if(!position(this.data,t).next){this.elapsed=t;this.running=false;}}
}
