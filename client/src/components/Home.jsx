import React from 'react';
import bootstrap from '../../../server/static/css/bootstrap.css'
import style from '../../../server/static/css/style.css'
import Auth from '../../modules/Auth.js';
import SearchFormContainer from './SearchFormContainer.jsx';

class Home extends React.Component {
	render() {
		return (
			<div className={bootstrap['col-lg-12']}>
				<SearchFormContainer />
			</div>
		);
	}
}

export default Home;