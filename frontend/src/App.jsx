import { useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import IdleScreen from './pages/IdleScreen';
import LanguageSelect from './pages/LanguageSelect';
import AuthScreen from './pages/AuthScreen';
import CitizenDashboard from './pages/CitizenDashboard';
import BillPayment from './pages/BillPayment';
import GrievanceForm from './pages/GrievanceForm';
import TrackStatus from './pages/TrackStatus';
import MyDocuments from './pages/MyDocuments';
import AdminDashboard from './pages/AdminDashboard';

export const AppContext = createContext();

function App() {
  const { i18n } = useTranslation();
  const [fontScale, setFontScale] = useState('default');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [citizenName, setCitizenName] = useState('');

  const changeFontScale = (scale) => {
    setFontScale(scale);
    document.documentElement.setAttribute('data-font-scale', scale);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const login = (name) => {
    setIsAuthenticated(true);
    setCitizenName(name || 'Citizen');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCitizenName('');
  };

  return (
    <AppContext.Provider value={{
      fontScale, changeFontScale,
      changeLanguage, currentLang: i18n.language,
      isAuthenticated, login, logout, citizenName
    }}>
      <div className="app-layout" data-font-scale={fontScale}>
        <Routes>
          <Route path="/" element={<IdleScreen />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              isAuthenticated ? <CitizenDashboard /> : <Navigate to="/auth" />
            } />
            <Route path="/bill-payment" element={
              isAuthenticated ? <BillPayment /> : <Navigate to="/auth" />
            } />
            <Route path="/grievance" element={
              isAuthenticated ? <GrievanceForm /> : <Navigate to="/auth" />
            } />
            <Route path="/track-status" element={
              isAuthenticated ? <TrackStatus /> : <Navigate to="/auth" />
            } />
            <Route path="/documents" element={
              isAuthenticated ? <MyDocuments /> : <Navigate to="/auth" />
            } />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
