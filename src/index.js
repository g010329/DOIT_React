import './basic.css'
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Login from "./login.js";
import Dashboard from "./dashboard.js";
// import Homepage from "./homepage.js";
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


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: null,
            isLogin: false,
            isNewUser: null,
            email:null
        }
        this.handleSignUp = this.handleSignUp.bind(this);
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
    }
    
    toggleSignIn(email,pass) {
        if (firebase.auth().currentUser) {
            // [START signout]
            firebase.auth().signOut();
            // alert('sigh out');
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
                alert('Sign Up Successfully!');
                // console.log(cred);
                this.setState(preState=>{
                    let isNewUser = preState.isNewUser;
                    return{
                        isNewUser : cred.additionalUserInfo.isNewUser
                    }
                });
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
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
                    console.log('第一次sign in,登入狀態');
                    let ref = db.collection('members').doc(`${user.uid}`);
                    ref.get().then(doc => {
                        // currentUserData = doc.data();
                    }); 
                    // state狀態的改變在這裡做
                    this.setState({
                        isLogin: true,
                        uid: user.uid,
                        email: user.email
                    })
                }else{ 
                    console.log('其他次sign in,登入狀態');
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
                console.log('登出狀態');
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
                <Dashboard uid={this.state.uid} toggleSignIn={this.toggleSignIn.bind(this)}/>
            </Route></div>
            
        }else{    
            return <div>
                <Redirect to ="/"/>
                {/* <Route exact path="/">
                    <Homepage/>
                </Route>   */}
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