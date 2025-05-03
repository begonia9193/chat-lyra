import './App.css';
import { Base } from './pages/Base';

function App() {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='h-50px font-500 text-24px b-b-1 b-solid b-line px-24px flex items-center'>
        设置
      </div>
      <div className='w-full h-full flex-1 of-hidden'>
        <Base />
      </div>
    </div>
  );
}

export default App;
