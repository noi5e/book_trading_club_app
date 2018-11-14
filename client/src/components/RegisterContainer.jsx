import React from 'react';

import RegisterForm from './RegisterForm.jsx';

import {
  Redirect
} from 'react-router-dom'


class RegisterFormContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			user: {
				firstName: '',
				lastName: '',
				username: '',
				email: '',
				street: '',
				city: '',
				state: '',
				zipCode: '',
				password: '',
				passwordTwo: ''
			},
			redirectToLogin: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const field = event.target.id;
		const user = this.state.user;
		user[field] = event.target.value;

		this.setState({
			user: user
		});

	}

	handleSubmit(event) {
		event.preventDefault();

		const firstName = encodeURIComponent(this.state.user.firstName);
		const lastName = encodeURIComponent(this.state.user.lastName);
		const username = encodeURIComponent(this.state.user.username);
		const email = encodeURIComponent(this.state.user.email);
		const street = encodeURIComponent(this.state.user.street);
		const city = encodeURIComponent(this.state.user.city);
		const state = encodeURIComponent(this.state.user.state);
		const zipCode = encodeURIComponent(this.state.user.zipCode);
		const password = encodeURIComponent(this.state.user.password);
		const passwordTwo = encodeURIComponent(this.state.user.passwordTwo);
		const formData = `firstName=${firstName}&lastName=${lastName}&username=${username}&email=${email}&street=${street}&city=${city}&state=${state}&zipCode=${zipCode}&password=${password}&passwordTwo=${passwordTwo}`;

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/auth/register');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				this.setState({
					errors: {}
				});

				console.log('The form is valid.');

				localStorage.setItem('successMessage', xhr.response.message);

				this.setState({
					redirectToLogin: true
				});
			} else {
				console.log(xhr.response);
				console.log('Form is invalid.');

				const errors = xhr.response.errors ? xhr.response.errors : {};
				errors.summary = xhr.response.message;

				this.setState({ errors });
			}
		});

		xhr.send(formData);
	}

	render() {
		if (this.state.redirectToLogin) {
			return (
				<Redirect push to='/login' />
			)
		}

		return (
			<div className='col-lg-12'>
				<h2 className='page-header'>Register</h2>
				<RegisterForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} errors={this.state.errors} user={this.state.user} />
			</div>
		);
	}
}

export default RegisterFormContainer;