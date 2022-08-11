import { useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import ProjectList from "../components/ProjectList"
import ProjectForm from "../components/ProjectForm"

const Projects = () => {
    const { projects, dispatch } = useProjectsContext()
    const { user } = useAuthContext()

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization' : `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_PROJECTS', payload: json})
      }
    }
    if(user) {
      fetchProjects()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="projects">
        {projects && projects.map(project => (
          <ProjectList project={project} key={project._id} />
        ))}
      </div>
      <ProjectForm />
    </div>
  )
}

export default Projects