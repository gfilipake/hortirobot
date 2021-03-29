import "./App.scss";
import { HashRouter } from 'react-router-dom';
import { PagesRoutes } from "./pages/pages-routes";

function App() {
  return (
    <div className="app-container">
      <HashRouter>
        <PagesRoutes />
      </HashRouter>
    </div>
  );
}

export default App;
