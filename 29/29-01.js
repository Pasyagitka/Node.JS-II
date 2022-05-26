const express = require('express');
const app = express();
const fs = require('fs');

app.use('/', express.static('public'));

let wasmCode = fs.readFileSync('public/wasm.wasm');
let wasmImport = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.get('/wasm', (req, res, next)=>{
    res.type('html').send(`${wasmInstance.exports.sum(132,2)} ${wasmInstance.exports.mul(11,2)} ${wasmInstance.exports.sub(345,2232)};`);
});

app.listen(3000);

//emcc wasm.c -s WASM=1 -o wasm.html