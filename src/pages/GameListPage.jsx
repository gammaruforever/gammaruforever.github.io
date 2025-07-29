import { Link } from 'react-router-dom'
import './GameListPage.css'

const RECENT_YEAR = 2025;
const YEARS = Array.from({length: RECENT_YEAR-2016+1}, (_, i) => RECENT_YEAR - i)
const SEASONS = [
  { key: 'winter', label: '겨울공모전' },
  { key: 'summer', label: '여름공모전' }
]

function GameListPage() {
  return (
    <div className="game-list-page" style={{maxWidth: 1200, margin: '0 auto', padding: 20, position: 'relative'}}>
      <Link to="/">
        <button className="mainpage-top-btn">메인 페이지로</button>
      </Link>
      <h1 style={{textAlign: 'center', marginBottom: 40}}>공모전 게임 리스트</h1>
      {YEARS.map(year => (
        <div key={year} style={{marginBottom: 40}}>
          <h2 style={{paddingBottom: 8, textAlign: 'center'}}>{year}년</h2>
          <div className="game-list-year-section">
            {SEASONS.map(season => (
              <Link
                key={season.key}
                to={`/games/${year}/${season.key}`}
                style={{flex: 1, minWidth: 300, textDecoration: 'none'}}
              >
                <div className="game-list-contest-btn">
                  <h3>{season.label}</h3>
                  <div style={{color: '#bbb', textAlign: 'center', fontSize: '0.95rem'}}>게임 리스트 보기</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameListPage 