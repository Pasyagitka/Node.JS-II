const {createClient} = require('redis');
require('dotenv').config();


//npx redis-cli -u redis://h:REDIS_PASS@REDIS_HOST
//lrange token 0 -1

async function banToken(token){
    const client = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASS
    });
    await client.connect();
    await client.LPUSH('token', token);
    await client.quit();
}

module.exports.banToken = banToken;