import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './GameListPage.css';

const RECENT_YEAR = 2025;
const YEARS = Array.from({length: RECENT_YEAR-2016+1}, (_, i) => RECENT_YEAR - i);
const SEASONS = [
  { key: 'summer', label: '여름공모전' },
  { key: 'winter', label: '겨울공모전' },
  { key: 'gamejam', label: '게임잼' },
];

function GameListPage() {
  const [available, setAvailable] = useState({});

  useEffect(() => {
    const checkFiles = async () => {
      const result = {};
      await Promise.all(
        YEARS.flatMap(year =>
          SEASONS.map(async season => {
            try {
              const res = await fetch(`/data/${year}/${season.key}.json`, { method: 'HEAD' });
              const contentType = res.headers.get('content-type');
              result[`${year}_${season.key}`] = res.ok && contentType && contentType.includes('application/json');
            } catch {
              result[`${year}_${season.key}`] = false;
            }
          })
        )
      );
      setAvailable({ ...result });
    };
    checkFiles();
  }, []);

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
            {SEASONS.map(season => {
              const isEnabled = available[`${year}_${season.key}`];
              return isEnabled ? (
                <Link
                  key={season.key}
                  to={`/games/${year}/${season.key}`}
                  className="game-list-contest-link"
                >
                  <div className="game-list-contest-btn">
                    <h3>{season.label}</h3>
                    <div style={{color: '#bbb', textAlign: 'center', fontSize: '0.95rem'}}>
                      출품작 보기
                    </div>
                  </div>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameListPage