import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

class MyBookToReceiveRow extends React.Component {
	render() {
		return (
			<Panel>
				<div id={this.props.userId + '&' + this.props.bookCollectionId} className='btn btn-success pull-right accept-request' onClick={(e) => this.props.markReceivedBook(e)}>I Received This Book</div>
				{this.props.username} from {this.props.city}, {this.props.state} accepted your request. The following book is on its way to the address listed on your profile:<br /><br />
				<i>{this.props.title}</i> by {this.props.author}			
			</Panel>
		);
	}
}

MyBookToReceiveRow.propTypes = {
	bookCollectionId: PropTypes.string.isRequired,
	userId: PropTypes.string.isRequired,
	markReceivedBook: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	state: PropTypes.string.isRequired
}

export default MyBookToReceiveRow;