import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './ContestGameListPage.css'
import PopupModal from './PopupModal';

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseCreators(creator) {
  if (Array.isArray(creator)) return creator;
  if (typeof creator === 'string') {
    if (creator.includes(',')) return creator.split(',').map(s => s.trim());
    if (creator.includes(' ')) return creator.split(/\s*,\s*|\s{2,}/).map(s => s.trim()).filter(Boolean);
    return [creator];
  }
  return [];
}

function ContestGameListPage() {
  const { year, season } = useParams()
  const [games, setGames] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [descModal, setDescModal] = useState({ open: false, desc: '' });

  useEffect(() => {
    setGames([])
    setError(null)
    setLoading(true)
    // public 폴더 기준 상대경로 fetch (vite/react-scripts 환경)
    fetch(`/data/${year}/${season}.json`)
      .then(res => {
        if (!res.ok) throw new Error('데이터 파일이 없습니다.')
        return res.json()
      })
      .then(data => setGames(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [year, season])

  return (
    <div className="game-list-page" style={{maxWidth: 1200, margin: '0 auto', padding: 20, position: 'relative'}}>
      <Link to="/games">
        <button className="mainpage-top-btn">공모전 전체 목록</button>
      </Link>
      <h1 style={{textAlign: 'center', marginBottom: 40}}>
        {year}년 {season === 'summer' ? '여름공모전' : '겨울공모전'} 게임 리스트
      </h1>
      {loading ? (
        <div style={{color: '#bbb', textAlign: 'center', fontSize: '1.1rem', marginTop: 40}}>로딩 중...</div>
      ) : error ? (
        <div style={{color: '#ff7675', textAlign: 'center', fontSize: '1.1rem', marginTop: 40}}>에러: {error}</div>
      ) : games.length === 0 ? (
        <div style={{color: '#bbb', textAlign: 'center', fontSize: '1.1rem', marginTop: 40}}>등록된 게임이 없습니다.</div>
      ) : (
        <div className="games-grid">
          {games.map(game => {
            return (
              <div
                key={game.id}
                className={`game-card game-card-clickable`}
                onClick={e => {
                  setDescModal({
                    open: true,
                    title: game.title,
                    team: game.team,
                    creator: game.creator,
                    downloadUrl: game.downloadUrl,
                    desc: game.description,
                    genre: game.genre,
                    screenShots: game.screenShots || [],
                    readme: game.readme
                  });
                }}
                tabIndex={0}
                role="button"
                style={{
                  pointerEvents: 'auto',
                  opacity: 1
                }}
              >
                <img
                  src={game.imageUrl ? game.imageUrl : "/gammaruCharacter.png"}
                  alt={game.title || '게임 정보 없음'}
                  className="game-image"
                  onError={e => { e.target.onerror = null; e.target.src = '/gammaruCharacter.png'; }}
                />
                <div className="game-info">
                  <h3>
                    {game.rank === 1 && <span className="medal-badge gold">🥇</span>}
                    {game.rank === 2 && <span className="medal-badge silver">🥈</span>}
                    {game.rank === 3 && <span className="medal-badge bronze">🥉</span>}
                    {game.title || '게임 정보 없음'}
                  </h3>
                  <div className="game-team">{game.team || '팀명 없음'}</div>
                  <a
                    href={game.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                    style={{
                      pointerEvents: isValidUrl(game.downloadUrl) ? 'auto' : 'none',
                      opacity: isValidUrl(game.downloadUrl) ? 1 : 0.5
                    }}
                    tabIndex={isValidUrl(game.downloadUrl) ? 0 : -1}
                    aria-disabled={!isValidUrl(game.downloadUrl)}
                    onClick={e => {
                      if (!isValidUrl(game.downloadUrl)) e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    {isValidUrl(game.downloadUrl) ? '다운로드' : '파일 없음'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    <PopupModal open={descModal.open} onClose={() => setDescModal({ open: false, desc: '' })}>
      <div className="popup-game-info">
        <div className="popup-game-title">{descModal.title}</div>
        <div className="popup-game-team">팀명: {descModal.team || '팀명 없음'}</div>
        <div className="popup-game-creator">
          {Array.isArray(descModal.creator)
            ? `제작자: ${descModal.creator.join(', ')}`
            : descModal.creator
            ? `제작자: ${descModal.creator}`
            : ''}
        </div>
        {/* 장르 추가 */}
        <div className="popup-game-genre">
          장르: {descModal.genre || '정보 없음'}
        </div>
        <div className="popup-game-desc" style={{whiteSpace: 'pre-line', marginTop: 12}}>
          {descModal.desc || '소개가 없습니다.'}
        </div>
        {/* 게임 스샷 목록 추가 */}
        <div className="popup-game-screenshots" style={{ marginTop: 10 }}>
          <div>게임 스크린샷:</div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 4,
              justifyContent: 'center', // 가운데 정렬 추가
              alignItems: 'center'      // 세로 가운데 정렬 추가
            }}
          >
            {(descModal.screenShots && descModal.screenShots.length > 0)
              ? descModal.screenShots.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`screenshot-${idx + 1}`}
                    style={{
                      width: 200,
                      height: 140,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #eee'
                    }}
                    onError={e => { e.target.onerror = null; e.target.src = '/gammaruCharacter.png'; }}
                  />
                ))
              : <span style={{ color: '#bbb' }}>스크린샷 없음</span>
            }
          </div>
        </div>
        {/* 게임 README 내용 추가 */}
        <div className="popup-game-readme" style={{ marginTop: 10 }}>
          <div>게임 README:</div>
          <pre style={{ background: '#f8f8f8', padding: 8, borderRadius: 4, maxHeight: 200, overflowY: 'auto', fontSize: 13 }}>
            {descModal.readme || 'README 정보 없음'}
          </pre>
        </div>
        {/* 다운로드 버튼 추가 */}
        <div className="popup-game-download" style={{ marginTop: 10 }}>
          <a
            href={descModal.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
            style={{
              pointerEvents: isValidUrl(descModal.downloadUrl) ? 'auto' : 'none',
              opacity: isValidUrl(descModal.downloadUrl) ? 1 : 0.5,
            }}
            tabIndex={isValidUrl(descModal.downloadUrl) ? 0 : -1}
            aria-disabled={!isValidUrl(descModal.downloadUrl)}
          >
            {isValidUrl(descModal.downloadUrl) ? '다운로드' : '파일 없음'}
          </a>
        </div>
      </div>
    </PopupModal>
  </div>
  )
}

export default ContestGameListPage