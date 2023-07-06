import React, { createContext, useReducer, useContext, useMemo } from 'react'
import { object, func } from 'prop-types'

const Context = createContext()

export function AppStateProvider({ reducer, initialState = {}, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const store = useMemo(() => [state, dispatch], [state]);
  return (
    <Context.Provider value={store}>
      {children}
    </Context.Provider>
  )
}

AppStateProvider.propTypes = {
  reducer: func,
  initialState: object,
}

export function useAppState() {
  return useContext(Context)
}

/*import React, { createContext, useReducer, useContext } from 'react'
import { object, func } from 'prop-types'

const Context = createContext()

export function AppStateProvider({ reducer, initialState = {}, children }) {
  const value = useReducer(reducer, initialState)

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

AppStateProvider.propTypes = {
  reducer: func,
  initialState: object,
}

export function useAppState() {
  return useContext(Context)
}
*/