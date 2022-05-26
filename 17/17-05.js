const {createClient} = require('redis');
const publisher = createClient({
    url: 'redis://redis-10935.c256.us-east-1-2.ec2.cloud.redislabs.com:10935',
    password: 'MQEfTL3BiOIojBNpviPXdVqhDdvhNCl2'
});
const subscriber = publisher.duplicate();

async function Subscriber() {
    await subscriber.connect();
    await subscriber.subscribe('article', (message) => {
      console.log(message);
    });
}

async function Publisher() {
  await publisher.connect();
  await publisher.publish('article', 'This is article');
}

(async() => {
    console.log('Starting subscriber...');
    await Subscriber();
    await sleep(2000);
    console.log('Starting publisher...');
    await Publisher();

    await publisher.quit();
    await subscriber.quit();
})();

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}