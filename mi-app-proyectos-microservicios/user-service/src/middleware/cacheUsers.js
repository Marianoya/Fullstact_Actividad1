const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect().catch(console.error);

const cacheUsers = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get('users:list');

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    next();
  } catch (error) {
    console.error('Error en cacheUsers:', error);
    next();
  }
};

const clearUsersCache = async () => {
  try {
    await redisClient.del('users:list');
  } catch (error) {
    console.error('Error limpiando caché de usuarios:', error);
  }
};

const saveUsersCache = async (data) => {
  try {
    await redisClient.set('users:list', JSON.stringify(data), {
      EX: 60
    });
  } catch (error) {
    console.error('Error guardando caché de usuarios:', error);
  }
};

module.exports = {
  cacheUsers,
  clearUsersCache,
  saveUsersCache
};

