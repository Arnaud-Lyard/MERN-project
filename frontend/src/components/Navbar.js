import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { useState } from 'react';

const Navbar = () => {
	const { logout } = useLogout()

	const { user } = useAuthContext()

	const handleClick = () => {
		logout()
	}


	return (
		<header>
			<div className="container">
				<div>
				<Link to="/projets">
					<h1>Projets</h1>
				</Link>
				</div>
				<nav>
					{user && (
						<div>
						<span>{user.email}</span>
						<button onClick={handleClick}>Déconnexion</button>
						</div>
					)}
					{user && user.authorities.includes('ROLE_ADMIN') && (
						<div>test</div>
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