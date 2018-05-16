import React from 'react';

import bootstrap from '../../../server/static/css/bootstrap.css'
import style from '../../../server/static/css/style.css'

const NotFound = () => (
	<div className={bootstrap['col-lg-12']}>
    	<h2 className={bootstrap['page-header'] + ' ' + style['page-header']}>404 - Page Not Found</h2>
    	<p>Sorry, the page you were looking for cannot be found!</p>
    </div>
)

export default NotFound;