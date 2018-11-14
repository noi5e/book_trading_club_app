import React from 'react';
import Auth from '../../modules/Auth.js';
import { Redirect } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import MyProfile from './MyProfile.jsx'

class MyProfileContainer extends React.Component {
	constructor(props) {
		super(props);

		const storedMessage = localStorage.getItem('successMessage');
		let successMessage = '';

		if (storedMessage) {
			successMessage = storedMessage;
			localStorage.removeItem('successMessage');
		}

		this.state = {
			successMessage,
			user: {},
			isLoaded: false
		}
	}

	componentWillMount() {

			const xhr = new XMLHttpRequest();
			xhr.open('post', '/auth/get_user_info');
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`)
			xhr.responseType = 'json';

			let response = [];

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					this.setState({
						user: xhr.response.userInfo,
						isLoaded: true
					})
				} else {
					console.log(xhr.response);

					this.setState({
						user: {}
					});
				}
			});

			xhr.send();
	}

	render() {
		if (!Auth.isUserAuthenticated()) {
			return (
				<Redirect to='/' />
			);
		}
		
		if (!this.state.isLoaded) {
			return (
				<div className='col-lg-12'>
					<h2 className='page-header'>My Profile</h2>
					Loading profile...
				</div>
			);
		}

		if (Object.keys(this.state.user).length === 0 && this.state.user.constructor === Object) {

			return (
				<div className='col-lg-12'>
					<h2 className='page-header'>My Profile</h2>
					No user!
				</div>
			);

		} else {
			return (
				<MyProfile successMessage={this.state.successMessage} user={this.state.user} />
			);
		}
	}
}

export default MyProfileContainer;