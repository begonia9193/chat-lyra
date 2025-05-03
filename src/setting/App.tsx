import './App.css';

function App() {
  const writeSettings = () => {
    localStorage.setItem('settings', '123');
  };

  const getSettings = () => {
    const settings = localStorage.getItem('settings')
    console.log(settings)
  }

  return (
    <div className='w-full h-full'>
      设置页面
      <button onClick={writeSettings} >写入设置</button>
      <button onClick={getSettings}>获取设置</button>
    </div>
  );
}

export default App;
