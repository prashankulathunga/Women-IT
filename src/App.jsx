import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SignupPage } from './pages/SignupPage';

function App() {

	return (
		<div>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
			</Routes>
		</div>
	)
}

export default App
