const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect().catch(console.error);

const cacheProjects = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get('projects:list');

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    next();
  } catch (error) {
    console.error('Error en cacheProjects:', error);
    next();
  }
};

const clearProjectsCache = async () => {
  try {
    await redisClient.del('projects:list');
  } catch (error) {
    console.error('Error limpiando caché de proyectos:', error);
  }
};

const saveProjectsCache = async (data) => {
  try {
    await redisClient.set('projects:list', JSON.stringify(data), {
      EX: 60
    });
  } catch (error) {
    console.error('Error guardando caché de proyectos:', error);
  }
};

module.exports = {
  cacheProjects,
  clearProjectsCache,
  saveProjectsCache
};

