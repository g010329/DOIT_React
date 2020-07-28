import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RenderMonthLog from "./month_log";
import RenderWeekLog from "./week_log";
import RenderDayLog from "./day_log";
import List from "./list";
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database';
// 此頁有 dashboard 的 sidebar和top nav
// 有使用者的uid: this.props.uid
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            reRender: false,
            btToday: false,
            //List
            ifInput: false,
            showWhichList:'',
            listItems: [
                // {title:'個人專案'},
                // {title:'英文學習'},
                // {title:'課程影片'}
            ],
            note:''

        };
        this.toggleNav = this.toggleNav.bind(this);
        this.getDate = this.toggleNav.bind(this);
        this.reRenderLog = this.reRenderLog.bind(this);
        this.toggleBackToToday = this.toggleBackToToday.bind(this);
        //list
        this.toggleIfInput = this.toggleIfInput.bind(this); 
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.addListToDB = this.addListToDB.bind(this);
        this.enterClick = this.enterClick.bind(this);
        this.ListFromDb = this.getListFromDB.bind(this);
        this.getListFromDB = this.getListFromDB.bind(this);
        this.listenLists = this.listenLists.bind(this);
        this.showList = this.showList.bind(this);
    }
    handleNoteChange(e){
        this.setState({
            note:e.currentTarget.value
        });
        // console.log(e.currentTarget.value);
    }
    reRenderLog(){
        this.setState(preState=>{
            let reRender = preState.reRender;
            let newRe = !reRender;
            // console.log('重新render',newRe);
            return{
                reRender: newRe
            }
        })
    }
    getListFromDB(){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("lists");
        let listItems = [];
        ref.orderBy('createdAt','asc').get().then(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                listItems.push({
                    title: doc.data().title
                });
                // console.log(doc.data());
            });
            this.setState({listItems:listItems});
        })
    }
    listenLists(){
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("lists");
        ref.orderBy('createdAt','desc').limit(1).onSnapshot(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                // console.log(doc.data());
            })
        })
    }
    toggleBackToToday(){
        // console.log('toggleBackToToday');
        this.setState(preState=>{
            let btToday = preState.btToday;
            return{
                btToday: !btToday
            }
        })
    }
    componentDidMount(){
        this.getListFromDB();
        this.listenLists();
    }
    toggleNav(){
        let sider = document.getElementById("sidebar");
        if(sider.style.display == "block"){
            sider.style.display = "none";
        }else{
            sider.style.display = "block";
        }
    }
    toggleBtn(e){
        let logBtn = e.currentTarget.getAttribute("data-btn");
        let toggleLog = document.getElementById(`${logBtn}`);
        if (logBtn == "month"){
            toggleLog.style.display = "block";
            document.getElementById("mbtn").style.backgroundColor='#e8e8e8';
            document.getElementById("mbtn").style.color='#222222';
            document.getElementById("week").style.display = "none";
            document.getElementById("wbtn").style.backgroundColor='#222222';
            document.getElementById("wbtn").style.color='#c4c1c1';
        }else if (logBtn == "week"){
            toggleLog.style.display = "block";
            document.getElementById("month").style.display = "none";
            document.getElementById("wbtn").style.backgroundColor='#e8e8e8';
            document.getElementById("wbtn").style.color='#222222';
            document.getElementById("mbtn").style.backgroundColor='#222222';
            document.getElementById("mbtn").style.color='#c4c1c1';
        }
        
        // console.log(logBtn);
    }
    addListToDB(){
        this.setState(preState=>{
            let listItems = preState.listItems;
            listItems.push({title:this.state.note});
            return{
                // listItems:listItems,
                ifInput: false,
            }
        })
        // console.log(this.state.note);
        let db = firebase.firestore();
        let ref = db.collection("members").doc(this.props.uid).collection("lists").doc();
        ref.set({
            title: this.state.note,
            isDone: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(()=>{console.log('成功新增')})
    }
    toggleIfInput(){
        this.setState({
            ifInput: true
        });
        // console.log(this.state.ifInput);
    }
    enterClick(){
        if (event.keyCode==13){
            document.getElementById("inputList").click(); //觸動按鈕的點擊
        } 
    }
    showList(e){
        this.setState({
            showWhichList: e.currentTarget.getAttribute("data-listtitle"),

        })
        this.toggleNav();
        // console.log(e.currentTarget.getAttribute("data-listtitle"));
    }
    render(){
        let renderListItem = this.state.listItems.map((item,index)=>
            <Link to='/dashboard/list' data-listtitle={item.title} key={index} onClick={this.showList}>
                <div className="sidebar_li" >
                    <span className="sidebar_icon">
                        <i className="fas fa-ellipsis-v"></i>
                    </span> 
                    <span>{item.title}</span>
                </div>
            </Link>
        );
        let showListInput = <div className="sidebar_input" onKeyDown={this.enterClick}>
                <span>
                    <input className="inputList" type="text"  onChange={this.handleNoteChange} placeholder="Add New List" autoFocus/>
                </span>
                <div className="inputCancelAdd" >
                    <span className="add" onClick={()=>{this.setState({ifInput:false})}}><i className="fas fa-times"></i></span>
                    <span id="inputList" className="cancel" onClick={this.addListToDB}><i className="fas fa-check" ></i></span>
                </div>
            </div>
        
        let showLogs = <div>
            <div className="top_nav">
                <div>
                    <span id="mbtn" className="top_nav_btn tnb1" data-btn={"month"} onClick={this.toggleBtn}>MONTH</span>
                    <span id="wbtn" className="top_nav_btn tnb1 tbtb" data-btn={"week"} onClick={this.toggleBtn}>WEEK</span>
                </div>
                <span id="dbtn" className="top_nav_btn tnb2" data-btn={"today"} onClick={this.toggleBtn} onClick={this.toggleBackToToday}>TODAY</span>
            </div>
            <div className="inner_board">
                <RenderMonthLog listItems={this.state.listItems} btToday={this.state.btToday} uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/>
                <RenderWeekLog listItems={this.state.listItems} btToday={this.state.btToday} uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/>
                <RenderDayLog listItems={this.state.listItems} btToday={this.state.btToday} uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/>
            </div>
        </div>
        // console.log(this.props.uid);
        return <div>
            <div>
                <header>
                    <div>
                        <span onClick={this.toggleNav} className="top_nav_logo"><i className="fas fa-bars"></i></span>
                        <span className="bulletword">DOIT</span>
                        <span><i className="fas fa-bolt"></i></span>
                        
                    </div>
                    <span className="header_member">
                        <div className="logout" onClick={this.props.toggleSignIn}>LOG OUT</div>
                        {/* <span className="top_nav_logo"><i className="fas fa-user"></i></span> */}
                    </span>   
                </header>

                <main>
                    <div className="dashboard_visual">
                        {/* sidebar */}
                        <div id="sidebar" className="sidebar">
                            <div className="sidebar_ul">
                                <div className="sidebar_li">
                                    <span className="sidebar_icon">
                                        <i className="fas fa-clipboard-list"></i>
                                    </span> 
                                    <span>Future Log</span>
                                </div>
                            </div>
                            <div className="sidebar_line">Lists</div>
                            {renderListItem}
                            {this.state.ifInput?showListInput:''}
                            {/* <div className="sidebar_li">
                                <span className="sidebar_icon">
                                    <i className="fas fa-ellipsis-v"></i>
                                </span> 
                                <span>個人專案</span>
                            </div> */}
                            
                            <div className="sidebar_li"  onClick={this.toggleIfInput}>
                                <span className="sidebar_icon">
                                    <i className="fas fa-plus"></i>
                                </span> 
                                <span>New List</span>
                            </div>
                        </div>
                        {/* sidebar end */}

                        {/* dashboard top_nav start */}
                        <div className="dashboard">
                            <div className="inner2_board">
                                {/* <Route path="/dashboard" exact>{showLogs}</Route> */}
                                
                                <div className="listNoDeco">
                                    <Route path="/dashboard">
                                    {/* <Route path="/dashboard/list"> */}
                                        <List showWhichList={this.state.showWhichList} uid={this.props.uid}/>
                                    </Route>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
        
            </div>;
            
            
        </div>;
    }
}
export default Dashboard;

// 在dashboard裡面有 month,week,day不同部位，使用者點擊上方按鈕，選擇要在dashboard顯示的部位
// =>類似開關的概念，不需要用到Route上一頁(分頁的概念)，dashboard用一個Route就好
// 若有需要上一頁、回到上個頁面的感覺，再用Route