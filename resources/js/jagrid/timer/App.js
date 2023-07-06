import React from 'react';
import ReactDOM from 'react-dom';
import Stopwatch from './Stopwatch';

export default function App() {
    return <Stopwatch />
}

if (document.getElementById('timer')) {
    ReactDOM.render(<App />, document.getElementById('timer'));
}