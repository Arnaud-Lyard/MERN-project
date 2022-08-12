const Project = require('../models/projectModel')
const mongoose = require('mongoose')
const fs = require('fs');

// get all projects
const getProjects = async (req, res) => {
  const projects = await Project.find({}).sort({createdAt: -1})

  res.status(200).json(projects)
}

// get a single project
const getProject = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such project'})
  }

  const project = await Project.findById(id)

  if (!project) {
    return res.status(404).json({error: 'No such project'})
  }

  res.status(200).json(project)
}

// create a new project
const createProject = async (req, res) => {
  const {title, description, technology} = req.body

  let emptyFields = []
  
  if(!req.file){
    emptyFields.push('image')
  }
  if (!title) {
    emptyFields.push('title')
  }
  if (!description) {
    emptyFields.push('description')
  }
  if (!technology) {
    emptyFields.push('technology')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Merci de remplir tous les champs', emptyFields })
  }
  // add to the database
  try {
    const project = await Project.create({ title, description, technology, image: `${req.protocol}://${req.get('host')}/images/projects/${req.file.filename}` })
    console.log(project)
    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such project'})
  }

  const project = await Project.findOneAndDelete({_id: id})

  if(!project) {
    return res.status(400).json({error: 'No such project'})
  }

  res.status(200).json(project)
}

// update a project
const updateProject = async (req, res) => {
  const { id } = req.params

  const {title, description, technology} = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!description) {
    emptyFields.push('description')
  }
  if (!technology) {
    emptyFields.push('technology')
  }
  if(!req.file){
    emptyFields.push('image')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Merci de remplir tous les champs', emptyFields })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such project'})
  }

  if(req.file){
    image = `${req.protocol}://${req.get('host')}/images/projects/${req.file.filename}`;
    Project.findOne({_id: id},{image: true},(err, project)=>{
        if(err){
            console.log(err);
            return;
        }
        const filename = project.image.split('/projects/')[1];
        fs.unlink(`public/images/projects/${filename}`, (err)=>{
            if(err){
                console.log(err.message);
            }
            console.log(image)

        });
    })
  }
  const project = await Project.findOneAndUpdate({_id: id}, {
    ...req.body,
    image: image
  })
  if (!project) {
    return res.status(400).json({error: 'No such project'})
  }

  res.status(200).json(project)

}

module.exports = {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject
}