import BasicSQL from '../components/BasicSQL';
import Logos from '../components/Logos';

// populates '/' route, or the home page
function App() {

  return (
    <div className="content-container">
      <Logos />
      <BasicSQL />
    </div>
  );
}

export default App;
