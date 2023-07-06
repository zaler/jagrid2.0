import React from 'react';
import ReactDOM from 'react-dom';
import { initialState, combineReducers } from './reducers'
import { AppStateProvider } from './contexts/appState'

import Calendar from './components/Calendar';
import calendarReducer from './reducers/calendarReducer';
import objectiveReducer from './reducers/objectiveReducer';

const appReducers = combineReducers({
  calendar: calendarReducer,
  objectives: objectiveReducer
})

const App = () => {
  
  return (
    <AppStateProvider reducer={appReducers} initialState={initialState}>
      <Calendar />
    </AppStateProvider>
  );
}

export default App;

if (document.getElementById('calendar')) {
  ReactDOM.render(<App />, document.getElementById('calendar'));
}