import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
	const { logout } = useLogout()

	const { user } = useAuthContext()

	const handleClick = () => {
		logout()
	}

	return (
		<header>
			<div className="container">
				<Link to="/projets">
					<h1>Projets</h1>
				</Link>
				<nav>
					{user && (
						<div>
						<span>{user.email}</span>
						<button onClick={handleClick}>Déconnexion</button>
						</div>
					)}
					{!user && (
						<div>
						<Link to="/login">Connexion</Link>
						<Link to="/signup">Inscription</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	)
}

export default Navbar