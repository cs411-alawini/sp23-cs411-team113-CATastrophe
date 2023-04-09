import BasicSQL from './components/BasicSQL';
import TechStack from './components/TechStack';

// populates '/' route, or the home page
function App() {

  return (
    <div>
      <TechStack />
      <BasicSQL />
    </div>
  );
}

export default App;
