import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AppConstextProvider } from './context/AppContextProvider.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<AppConstextProvider>
				<App />
			</AppConstextProvider>
		</BrowserRouter>
	</StrictMode>,
)
