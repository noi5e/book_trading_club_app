import React from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, FormGroup, ControlLabel, FormControl, Button, InputGroup, Glyphicon, HelpBlock } from 'react-bootstrap';

class MyBooksForm extends React.Component {
	render() {
		let titleError = "";
		let authorError = "";

		if (this.props.errors.title) {
			titleError = <HelpBlock className='help-block-text'>{this.props.errors.title}</HelpBlock>
		}

		if (this.props.errors.author) {
			authorError = <HelpBlock className='help-block-text'>{this.props.errors.author}</HelpBlock>
		}

		return (
			<Jumbotron>
				<h2 className='page-header'>Add New Book</h2>
				<form onSubmit={this.props.onSubmit}>
					<FormGroup controlId="title">
						<ControlLabel>Title</ControlLabel>
						<FormControl type="text" value={this.props.formBook.title} onChange={this.props.onChange} />
						{titleError}
					</FormGroup>
					<FormGroup controlId="author">
						<ControlLabel>Author</ControlLabel>
						<FormControl type="text" value={this.props.formBook.author} onChange={this.props.onChange} />
						{authorError}
					</FormGroup>

					<Button type="submit">Add Book</Button>
				</form>
			</Jumbotron>
		);
	}
}

MyBooksForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	formBook: PropTypes.object.isRequired
}

export default MyBooksForm;