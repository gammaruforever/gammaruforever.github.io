import './MainPage.css'

function MainPage() {
  return (
    <div className="main-page">
      <img src="https://lh3.googleusercontent.com/d/1EPzXe4LFdxraxNx8nzY12Mjlk58LuARF" alt="Gammaru" style={{width: 700, height: 500}} />
      <h1>GAMMARU 공모전 게임 아카이브</h1>
      <p>2016년부터 2025년까지의 여름/겨울 공모전 게임들을 한 곳에서!</p>
      <a href="/games">
        <button>공모전 게임 리스트 보기</button>
      </a>
    </div>
  )
}

export default MainPage 