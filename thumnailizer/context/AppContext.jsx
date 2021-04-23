import {createContext, useReducer, useContext } from 'react'
const AppContext = createContext()

function AppReducer(state, action) {
  switch (action.type) {
    case 'ADD_IMAGE': {
      return {image: action.payload}
    }
    case 'REMOVE_IMAGE': {
      return {image: null}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = useReducer(AppReducer, {image: null})
  const value = {state, dispatch}
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider')
  }
  return context
}

export { AppProvider, useAppContext }