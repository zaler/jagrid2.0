import React from 'react';
import ReactDOM from 'react-dom';

import { GlobalProvider } from './context/GlobalState';
import CardList from './components/CardList';

export default function App(){
    return(
        <GlobalProvider>
            <CardList />
        </GlobalProvider>
    )
}

if (document.getElementById('cards')) {
    ReactDOM.render(<App />, document.getElementById('cards'));
}