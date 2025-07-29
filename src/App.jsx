import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import GameListPage from './pages/GameListPage'
import ContestGameListPage from './pages/ContestGameListPage'
import './App.css'

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/games" element={<GameListPage />} />
        <Route path="/games/:year/:season" element={<ContestGameListPage />} />
      </Routes>
    </Router>
  )
}

export default App
