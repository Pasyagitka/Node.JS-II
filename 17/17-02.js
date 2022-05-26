const {createClient} = require("redis");
const I = 10000;

(async () => {
  const client = createClient({
    url: 'redis://redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935',
    password: 'MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2'
  });

  client.on("ready", () => {console.log('ready')})
  client.on("connect", () => {console.log('connect')})
  client.on('error', (err) => console.log('error', err));
  client.on('reconnecting', () => console.log('reconnecting'));
  client.on("end", () => {console.log('end')})

  await client.connect();

  let start = Date.now();
  for (let i = 0; i< I; i++) {
   await client.set(i.toString(), i);
  }
  console.log(`Set: ${Date.now() - start}ms`);

  start = Date.now();
  for (let i = 0; i< I; i++) {
    await client.get(i.toString());
  }
  console.log(`Get: ${Date.now() - start}ms`);

  start = Date.now();
  for (let i = 0; i< I; i++) {
    await client.del(i.toString());
  }
  console.log(`Del: ${Date.now() - start}ms`);

  await client.quit();
})();