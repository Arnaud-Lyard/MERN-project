import { useState } from 'react'
import { useProjectsContext } from '../hooks/useProjectsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import Select from 'react-select';

const ProjectForm = () => {
  const { dispatch } = useProjectsContext()
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  // const [technology, setTechnology] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const [image, setImage] = useState();
  const [selectedOption, setSelectedOption] = useState(null);


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
  
  const handleImage = (e) => {
    console.log(e.target.files)
    setImage(e.target.files[0])
    }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Vous devez être connecté')
      return
    }
    // Extract an array object to get each option value
    let technology = selectedOption.map(option => option.value);

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

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setError(null)
      setTitle('')
      setDescription('')
      setSelectedOption([])
      setImage()
      setEmptyFields([])
      dispatch({type: 'CREATE_PROJECT', payload: json})
    }
    console.log(selectedOption)

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

      <label>Technologies :</label>
      <Select
        isMulti
        value={selectedOption}
        onChange={setSelectedOption}
        options={options}
        placeholder="Sélectionner les technologies utilisées"
        isSearchable={true}
        isClearable
      />

      <label>Images :</label>
      <input 
        id="image"
        type="file" 
        onChange={handleImage} 
        className={emptyFields.includes('technology') ? 'error' : ''}
      />
      {image && <img src={image ? URL.createObjectURL(image) : null} width={150} height={70} />}

      <button>Add Project</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default ProjectForm