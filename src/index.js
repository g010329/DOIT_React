import './basic.css'
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./login.js";
import Dashboard from "./dashboard.js";


class App extends React.Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        return <div>
            <Route exact path="/">
                {/* <Dashboard/>  */}
                <Login/>
            </Route>
            <Route path="/dashboard">
                <Dashboard/>
            </Route>    
        </div>;
    }
}

ReactDOM.render(
    <Router>
        <Switch>
            <App />
        </Switch>
    </Router>
    , document.querySelector("#root")
);



