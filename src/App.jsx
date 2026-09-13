import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SignupPage } from './pages/SignupPage';
import { LayoutPage } from './pages/LayoutPage';

function App() {

	return (
		<div>
			<Routes>
				<Route path='/' element={ <LayoutPage/> }>
					<Route index element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
				</Route>
			</Routes>
		</div>
	)
}

export default App
