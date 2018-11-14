import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

class MyBookToSendRow extends React.Component {
	render() {
		return (
			<Panel>
				You agreed to send <i>{this.props.title}</i> by {this.props.author} to {this.props.receivingUser.username}.<br /><br />
				{this.props.receivingUser.firstName + ' ' + this.props.receivingUser.lastName}<br />
				{this.props.receivingUser.street}<br />
				{this.props.receivingUser.city + ' ' + this.props.receivingUser.state + ' ' + this.props.receivingUser.zipCode}<br /><br />
				Once {this.props.receivingUser.username} marks this book as received, this notice will disappear. 
			</Panel>
		);
	}
}

MyBookToSendRow.propTypes = {
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	receivingUser: PropTypes.object.isRequired
}

export default MyBookToSendRow;