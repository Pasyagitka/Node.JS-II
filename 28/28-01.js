const JsonRPCSever = require('jsonrpc-server-http-nats');
const server = new JsonRPCSever();

const validatorArrays = (param)=> {
    if(!Array.isArray(param))               throw new Error('Must be an array');
    param.forEach(p=>{if(!isFinite(p))      throw new Error ('Params array must containt only numbers')});
    return param;
}

const validatorNumbers = (param)=> {
    if(!isFinite(param.x) || !isFinite(param.y)) throw new Error ('Params array must containt only numbers');
    return param;
} 

const sumTo = (params) =>  params.reduce((a, b) => a + b);
const mulTo = (params) => params.reduce((a, b) =>  a * b, 1);
const divTo = (x, y) => x/y;
const procTo = (x, y) => x/y*100;


server.on("div", validatorNumbers, (params, _, resp) => {
	resp(null, divTo(params.x, params.y));
});
server.on("proc", validatorNumbers, (params, _, resp) => {
	resp(null, procTo(params.x, params.y));
});
server.on("sum", validatorArrays, (params, _, resp) => {
	resp(null, sumTo(params));
});
server.on("mul", validatorArrays, (params, _, resp) => {
	resp(null, mulTo(params));
});

server.listenHttp({
    host:'127.0.0.1', 
    port:3000,
}, ()=>{
    console.log('JSON-RPC Server READY')
});