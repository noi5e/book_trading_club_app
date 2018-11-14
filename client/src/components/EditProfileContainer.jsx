import React from 'react';
import Auth from '../../modules/Auth.js';
import { Redirect } from 'react-router-dom';
import EditProfileForm from './EditProfileForm.jsx';

class EditProfileContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			user: {
				username: '',
				email: '',
				firstName: '',
				lastName: '',
				city: '',
				state: ''
			},
			redirectToMyProfile: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/auth/get_user_info');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);
		xhr.responseType = 'json';

		let response = [];

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				this.setState({
					user: xhr.response.userInfo
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
		const city = encodeURIComponent(this.state.user.city);
		const state = encodeURIComponent(this.state.user.state);
		const formData = `firstName=${firstName}&lastName=${lastName}&username=${username}&email=${email}&city=${city}&state=${state}`;

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/auth/edit_profile');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);
		xhr.responseType = 'json';

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				localStorage.setItem('successMessage', xhr.response.message);

				this.setState({
					redirectToMyProfile: true
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
		if (!Auth.isUserAuthenticated()) {
			return (
				<Redirect to='/' />
			);
		}

		if (this.state.redirectToMyProfile) {
			return (
				<Redirect push to='/my_profile' />
			)
		}

		return (
			<div className='col-lg-12'>
				<h2 className='page-header'>Edit Profile</h2>
				<EditProfileForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} errors={this.state.errors} user={this.state.user} />
			</div>
		);
	}
}

export default EditProfileContainer;