import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Observations} from "./observations";
import { SkyObjects } from "./skyobjects"

function App() {
  return (
    <Router>
      <div>  
        <nav>
          <ul>
            <li>
              <Link to="/havainto">Havainnot</Link>
            </li>
            <li>
              <Link to="/kohde">Kohteet</Link>
            </li>
          </ul>
        </nav> 
          <Switch>
            <Route exact path="/havainto" component={Observations} />
            <Route exact path="/kohde" component={SkyObjects} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
