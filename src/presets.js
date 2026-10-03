import darya from './data/advanced-darya.json' with {type:'json'};
import swordmaster from './data/advanced-swordmaster.json' with {type:'json'};
import pari from './data/advanced-pari.json' with {type:'json'};
import oldDarya from './data/legacy-darya.json' with {type:'json'};
import oldSwordmaster from './data/legacy-swordmaster.json' with {type:'json'};
import oldPari from './data/legacy-pari.json' with {type:'json'};
export const presets={'advanced-darya':darya,'advanced-swordmaster':swordmaster,'advanced-pari':pari};
const legacy={'advanced-darya':oldDarya,'advanced-swordmaster':oldSwordmaster,'advanced-pari':oldPari};
export function addPresets(library){const result={...library};for(const [key,value] of Object.entries(presets)){
 if(!Object.hasOwn(result,key)||JSON.stringify(result[key])===JSON.stringify(legacy[key]))result[key]=structuredClone(value);
 else if(JSON.stringify(result[key])!==JSON.stringify(value)&&!Object.hasOwn(result,`${key}-provisional`))result[`${key}-provisional`]=structuredClone(value);
}return result;}
