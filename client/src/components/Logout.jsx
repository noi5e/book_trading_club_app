import React from 'react';
import Auth from '../../modules/Auth.js';
import { Redirect } from 'react-router-dom';

class Logout extends React.Component {
	componentWillMount() {
		Auth.deauthenticateUser();
	}

	render() {
		return (
			<Redirect to='/' />
		);
	}
}

export default Logout;