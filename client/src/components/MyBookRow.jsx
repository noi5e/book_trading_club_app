import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import MyBookTradeRow from './MyBookTradeRow.jsx';

class MyBookRow extends React.Component {

	render() {
		let tradeRequests = ''
		let spacing = ''

		if (this.props.tradeRequests.length > 0) {
			tradeRequests = React.createElement('ul', { className: 'list-group' }, this.props.tradeRequests.map((tradeRequest, index) => {
				return <MyBookTradeRow bookCollectionId={this.props.bookCollectionId} key={tradeRequest.userId} handleAcceptRequest={(e) => this.props.handleAcceptRequest(e)} username={tradeRequest.username} city={tradeRequest.city} state={tradeRequest.state} userId={tradeRequest.userId} />;
			}))

			spacing = <div><br /></div>;
		}



		return (
			<Panel>
				<i>{this.props.title}</i> by {this.props.author}
				{spacing}
				{tradeRequests}
			</Panel>
		);
	}
}

MyBookRow.propTypes = {
	bookCollectionId: PropTypes.string.isRequired,
	handleAcceptRequest: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	tradeRequests: PropTypes.array.isRequired
}

export default MyBookRow;