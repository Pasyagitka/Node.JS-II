const {createDiffieHellman, createCipheriv, createDecipheriv} = require('crypto');

module.exports.ServerDH = function ServerDH(len_a, g) { //1024, 3
    const dh = createDiffieHellman(len_a, g);
    const p = dh.getPrime();
    const gb = dh.getGenerator();
    const k = dh.generateKeys();
    this.getContext = () =>  {
        return {
            p_hex: p.toString('hex'),
            g_hex: gb.toString('hex'),
            key_hex: k.toString('hex'),
        };
    };
    this.getSecret = (clientContext) => {
        const k = Buffer.from(clientContext.key_hex, 'hex');
        return dh.computeSecret(k);
    };
}

module.exports.ClientDH = function ClientDH(serverContext){
    const ctx = {
        p_hex: serverContext.p_hex ? serverContext.p_hex : '1111',
        g_hex: serverContext.g_hex ? serverContext.g_hex : '1',
    };
    const p = Buffer.from(ctx.p_hex, 'hex');
    const g = Buffer.from(ctx.g_hex, 'hex');
    //console.log(p,g);
    const dh = createDiffieHellman(p, g);
    const k = dh.generateKeys();
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: g.toString('hex'),
            key_hex: k.toString('hex'),
        };
    };
    this.getSecret = (serverContext) => {
        const k = Buffer.from(serverContext.key_hex, 'hex');
        return dh.computeSecret(k);
    };
}

module.exports.cipherFile = (readStream, writeStream, key) => {
    const alg = 'aes-256-cbc';
    const piv = Buffer.alloc(16, 0);
    const ch = createCipheriv(alg, key, piv);
    readStream.pipe(ch).pipe(writeStream);
}

module.exports.decipherFile = (readStream, writeStream, key, iv, callback) => {
    const alg = 'aes-256-cbc';
    const piv = iv ? iv : Buffer.alloc(16, 0);
    const dch = createDecipheriv(alg, key, piv);
    readStream.pipe(dch).pipe(writeStream);
}