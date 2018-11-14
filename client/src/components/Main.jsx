import React from 'react';
import ReactDOM from 'react-dom';

import Auth from '../../modules/Auth.js';

import {
  Route,
  Link
} from 'react-router-dom'

import AllBooksContainer from './AllBooksContainer.jsx';
import LoginContainer from './LoginContainer.jsx';
import RegisterContainer from './RegisterContainer.jsx';
import MyProfileContainer from './MyProfileContainer.jsx';
import EditProfileContainer from './EditProfileContainer.jsx';
import MyBooksContainer from './MyBooksContainer.jsx';
import Logout from './Logout.jsx';

class Main extends React.Component {
	render() {
		var navigationItems = "";

		if (Auth.isUserAuthenticated()) {
			navigationItems = 
			<ul className='nav nav-pills pull-right'>
				<li role='presentation'>
					<Link to='/'>Home</Link>
				</li>
				<li className='dropdown'>
					<a href="#" className='dropdown-toggle' data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">My Account <span className="caret"></span></a>
					<ul className='dropdown-menu'>
						<li><Link to="/my_profile">My Profile</Link></li>
						<li><Link to="/edit_profile">Edit Profile</Link></li>
						<li role="separator" className="divider"></li>
						<li><Link to="/my_books">My Books</Link></li>
						<li role="separator" className="divider"></li>
						<li><Link to='/logout'>Logout</Link></li>
					</ul>
				</li>
			</ul>;
		} else {
			navigationItems = <ul className='nav nav-pills pull-right'>
				<li role='presentation'><Link to='/'>Home</Link></li>
				<li role='presentation'><Link to='/login'>Login</Link></li>
				<li role='presentation'><Link to='/register'>Register</Link></li>
			</ul>;
		}

		return (
			<div className='container'>
				<div className='header clearfix'>
					<nav>
						{navigationItems}
					</nav>		
					<h3 className='text-muted'>FreeCodeCamp Book Trading App</h3>
				</div>

				<div className='row'>
					<div className='col-lg-12'>
					</div>
					<Route exact path="/" component={AllBooksContainer} />
					<Route path="/logout" component={Logout} />
					<Route path="/login" component={LoginContainer} />
					<Route path="/register" component={RegisterContainer} />
					<Route path="/my_profile" component={MyProfileContainer} />
					<Route path="/edit_profile" component={EditProfileContainer} />
					<Route path="/my_books" component={MyBooksContainer} />

				</div>

				<footer className='footer'>
					<p>&copy; 2018 Will G</p>
				</footer>
			</div>
		);
	}
}

export default Main;