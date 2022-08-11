const express = require('express')

const {
  getProjects, 
  getProject, 
  createProject, 
  deleteProject, 
  updateProject
} = require('../controllers/projectController')
const requireAuth = require('../middlewares/requireAuth')
const projectImageUpload = require('../middlewares/multerConfig');

const router = express.Router()

// require auth for all project routes
router.use(requireAuth)

// GET all projects
router.get('/', getProjects)

// GET a single project
router.get('/:id', getProject)

// POST a new project
router.post('/', projectImageUpload, createProject)

// DELETE a project
router.delete('/:id', deleteProject)

// UPDATE a project
router.patch('/:id', projectImageUpload, updateProject)

module.exports = router