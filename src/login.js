import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB9Y-LXYOSanoqtrf96n7JsIFy4_75NMTQ",
    authDomain: "bullet-journal-d10dc.firebaseapp.com",
    databaseURL: "https://bullet-journal-d10dc.firebaseio.com",
    projectId: "bullet-journal-d10dc",
    storageBucket: "bullet-journal-d10dc.appspot.com",
    messagingSenderId: "842027935278",
    appId: "1:842027935278:web:783484d8d01ac52306e1bf",
    measurementId: "G-TX3T2J9KLL"
};
 {/* // Initialize Firebase */}
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            isNewUser: null
        }
        this.handleMailKeyInValue = this.handleMailKeyInValue.bind(this);
        this.handlePasswordKeyInValue = this.handlePasswordKeyInValue.bind(this);
    }



    handleMailKeyInValue(e){
        this.setState({
            email:e.currentTarget.value
        });
        console.log(this.state);
    }

    handlePasswordKeyInValue(e){
        this.setState({
            email:e.currentTarget.value
        });
        console.log(this.state);
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
                            <div className="login_account"><input  type="text" placeholder="Email Address" onChange={this.handleMailKeyInValue}></input></div>
                            <div className="login_account"><input type="text" placeholder="Password" onChange={this.handlePasswordKeyInValue}></input></div>
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










