import './basic.css'
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Login from "./login.js";
import Dashboard from "./dashboard.js";
import db from "./firebase.js";
import * as firebase from "firebase";
import 'firebase/auth';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: null,
            isLogin: false,
            isNewUser: null,
            email:null,
            theme:'dk'
        }
        this.handleSignUp = this.handleSignUp.bind(this);
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
    }
    changeTheme(){
        this.setState(preState=>{
            let newTheme;
            if (preState.theme === 'dk'){
                console.log('lt');
                newTheme = 'lt';
            }else if(preState.theme === 'lt'){
                console.log('dk');
                newTheme = 'dk';
            }
            return{
                theme:newTheme
            }
        })
    }
    toggleSignIn(email,pass) {
        if (firebase.auth().currentUser) {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
        } else {
            // Sign in with email and pass.
            // [START authwithemail]
            firebase.auth().signInWithEmailAndPassword(email, pass).then((cred)=>{
                console.log('signInWithEmailAndPassword');
            }).catch(function(error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error); // [END_EXCLUDE]
            });// [END authwithemail]
        }
    }

    handleSignUp(email,password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((cred)=>{
                this.setState(preState=>{
                    return{
                        isNewUser : cred.additionalUserInfo.isNewUser
                    }
                });
            })
            .catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                    return;
                }
                console.log(error);
            });
    };

    componentDidMount(){
        this.onAuthStateChanged();
    }
    
    onAuthStateChanged(){
        firebase.auth().onAuthStateChanged((user) => {
            //要寫arrow function 不寫function(user)：
            // 因為在component下的method裡，this會自動對應到component，所以可以用this.state指回去取得資料
            // 如果寫function(user){裡面的this就會指向別的東西}
            if (user) {
                if(this.state.isNewUser === true){ 
                    db.collection("members").doc(`${user.uid}`)
                        .set({
                            email:this.state.email,
                            uid:user.uid
                        })
                    // 第一次sign in,登入狀態
                    this.setState({
                        isLogin: true,
                        uid: user.uid,
                        email: user.email
                    })
                }else{ 
                    //其他次sign in,登入狀態
                    let ref = db.collection('members').doc(`${user.uid}`);
                    ref.get().then(doc => {
                        // state狀態的改變在這裡做
                        this.setState({
                            isLogin: true,
                            uid: user.uid,
                            email: user.email
                        })
                    }); ;
                }
            } else {
                //登出狀態
                this.setState(preState=>{
                    // state狀態的改變在這裡做
                    return{
                        isNewUser: null,
                        isLogin: false,
                        uid: null,
                        email: null
                    }
                });
            }
        });
    }

// togglesignin handdlesignup：做時記得登入登出
// onAuthStateChanged: state狀態的改變在這裡做（因為登入登出後都會串到這裡）


    render() {
        if(this.state.isLogin == true){
            return <div><Redirect to ="/dashboard"/>
            <Route path="/dashboard">
                {/* <Calendar/> */}
                <Dashboard theme={this.state.theme} uid={this.state.uid} changeTheme={this.changeTheme.bind(this)} toggleSignIn={this.toggleSignIn.bind(this)}/>
            </Route></div>
            
        }else{    
            return <div>
                <Redirect to ="/"/>
                <Route path="/">
                    <Login toggleSignIn={this.toggleSignIn.bind(this)} handleSignUp={this.handleSignUp.bind(this)}/>
                </Route>
            </div>
        }
        
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



// 樹狀圖概念：
// （因為“使用者登入登出狀態isLogin”，每一層都會參考使用到，所以可放在頂層)
// 下層的Component可以讀取上層的props,使用上層的method
// ex: 上層裡寫<Login email={this.state.email} password={this.state.password}/>
// ex: <Dashboard uid={this.state.uid} toggleSignIn={this.toggleSignIn.bind(this)}/>
// 下層可以將自己那一層的state，用參數的形式傳回上層的method裡
// ex: 下層裡寫<div className="login_btn" onClick={()=>{this.props.toggleSignIn(this.state.email)}}>LOGIN</div>