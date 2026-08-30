import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { useAppContext } from './context/AppContextProvider';
import { LoginPage } from './pages/LoginPage';

function App() {


	const { isUser } = useAppContext();

	return (
		<div>
			<Routes>
				{
					isUser ? (

						<Route index element={<LandingPage />} />
					) : (

						<Route index element={<LoginPage />} />
					)
				}
			</Routes>
		</div>
	)
}

export default App
