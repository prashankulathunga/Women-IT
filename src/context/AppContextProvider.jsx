import { createContext, useContext } from 'react'

const AppContext = createContext()
export const AppContextProvider = ({ children }) => {

	const value = {
		isUser: false
	}

	return <AppContext.Provider value={value}>
		{children}
	</AppContext.Provider>

}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
	const context = useContext(AppContext)
	return context
}
