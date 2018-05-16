import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  browserHistory
} from 'react-router-dom'

import Main from './components/Main.jsx';

class App extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={Main} />
			</Router>
		);
	}
}

ReactDOM.render(
	(<App />), document.getElementById('root'));