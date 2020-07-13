import React from "react";
import { BrowserRouter as Router, Switch, Route, Link , Redirect} from "react-router-dom";

// let currentUserData;

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.handleMailKeyInValue = this.handleMailKeyInValue.bind(this);
        this.handlePasswordKeyInValue = this.handlePasswordKeyInValue.bind(this);
    }
    handleMailKeyInValue(e){
        this.setState({
            email:e.currentTarget.value
        });
    }
    handlePasswordKeyInValue(e){
        this.setState({
            password:e.currentTarget.value
        });
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
                            <div className="login_btn" onClick={()=>{this.props.toggleSignIn(this.state.email,this.state.password)}}>LOGIN</div>
                            

                            <div className="forget">Forget Password?</div>
                            <div className="signUp">New User?</div>
                            
                            <div className="signUp_btn" onClick={()=>this.props.handleSignUp(this.state.email,this.state.password)}>Create Account</div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    }
}
export default Login;










