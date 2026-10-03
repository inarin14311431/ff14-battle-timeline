import darya from './data/advanced-darya.json' with {type:'json'};
import swordmaster from './data/advanced-swordmaster.json' with {type:'json'};
import pari from './data/advanced-pari.json' with {type:'json'};
export const presets={'advanced-darya':darya,'advanced-swordmaster':swordmaster,'advanced-pari':pari};
export function addPresets(library){const result={...library};for(const [key,value] of Object.entries(presets))if(!Object.hasOwn(result,key))result[key]=structuredClone(value);return result;}
