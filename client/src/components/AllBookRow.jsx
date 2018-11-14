import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button } from 'react-bootstrap';

class AllBookRow extends React.Component {
	render() {
		let button = <div id={this.props.id} className='btn btn-success pull-right' onClick={this.props.onClick}>Request This Book</div>;

		if (this.props.usersOwnBook) {
			button = <div id={this.props.id} className='btn btn-success disabled pull-right'>You Own This Book</div>;
		}

		if (this.props.userAlreadyRequested) {
			button = <div id={this.props.id} className='btn btn-success disabled pull-right'>You Requested This Book</div>;
		}

		return (
			<Panel>
				{button}
				<i><b>{this.props.title}</b></i><br />{this.props.author}
			</Panel>
		);
	}

	// <Button id={this.props.id} onClick={this.props.onClick} className='pull-right'>
}

AllBookRow.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	userAlreadyRequested: PropTypes.bool,
	usersOwnBook: PropTypes.bool
}

export default AllBookRow;