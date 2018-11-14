import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

class MyProfile extends React.Component{
	render() {
		let message = "";

		if (this.props.successMessage) {
			message = <Alert bsStyle="success">{this.props.successMessage}</Alert>;
		}

		return (
			<div className='col-lg-12'>
				<h2 className='page-header'>My Profile</h2>
				{message}
				Username: {this.props.user.username}<br />
				E-mail: {this.props.user.email}<br />
				Name: {this.props.user.firstName + ' ' + this.props.user.lastName}<br />
				City: {this.props.user.city}<br />
				State: {this.props.user.state}
			</div>
		);
	}
}

MyProfile.propTypes = {
	successMessage: PropTypes.string.isRequired,
	user: PropTypes.object.isRequired
}

export default MyProfile;