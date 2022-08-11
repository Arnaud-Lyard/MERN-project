import { useProjectsContext } from '../hooks/useProjectsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from 'react-router-dom';
import { useState } from 'react';


// date fns
import { fr } from 'date-fns/locale';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ProjectList = ({ project }) => {
  const { dispatch } = useProjectsContext()
  const { user } = useAuthContext()
  const { image, setImage} = useState('')
  const { title, setTitle} = useState('')

  const handleClick = async () => {

    if(!user) {
      return
    }
    const response = await fetch('/api/projects/' + project._id, {
      method: 'DELETE',
      headers: {
        'Authorization' : `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_PROJECT', payload: json})
    }
  }

  return (
    <div className="project-list">
      <h4>{project.title}</h4>
      <p><strong>Description : </strong>{project.description}</p>
      <p><strong>Technologies utilisées : </strong>{project.technology}</p>
      <p>{formatDistanceToNow(new Date(project.createdAt), {locale: fr})}</p>
      {project.image && <img className="project-image" src={project.image} alt={project.title}></img>}
      <span className="material-symbols-outlined delete-project" onClick={handleClick}>delete</span>
      <Link to={project._id}><span className="material-symbols-outlined detail-project">settings</span></Link>
    </div>
  )
}

export default ProjectList