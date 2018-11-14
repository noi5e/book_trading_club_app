import React from 'react';
import PropTypes from 'prop-types';
import { Alert, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

class LoginForm extends React.Component {
	render() {
		var message = "";
		var usernameError = "";
		var passwordError = "";

		if (this.props.successMessage) {
			message = <Alert bsStyle="success">{this.props.successMessage}</Alert>;
		}

		if (this.props.errors.login) {
			message = <Alert bsStyle="danger">{this.props.errors.login}</Alert>;
		}

		if (this.props.errors.username) {
			usernameError = <HelpBlock className='help-block-text'>{this.props.errors.username}</HelpBlock>;
		}

		if (this.props.errors.password) {
			passwordError = <HelpBlock className='help-block-text'>{this.props.errors.password}</HelpBlock>;
		}

		return (
			<form onSubmit={this.props.onSubmit}>
				{message}
				<FormGroup controlId="username">
					<ControlLabel>Username</ControlLabel>
					<FormControl type="text" value={this.props.user.username} onChange={this.props.onChange} />
					{usernameError}
				</FormGroup>
				<FormGroup controlId="password">
					<ControlLabel>Password</ControlLabel>
					<FormControl type="password" value={this.props.user.password} onChange={this.props.onChange} />
					{passwordError}
				</FormGroup>

				<Button type="submit">Submit</Button>
			</form>
		);
	}
}

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	successMessage: PropTypes.string.isRequired
}

export default LoginForm;