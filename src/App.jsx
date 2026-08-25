import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';

function App () {
    return (
        <div>
            <Routes>
                <Route index element={<LandingPage/>}/>
            </Routes>
        </div>
    )
}

export default App
