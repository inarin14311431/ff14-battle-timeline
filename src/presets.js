import darya from './data/advanced-darya.json' with {type:'json'};
import swordmaster from './data/advanced-swordmaster.json' with {type:'json'};
import pari from './data/advanced-pari.json' with {type:'json'};
import oldDarya from './data/legacy-darya.json' with {type:'json'};
import oldSwordmaster from './data/legacy-swordmaster.json' with {type:'json'};
import oldPari from './data/legacy-pari.json' with {type:'json'};
import previousDarya from './data/previous-darya.json' with {type:'json'};
import previousSwordmaster from './data/previous-swordmaster.json' with {type:'json'};
import previousPari from './data/previous-pari.json' with {type:'json'};
const previous={'advanced-darya':previousDarya,'advanced-swordmaster':previousSwordmaster,'advanced-pari':previousPari};
export const presets={'advanced-darya':darya,'advanced-swordmaster':swordmaster,'advanced-pari':pari};
const legacy={'advanced-darya':oldDarya,'advanced-swordmaster':oldSwordmaster,'advanced-pari':oldPari};
export function addPresets(library){
 const result={...library};
 for(const [key,value] of Object.entries(presets)){
  const isOld=data=>[legacy[key],previous[key]].some(old=>JSON.stringify(data)===JSON.stringify(old));
  if(!Object.hasOwn(result,key)||isOld(result[key]))result[key]=structuredClone(value);
  else if(JSON.stringify(result[key])!==JSON.stringify(value)){
   const copyKey=`${key}-provisional`;
   if(!Object.hasOwn(result,copyKey)||isOld(result[copyKey]))result[copyKey]=structuredClone(value);
   else if(JSON.stringify(result[copyKey])!==JSON.stringify(value)){
    const correctedKey=`${key}-offset10`;
    if(!Object.hasOwn(result,correctedKey)||isOld(result[correctedKey]))result[correctedKey]=structuredClone(value);
   }
  }
 }
 return result;
}
