const express = require('express');
const router = express.Router();

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projects.controller');

const { cacheProjects } = require('../middleware/cacheProjects');

router.get('/', cacheProjects, getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;