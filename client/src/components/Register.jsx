import React from 'react';
import bootstrap from '../../../server/static/css/bootstrap.css'
import style from '../../../server/static/css/style.css'
import Auth from '../../modules/Auth.js';
import RegisterFormContainer from './RegisterFormContainer.jsx';
import { Redirect } from 'react-router-dom';

class Register extends React.Component {
	render() {
		if (Auth.isUserAuthenticated()) {
			return (
				<Redirect to='/' />
			);
		}

		return (
			<div className={bootstrap['col-lg-12']}>
				<h2 className={bootstrap['page-header'] + ' ' + style['page-header']}>Register</h2>
				<RegisterFormContainer />
			</div>
		);
	}
}

export default Register;