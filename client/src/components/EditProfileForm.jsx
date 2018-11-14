import React from 'react';
import PropTypes from 'prop-types';
import { Alert, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

class EditProfileForm extends React.Component {
	render() {
		var message = "";
		var firstNameError = "";
		var lastNameError = "";
		var usernameError = "";
		var emailError = "";
		var cityError = "";
		var stateError = "";

		if (this.props.errors.firstName) {
			firstNameError = <HelpBlock className='help-block-text'>{this.props.errors.firstName}</HelpBlock>;
		}

		if (this.props.errors.lastName) {
			lastNameError = <HelpBlock className='help-block-text'>{this.props.errors.lastName}</HelpBlock>;
		}

		if (this.props.errors.username) {
			usernameError = <HelpBlock className='help-block-text'>{this.props.errors.username}</HelpBlock>;
		}

		if (this.props.errors.email) {
			emailError = <HelpBlock className='help-block-text'>{this.props.errors.email}</HelpBlock>;
		}

		if (this.props.errors.city) {
			cityError = <HelpBlock className='help-block-text'>{this.props.errors.city}</HelpBlock>;
		}

		if (this.props.errors.state) {
			stateError = <HelpBlock className='help-block-text'>{this.props.errors.state}</HelpBlock>;
		}

		return (
			<form onSubmit={this.props.onSubmit}>
				<FormGroup controlId="username">
					<ControlLabel>Username</ControlLabel>
					<FormControl type="text" value={this.props.user.username} onChange={this.props.onChange} />
					{usernameError}
				</FormGroup>

				<FormGroup controlId="email">
					<ControlLabel>E-mail</ControlLabel>
					<FormControl type="email" value={this.props.user.email} onChange={this.props.onChange} />
					{emailError}
				</FormGroup>

				<FormGroup controlId="firstName">
					<ControlLabel>First Name</ControlLabel>
					<FormControl type="text" value={this.props.user.firstName} onChange={this.props.onChange} />
					{firstNameError}
				</FormGroup>

				<FormGroup controlId="lastName">
					<ControlLabel>Last Name</ControlLabel>
					<FormControl type="text" value={this.props.user.lastName} onChange={this.props.onChange} />
					{lastNameError}
				</FormGroup>

				<FormGroup controlId="city">
					<ControlLabel>City</ControlLabel>
					<FormControl type="text" value={this.props.user.city} onChange={this.props.onChange} />
					{cityError}
				</FormGroup>

				<FormGroup controlId="state">
					<ControlLabel>State</ControlLabel>
					<FormControl type="text" value={this.props.user.state} onChange={this.props.onChange} />
					{stateError}
				</FormGroup>

				<Button type="submit">Submit</Button>
			</form>
		);
	}
}

EditProfileForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
}

export default EditProfileForm;