import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button, InputGroup, Glyphicon } from 'react-bootstrap';
import bootstrap from '../../../server/static/css/bootstrap.css'
import style from '../../../server/static/css/style.css'

class SearchForm extends React.Component {
	render() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<FormGroup controlId="searchTerm">
					<ControlLabel>Search for nightlife near you.</ControlLabel>
					<InputGroup>
						<FormControl type="text" value={this.props.searchTerm} onChange={this.props.onChange} />
						<InputGroup.Button>
							<Button type="submit"><Glyphicon glyph="search" /></Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>
			</form>
		);
	}
}

SearchForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	searchTerm: PropTypes.string.isRequired
}

export default SearchForm;