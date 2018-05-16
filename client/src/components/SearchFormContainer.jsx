import React from 'react';
import SearchForm from './SearchForm.jsx';
import NightlifeSpotRow from './NightlifeSpotRow.jsx';
import Auth from '../../modules/Auth.js';
import { Redirect } from 'react-router-dom';

class SearchFormContainer extends React.Component {

	// initialize state for the app, get search term cached from local storage.
	constructor(props) {
		super(props);

		this.state = {
			errors: {},
			redirectToLogin: false,
			searchTerm: localStorage.getItem('searchTerm') ? localStorage.getItem('searchTerm') : '',
			searchData: []
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this); 
	}

	// if there is a search term cached in local storage, call the yelp API to get business data
	componentWillMount() {
		if (this.state.searchTerm.length > 0) {
			this.loadBusinessData(this.state.searchTerm, (data) => {
				this.setState({
					searchData: data
				})
			});
		}
	}

	// this function updates the search form text input value.
	handleChange(event) {
		this.setState({
			searchTerm: event.target.value
		});
	}

	// helper function loads business data from yelp
	loadBusinessData(searchTerm, callback) {
		if (searchTerm && searchTerm.length > 0) {

			const formData = `searchTerm=${encodeURIComponent(searchTerm)}`;

			const xhr = new XMLHttpRequest();
			xhr.open('post', '/api')
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			if (Auth.isUserAuthenticated()) {
				xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`)
			} else {
				xhr.setRequestHeader('Authorization', `Bearer null`)
			}

			xhr.responseType = 'json';

			let response = [];

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					console.log(xhr.response);

					localStorage.setItem('searchData', JSON.stringify(xhr.response));

					callback(xhr.response);
				} else {
					console.log(xhr.response);

					callback([]);
				}
			});

			xhr.send(formData);


		} else {
			callback([]);
		}

	}

	// submits search text form
	handleSubmit(event) {
		event.preventDefault();

		localStorage.setItem('searchTerm', this.state.searchTerm);

		this.loadBusinessData(this.state.searchTerm, (response) => {
			this.setState({
				searchData: response
			});
		});
	}

	handleCheckInCheckOutButtonClick(event) {
		// get stored username token from Auth
		// send it, along with the id in an xhr request to /api/checkin

		event.preventDefault();

		if (!Auth.isUserAuthenticated()) {
			this.setState({
				redirectToLogin: true
			});
		}

		const businessId = encodeURIComponent(event.target.id);
		const formData = `businessId=${businessId}`;

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/api/checkin_checkout');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);
		xhr.responseType = 'json';

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				
				let newSearchData = this.state.searchData.slice();

				for (var i = 0; i < newSearchData.length; i++) {
					if (newSearchData[i].id === xhr.response.id) {
						newSearchData[i].checkins = xhr.response.checkins;
						newSearchData[i].userIsCheckedIn = xhr.response.userIsCheckedIn;
					}
				}

				this.setState({
					searchData: newSearchData
				});
			} else {
				console.log(xhr.response);
			}
		});

		xhr.send(formData);
	}

	render() {
		if (this.state.redirectToLogin) {
			localStorage.setItem('successMessage', 'Login to your account to check in or check out.')

			return (
				<Redirect push to='/login' />
			);
		}

		let nightlifeList = [];

		if (this.state.searchData.length > 0) {
			nightlifeList = this.state.searchData.map((nightlifeSpot, index) => {
				return <NightlifeSpotRow key={nightlifeSpot.id} id={nightlifeSpot.id} name={nightlifeSpot.name} imageUrl={nightlifeSpot.image_url} rating={nightlifeSpot.rating} userIsCheckedIn={nightlifeSpot.userIsCheckedIn} checkins={nightlifeSpot.checkins} reviewCount={nightlifeSpot.review_count} url={nightlifeSpot.url} onClick={(e) => this.handleCheckInCheckOutButtonClick(e)} />
			});
		}

		return (
			<div><SearchForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} errors={this.state.errors} searchTerm={this.state.searchTerm} />
			{nightlifeList}</div>
		);
	}
}

export default SearchFormContainer;