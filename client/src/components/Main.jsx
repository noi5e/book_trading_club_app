import React from 'react';
import ReactDOM from 'react-dom';

import Auth from '../../modules/Auth.js';

import {
  Route,
  Link
} from 'react-router-dom'

import bootstrap from '../../../server/static/css/bootstrap.css'
import style from '../../../server/static/css/style.css'

import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Logout from './Logout.jsx';

class Main extends React.Component {
	render() {
		var navigationItems = "";

		if (Auth.isUserAuthenticated()) {
			navigationItems = <ul className={bootstrap.nav + ' ' + bootstrap['nav-pills'] + ' ' + bootstrap['pull-right']}><li role='presentation'><Link to='/logout'>Logout</Link></li></ul>;
		} else {
			navigationItems = <ul className={bootstrap.nav + ' ' + bootstrap['nav-pills'] + ' ' + bootstrap['pull-right']}><li role='presentation'><Link to='/'>Home</Link></li><li role='presentation'><Link to='/login'>Login</Link></li><li role='presentation'><Link to='/register'>Register</Link></li></ul>;
		}

		return (
			<div className={bootstrap.container + ' ' + style.container}>
				<div className={style.header + ' ' + bootstrap.clearfix}>
					<nav>
						{navigationItems}
					</nav>		
					<h3 className={bootstrap['text-muted']}>FreeCodeCamp Nightlife App</h3>
				</div>

				<div className={bootstrap.row}>
					<div className={bootstrap['col-lg-12']}>
					</div>
					<Route exact path="/" component={Home} />
					<Route path="/logout" component={Logout} />
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
				</div>

				<footer className={style.footer}>
					<p>&copy; 2017 Will G</p>
				</footer>
			</div>
		);
	}
}

export default Main;