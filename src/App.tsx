import { useState } from 'react';
import './App.css';
import AppContext from './lib/app-context';
import { Routes, Route } from 'react-router-dom'
import { userType } from './lib/appContextType';
import TopNavigationBar from './components/navigations/topNavigationBar';
import MileagePage from './pages/mileage/mileage';
import MileageHRPage from './pages/mileage/mileageHR';

export default function App() {
  const [user, setUser] = useState<userType>({ EmployeeID: 165, FullName: 'Chai C', Email: 'cc@cc.com' })

  return (
    <AppContext.Provider value={{user, setUser}}>
        <div style={{ display: 'flex' }}>
          <div style={{ flexBasis: '100%', marginTop: 70 }}>
            <TopNavigationBar />
            <Routes>
              <Route path='mileage' element={<MileagePage />} />
              <Route path='mileageHR' element={<MileageHRPage />} />
            </Routes>
          </div>
        </div>
    </AppContext.Provider>
  );
}