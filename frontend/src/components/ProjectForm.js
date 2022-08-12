import { useState, useRef } from 'react'
import { useProjectsContext } from '../hooks/useProjectsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import Select from 'react-select';

const ProjectForm = () => {
  const { dispatch } = useProjectsContext()
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const [image, setImage] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const imageRef = useRef(null);

  // React-select options
  const options = [
    { value: 'Html', label: 'Html' },
    { value: 'Css', label: 'Css' },
    { value: 'Javascript', label: 'Javascript' },
    { value: 'Php', label: 'Php' },
    { value: 'Symfony', label: 'Symfony' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'React.js', label: 'React.js' },
    { value: 'Vue.js', label: 'Vue.js' },
  ];
  
  // Get image file from form
  const handleImage = (e) => {
    setImage(e.target.files[0])
    }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(image)

    // User must be logged in
    if (!user) {
      setError('Vous devez être connecté')
      return
    }

    // If there are technology : Extract an array object to get each option value
    let technology = "";
    selectedTechnology && (technology = selectedTechnology.map(option => option.value))

    // Prepare send FormData to backend with file
    const formData = new FormData()
    formData.append('title', title);
    formData.append('description', description);
    formData.append('technology', technology);
    formData.append('image', image);
    
    const response = await fetch('/api/projects', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization' : `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    // Set error if a field is empty
    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }

    // Send data and reset form
    if (response.ok) {
      setError(null)
      setTitle('')
      setDescription('')
      setSelectedTechnology([])
      setImage('')
      setEmptyFields([])
      dispatch({type: 'CREATE_PROJECT', payload: json})
      imageRef.current.value = null;
    }
  }
  
  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Ajouter un nouveau projet</h3>

      <label>Titre du projet :</label>
      <input 
        id="title"
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Description :</label>
      <textarea 
        id="description"
        type="text" 
        rows="5" cols="50"
        onChange={(e) => setDescription(e.target.value)} 
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}>
      </textarea>

      <label>Technologies utilisées :</label>
      <Select
        id="technology"
        isMulti
        value={selectedTechnology}
        onChange={setSelectedTechnology}
        options={options}
        placeholder="Sélectionner les technologies utilisées"
        isSearchable={true}
        isClearable
        className={emptyFields.includes('technology') ? 'error' : ''}
      />

      <label>Images :</label>
      <input 
        ref={imageRef}
        id="image"
        type="file"
        onChange={handleImage} 
        className={emptyFields.includes('image') ? 'error' : ''}
      />
      {image && <img src={image ? URL.createObjectURL(image) : null} alt={title} width={150} height={70} />}

      <button>Add Project</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default ProjectForm