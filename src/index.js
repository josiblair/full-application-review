import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker'; //change from registerServiceWorker() to deconstructed unregister
import { Provider } from 'react-redux';
import store from './store';

//Provider becomes the root compoonent (which is provided by redux) when we wrap <App /> with it 

ReactDOM.render(
<Provider store={ store }>
    <App />
</Provider>, document.getElementById('root'));
unregister(); //also change here!!
