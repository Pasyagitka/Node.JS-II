const {createClient} = require("redis");


//npx redis-cli -u redis://h:MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2@redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935
//lrange token 0 -1

async function banToken(token){
    const client = createClient({
        url: 'redis://redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935',
        password: 'MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2'
    });
    await client.connect();
    await client.LPUSH('token', token);
    await client.quit();
}

module.exports.banToken = banToken;