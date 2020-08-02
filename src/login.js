import React from "react";
import { Link, animateScroll as scroll } from "react-scroll";
// let currentUserData;
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"/>
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            isloading:false
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
            console.log('enter log in');
            // console.log(e);
            document.getElementById("input1").click(); //觸動按鈕的點擊
        } //enter的鍵值為13
        if (event.keyCode==13 && btntype=='signup'){
            console.log('enter signup');
            // console.log(e);
            document.getElementById("input2").click(); //觸動按鈕的點擊
        }
    }
    
        
    
    render(){
        let loader =<div className="loader">
            <img src="./loader-1s-200px.svg"/>
        </div>
        let loginBoard = <div>
            <div className="bpartTitle">START TO DO!</div>
                <div id="start" className="login_board" data-type={'login'} onKeyDown={this.enterLogin}>
                    <div className="login_title">Log in</div>
                    <div>
                        <div className="login_account"><input  type="email" placeholder="Email Address" onChange={this.handleMailKeyInValue}></input></div>
                        <div className="login_account"><input type="password" placeholder="Password" onChange={this.handlePasswordKeyInValue}></input></div>
                        <div id="input1" className="login_btn" onClick={()=>{this.props.toggleSignIn(this.state.email,this.state.password);this.setState({isloading:true})}}>LOG IN</div>
                        
                        <div className="forget">
                        </div>
                        <div className="signUp">New User?</div>
                        <div className="signUp_btn" onClick={()=>{document.getElementById("signup").style.display="block";document.getElementById("start").style.display="none"}}>Create Account</div>
                    </div>
                </div>
                        
                <div id="signup" className="login_board" data-type={'signup'} onKeyDown={this.enterLogin}>
                    <div className="login_title">Sign Up</div>
                    <div>
                        <div className="login_account"><input  type="text" placeholder="Email Address" onChange={this.handleMailKeyInValue}></input></div>
                        <div className="login_account"><input type="password" placeholder="Password" onChange={this.handlePasswordKeyInValue}></input></div>
                        <div id="input2" className="login_btn" onClick={()=>{this.props.handleSignUp(this.state.email,this.state.password);this.setState({isloading:true})}}>Create Account</div>
                        
                        <div className="forget">
                        </div>
                        <div className="signUp">Already have account?</div>
                        <div className="signUp_btn" onClick={()=>{document.getElementById("signup").style.display="none";document.getElementById("start").style.display="block"}}>LOG IN</div>
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
                    {/* <div className="login">LOGIN</div> */}
                </span>   
            </header>
            <main >
                {/* 首頁試做 */}
                <div className="homepage">
                    <div className="aPart">
                        <div className="hpIntro">
                            <div className="hpIntroTitle">PLAN YOUR DAY,</div>
                            <div className="hpIntroTitle">WEEK AND MONTH.</div>
                            <div className="hpIntroTitle">QUICKLY.</div>
                            {/* <div className="hpIntroContent">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div> */}
                            <div className="hpIntroContent">
                                <div>Task management for busy people</div>
                                <div>Free up your mental space</div>
                                <div>Time Tracking, Make you More Productive</div>
                                <div>DOIT goes wherever tou go. It works just as well on your mobile as it does on desktop.</div>
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
                {/* <div className="visual">
                    <div className="login_board">
                        <div className="login_title">Login</div>
                        <div>
                            <div className="login_account"><input  type="text" placeholder="Email Address" onChange={this.handleMailKeyInValue}></input></div>
                            <div className="login_account"><input type="password" placeholder="Password" onChange={this.handlePasswordKeyInValue}></input></div>
                            <div className="login_btn" onClick={()=>{this.props.toggleSignIn(this.state.email,this.state.password)}}>LOGIN</div>
                            

                            <div className="forget">Forget Password?</div>
                            <div className="signUp">New User?</div>
                            
                            <div className="signUp_btn" onClick={()=>this.props.handleSignUp(this.state.email,this.state.password)}>Create Account</div>

                        </div>
                    </div>
                </div> */}
            </main>
        </div>
    }
}
export default Login;










