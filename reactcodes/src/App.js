import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';

import { Observations} from "./observations";
import { SkyObjects } from "./skyobjects"

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand href="/">Yötaivas</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/havainto">Havainnot</Nav.Link>
          <Nav.Link href="/kohde">Kohteet</Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </Navbar> 
        <Switch>
          <Route exact path="/havainto" component={Observations} />
          <Route exact path="/kohde" component={SkyObjects} />
          <Redirect exact from="/" to="/havainto" />
        </Switch>

    </Router>
  );
}

export default App;
