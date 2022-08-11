import { useEffect, useState } from "react"
import { useProjectsContext } from '../hooks/useProjectsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {

    const { projects, dispatch } = useProjectsContext()
    const { user } = useAuthContext()
  
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [technology, setTechnology] = useState('')
    const [image, setImage] = useState({ preview: '', data: '' })
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const { id } = useParams();

    // File upload, display an image preview and store image in state
    const handleFileChange = (e) => {
      const img = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
      }
      setImage(img)
    }
  
  
  useEffect(() => {    

    const fetchOneProject = async () => {

      // User must be logged in
      if (!user) {
        setError('Vous devez être connecté')
        return
      }

      // GET project with the id
      const response = await fetch('/api/projects/' + id, {
        method: 'GET',
        headers: {
          'Authorization' : `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      // Fill all fields in form
      if (response.ok) {
        setTitle(json.title)
        setDescription(json.description)
        setTechnology(json.technology)
    }
    }
    if(user) {
      fetchOneProject()
    }
  }, [user, projects, id])

  // Submit form to the server
  const handleSubmit = async (e) => {
    e.preventDefault()

    // User must be logged in
    if (!user) {
      setError('Vous devez être connecté')
      return
    }

    // Prepare FormData to send to server with file
    const projects = new FormData()
    projects.append('title', title);
    projects.append('description', description);
    projects.append('technology', technology);
    projects.append('image', image.data);

    const response = await fetch('/api/projects/' + id, {
      method: 'PATCH',
      body: projects,
      headers: {
        'Authorization' : `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    // Send error if no response
    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }

    // Reset field response
    if (response.ok) {
      setError(null)
      setTitle('')
      setDescription('')
      setTechnology('')
      setImage('')
      setEmptyFields([])
      dispatch({type: 'MODIFY_PROJECT', payload: json})
    }

  }

    return (
    
        <form className="create" onSubmit={handleSubmit}> 
        <h3>Modify a Project</h3>

        <label>Excersize Title:</label>
        <input 
            type="text" 
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
            className={emptyFields.includes('title') ? 'error' : ''}
        />

        <label>Description :</label>
        <input 
            type="text" 
            onChange={(e) => setDescription(e.target.value)} 
            value={description}
            className={emptyFields.includes('description') ? 'error' : ''}
        />

        <label>Technologies utilisées :</label>
        <input 
            type="text" 
            onChange={(e) => setTechnology(e.target.value)} 
            value={technology}
            className={emptyFields.includes('technology') ? 'error' : ''}
        />

        <label>Image :</label>
        <input 
            type="file" 
            multiple accept="image/*"
            onChange={handleFileChange}
            className={emptyFields.includes('image') ? 'error' : ''}
        />
        {image.preview && <img src={image.preview} alt={title} width='100' height='100' />}        

        <button>Modifiy Project</button>
        {error && <div className="error">{error}</div>}
        </form>
    )
}

export default ProjectDetail