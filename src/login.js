import React from "react";
import { Link, animateScroll as scroll } from "react-scroll";

class Login extends React.Component{
    constructor(props){
        super(props);
        this.inputLogin = React.createRef();
        this.inputSignUp = React.createRef();
        this.loginBoard = React.createRef();
        this.signupBoard = React.createRef();
        this.state = {
            email: 'test@gmail.com',
            password: 'test123',
            isloading: false
        }
        this.handleMailKeyInValue = this.handleMailKeyInValue.bind(this);
        this.handlePasswordKeyInValue = this.handlePasswordKeyInValue.bind(this);
        this.enterLogin = this.enterLogin.bind(this);
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
    
    enterLogin(e){
        let btntype = e.currentTarget.getAttribute("data-type");
        if (event.keyCode==13 && btntype=='login'){
            this.inputLogin.current.click();
        }
        if (event.keyCode==13 && btntype=='signup'){
            this.inputSignUp.current.click();
        }
    }
    
    render(){
        let loader =<div className="loader">
            <img src="./loader-1s-200px.svg"/>
        </div>
        let loginBoard = <div>
            <div className="bpartTitle">START TO DO!</div>
                <div id="start" ref={this.loginBoard} className="login_board" data-type={'login'} onKeyDown={this.enterLogin}>
                    <div className="login_title">Log in</div>
                    <div>
                        <div className="login_account"><input type="email" placeholder="Email Address" onChange={this.handleMailKeyInValue} value={this.state.email}></input></div>
                        <div className="login_account"><input type="password" placeholder="Password" onChange={this.handlePasswordKeyInValue} value={this.state.password}></input></div>
                        <div ref={this.inputLogin} className="login_btn" onClick={()=>{this.props.toggleSignIn(this.state.email,this.state.password);this.setState({isloading:true})}}>LOG IN</div>
                        
                        <div className="forget">
                        </div>
                        <div className="signUp">New User?</div>
                        <div className="signUp_btn" onClick={()=>{this.signupBoard.current.style.display="block";this.loginBoard.current.style.display="none"}}>Create Account</div>
                    </div>
                </div>
                        
                <div ref={this.signupBoard} className="login_board signUp_board" data-type={'signup'} onKeyDown={this.enterLogin}>
                    <div className="login_title">Sign Up</div>
                    <div>
                        <div className="login_account"><input  type="text" placeholder="Email Address" onChange={this.handleMailKeyInValue}></input></div>
                        <div className="login_account"><input type="password" placeholder="Password" onChange={this.handlePasswordKeyInValue}></input></div>
                        <div ref={this.inputSignUp} className="login_btn" onClick={()=>{this.props.handleSignUp(this.state.email,this.state.password);this.setState({isloading:true})}}>Create Account</div>
                        
                        <div className="forget">
                        </div>
                        <div className="signUp">Already have account?</div>
                        <div className="signUp_btn" onClick={()=>{this.signupBoard.current.style.display="none";this.loginBoard.current.style.display="block"}}>LOG IN</div>
                    </div>
                    
                </div>
            </div>
        return <div>
            <header className="header_dk">
                <div>
                    <span className="top_nav_logo"><i className="fas fa-bars"></i></span>
                    <span className="bulletword">DOIT</span>
                    <span><i className="fas fa-bolt"></i></span>
                    
                </div>
                <span className="header_member">
                </span>   
            </header>
            <main >
                <div className="homepage">
                    <div className="aPart">
                        <div className="hpIntro">
                            <div className="hpIntroTitle">PLAN YOUR DAY,</div>
                            <div className="hpIntroTitle">WEEK AND MONTH.</div>
                            <div className="hpIntroTitle">QUICKLY.</div>
                            <div className="hpIntroContent">
                                <div>Task management for busy people</div>
                                <div>Free up your mental space</div>
                                <div>Time tracking</div>
                                <div>Make you more productive</div>
                            </div>
                            <Link
                                activeClass="active"
                                to="start"
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration= {500}
                            ><div className="lgbtn animate__pulse">Log In</div></Link>
                        </div>
                        <div className="hpImg">
                            <img src="./homepage.jpg"/>
                        </div>
                    </div>
                    <div className="bPart">
                        {this.state.isloading?loader:loginBoard}
                    </div>
                </div>
            </main>
        </div>
    }
}
export default Login;










