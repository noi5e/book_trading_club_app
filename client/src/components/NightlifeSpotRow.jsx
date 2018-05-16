import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button } from 'react-bootstrap';
import bootstrap from '../../../server/static/css/bootstrap.css';

class NightlifeSpotRow extends React.Component {
	render() {
		let checkinString = ' checked in here.';

		if (this.props.checkins === 0) {
			checkinString = "No one has" + checkinString;
		} else if (this.props.checkins === 1) {
			const subject = this.props.userIsCheckedIn ? "You have" : "1 person has";

			checkinString = subject + checkinString;
		} else {
			const subject = (this.props.userIsCheckedIn) ? "You and " + (this.props.checkins - 1) + " other" : this.props.checkins;
			const personOrPeople = (this.props.checkins === 2 && this.props.userIsCheckedIn) ? " person " : " people ";

			checkinString = subject + personOrPeople + 'have' + checkinString;
		}

		const checkButton = (this.props.userIsCheckedIn === true) ? <div id={this.props.id} className={bootstrap['btn'] + ' ' + bootstrap['btn-warning']} onClick={this.props.onClick}>Check Out</div> : <div id={this.props.id} className={bootstrap['btn'] + ' ' + bootstrap['btn-success']} onClick={this.props.onClick}>Check In!</div>;

		return (
			<Panel>
				<img src={this.props.imageUrl} height='200px' width='200px' style={{ float: 'left', marginRight: '25px' }} /><b><a href={this.props.url}>{this.props.name}</a></b><br /><b>rating:</b> {this.props.rating}<br /><b>review count:</b> {this.props.reviewCount}<br /><br />
				{checkButton}<br />
				<b>{checkinString}</b>
			</Panel>
		);
	}
}

NightlifeSpotRow.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	imageUrl: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
	reviewCount: PropTypes.number.isRequired,
	url: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	checkins: PropTypes.number.isRequired,
	userIsCheckedIn: PropTypes.bool
}

export default NightlifeSpotRow;