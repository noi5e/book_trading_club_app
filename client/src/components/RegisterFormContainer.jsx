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
				name: '',
				username: '',
				email: '',
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

		const name = encodeURIComponent(this.state.user.name);
		const username = encodeURIComponent(this.state.user.username);
		const email = encodeURIComponent(this.state.user.email);
		const password = encodeURIComponent(this.state.user.password);
		const passwordTwo = encodeURIComponent(this.state.user.passwordTwo);
		const formData = `name=${name}&username=${username}&email=${email}&password=${password}&passwordTwo=${passwordTwo}`;

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
			<RegisterForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} errors={this.state.errors} user={this.state.user} />
		);
	}
}

export default RegisterFormContainer;