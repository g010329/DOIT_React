import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Login extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        
    }
    render(){
        return <div>
            <header>
                <div>
                    <span className="top_nav_logo"><i className="fas fa-bars"></i></span>
                    <span>Bullet</span>
                    <span><i className="fas fa-bolt"></i></span>
                    
                </div>
                <span className="header_member">
                    <div className="login">LOGIN</div>
                </span>   
            </header>
            <main>
                <div className="visual">
                    <div className="login_board">
                        <div className="login_title">Login</div>
                        <div>
                            <div className="login_account"><input  type="text" placeholder="Email Address"></input></div>
                            <div className="login_account"><input type="text" placeholder="Password"></input></div>
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}><div className="login_btn">LOGIN</div></Link>
                            <div className="forget">Forget Password?</div>
                            <div className="signUp">New User?</div>
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}><div className="signUp_btn">Create Account</div></Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    }
}
export default Login;