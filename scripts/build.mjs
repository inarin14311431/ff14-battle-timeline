import {build} from 'esbuild';import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await build({entryPoints:['src/app.js'],bundle:true,format:'esm',outfile:'dist/app.js',minify:true});for(const file of ['index.html','editor.html'])await copyFile(file,`dist/${file}`);await copyFile('src/style.css','dist/style.css');
