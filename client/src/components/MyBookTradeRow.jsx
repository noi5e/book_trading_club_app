import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';

class MyBookTradeRow extends React.Component {

	render() {
		return (
			<ListGroupItem>
				<div id={this.props.userId + '&' + this.props.bookCollectionId} className='btn btn-success pull-right accept-request' onClick={(e) => this.props.handleAcceptRequest(e)}>Accept Request</div>
				{this.props.username} from {this.props.city}, {this.props.state} has requested this book.
			</ListGroupItem>
		);
	}
}

MyBookTradeRow.PropTypes = {
	bookCollectionId: PropTypes.string.isRequired,
	handleAcceptRequest: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	state: PropTypes.string.isRequired,
	userId: PropTypes.string.isRequired,
}

export default MyBookTradeRow;