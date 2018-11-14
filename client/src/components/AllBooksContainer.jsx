import React from 'react';
import Auth from '../../modules/Auth.js';
import AllBookRow from './AllBookRow.jsx';
import { Redirect } from 'react-router-dom';

class AllBooksContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			successMessage: '',
			redirectToLogin: false,
			allBooks: {},
			isLoaded: false
		}
	}

	componentWillMount() {

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/api/get_all_books');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';

		if (Auth.isUserAuthenticated()) {
			xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`)
		} else {
			xhr.setRequestHeader('Authorization', `Bearer null`)
		}

		let response = [];

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				console.log(xhr.response);

				this.setState({
					allBooks: xhr.response,
					isLoaded: true
				});
			} else {
				console.log(xhr.response);
			}
		});

		xhr.send();
	}

	handleBookRequest(event) {
		event.preventDefault();

		if (!Auth.isUserAuthenticated()) {
			this.setState({
				redirectToLogin: true
			});
		} else {

			const formData = `bookId=${event.target.id}`;

			const xhr = new XMLHttpRequest();
			xhr.open('post', '/api/make_book_request');
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);
			xhr.responseType='json';

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					console.log(xhr.response);

					this.setState({
						successMessage: xhr.response.message
					});
				} else {
					console.log(xhr.response);
				}
			});	

			xhr.send(formData);

			let newAllBooks = this.state.allBooks.slice(0);

			for (let i = 0; i < newAllBooks.length; i++) {
				if (newAllBooks[i]._id === event.target.id) {
					newAllBooks[i].userAlreadyRequested = true;
				}
			}

			this.setState({
				allBooks: newAllBooks
			});
		}
	}

	render() {
		let bookList = [];
		let successMessage = [];

		if (this.state.successMessage) {
			successMessage = React.createElement('div', { role: 'alert', className: 'alert alert-success' }, this.state.successMessage);
		}

		if (this.state.redirectToLogin) {
			localStorage.setItem('successMessage', 'Login to your account to request a book.');

			return (
				<Redirect push to='/login' />
			);
		}

		if (!this.state.isLoaded) {
	
			return (
				<div className='col-lg-12'>
					<h2 className='page-header'>All Books</h2>
					Loading books...
				</div>
			);

		} else {

			if (this.state.allBooks.length > 0) {
				bookList = this.state.allBooks.map((book, index) => {

					return <AllBookRow key={index} id={book._id} onClick={(e) => this.handleBookRequest(e) } author={book.author} title={book.title} usersOwnBook={book.usersOwnBook} userAlreadyRequested={book.userAlreadyRequested} />;
				});
			} else {
				bookList = "No one has added a book yet. Why not be the first?"
			}

			return (
				<div className='col-lg-12'>
					<h2 className='page-header'>All Books</h2>
					{successMessage}
					{bookList}
				</div>
			);
		}
	}
}

export default AllBooksContainer;