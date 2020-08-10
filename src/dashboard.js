import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MonthLog from "./MonthLog/monthLog_main";
import WeekLog from "./WeekLog/weekLog_main";
import DayLog from "./DayLog/dayLog_main";
import List from "./list";
import db from "./firebase.js";
import * as firebase from "firebase";

// 此頁有 dashboard 的 sidebar和top nav
// 有使用者的uid: this.props.uid
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.mbtn = React.createRef();
        this.wbtn = React.createRef();
        this.inputList =React.createRef();
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
            note:'',
            theme: this.props.theme,
            showWhichLog: 'week'

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
        this.showList = this.showList.bind(this);
        //outside
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.toggleBtn = this.toggleBtn.bind(this);
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
        document.addEventListener('click', this.handleClickOutside, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }
    
    handleClickOutside(event) {
        // 點擊sidebar外部關閉sidebar
        let sider = document.getElementById("sidebar");
        if(event.target.className=='fas fa-bars'||event.target.className=='top_nav_logo'){
            return;
        }else if(this.node.contains(event.target)){
            return;
        }else{
            sider.style.display = "none";
            this.setState({
                ifInput: false
            })
        }
    }
    toggleNav(e){
        let sider = document.getElementById("sidebar");
        if(sider.style.display == "block"){
            sider.style.display = "none";
            this.setState({
                ifInput: false
            })
        }else{
            sider.style.display = "block";
        }
    }
    toggleBtn(e){
        let {theme} = this.state;
        let logBtn = e.currentTarget.getAttribute("data-btn");
        let toggleLog = document.getElementById(`${logBtn}`);
        if (logBtn == "month"){
            toggleLog.style.display = "block";
            this.mbtn.current.className = `top_nav_btn tnb1-2_${theme}`;
            document.getElementById("week").style.display = "none";
            this.wbtn.current.className = `top_nav_btn tnb1_${theme}`;
        }else if (logBtn == "week"){
            toggleLog.style.display = "block";
            document.getElementById("month").style.display = "none";
            this.mbtn.current.className = `top_nav_btn tnb1_${theme}`;
            this.wbtn.current.className = `top_nav_btn tnb1-2_${theme}`;
        }
    }
    addListToDB(){
        this.setState(preState=>{
            let listItems = preState.listItems;
            listItems.push({title:this.state.note});
            return{
                ifInput: false
            }
        })
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
            this.inputList.current.click();
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
        let theme = this.state.theme;
        let renderListItem = this.state.listItems.map((item,index)=>
            <Link to='/dashboard/list' data-listtitle={item.title} key={index} onClick={this.showList}>
                <div className={`sidebar_li sidebar_li_${theme}`} >
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
                    <span className="add" onClick={()=>{this.setState({ifInput:false})}}><i className="fas fa-times addListcancel"/></span>
                    <span ref={this.inputList} className="cancel" onClick={this.addListToDB}><i className="fas fa-check addListcancel" /></span>
                </div>
            </div>
        
        let showLogs = <div>
            <div className="top_nav">
                <div>
                    <span ref={this.mbtn} className={`top_nav_btn tnb1_${theme}`} data-btn={"month"} onClick={this.toggleBtn}>MONTH</span>
                    <span ref={this.wbtn} className={`top_nav_btn tnb1-2_${theme}`} data-btn={"week"} onClick={this.toggleBtn}>WEEK</span>
                </div>
                <span className={`top_nav_btn tnb2_${theme}`} data-btn={"today"} onClick={this.toggleBtn} onClick={this.toggleBackToToday}>TODAY</span>
            </div>
            <div className="inner_board">
            
                <MonthLog theme={this.state.theme} listItems={this.state.listItems} btToday={this.state.btToday} uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/>
                <WeekLog theme={this.state.theme} listItems={this.state.listItems} btToday={this.state.btToday} uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/>
                <DayLog theme={this.state.theme} listItems={this.state.listItems} btToday={this.state.btToday} uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/>
            </div>
        </div>
        return <div>
            <div>
                <header className={'header_'+theme}>
                    <div>
                        <span onClick={this.toggleNav}  className="top_nav_logo"><i className="fas fa-bars"></i></span>
                        <span className="bulletword">DOIT</span>
                        <span><i className="fas fa-bolt"></i></span>
                        
                    </div>
                    <span className="header_member">
                        <div className={`logout logout_${theme}`} onClick={this.props.toggleSignIn}>LOG OUT</div>
                        {/* <span className="top_nav_logo"><i className="fas fa-user"></i></span> */}
                    </span>   
                </header>

                <main>
                    <div className="dashboard_visual">
                        {/* sidebar */}
                        <div id="sidebar" ref={node=>this.node=node} className={`sidebar sidebar_${theme}`}>
                            <div className="sidebar_line">LIST</div>
                            {renderListItem}
                            {this.state.ifInput?showListInput:''}
                            <div className={`sidebar_li sidebar_li_${theme}`}  onClick={this.toggleIfInput}>
                                <span className="sidebar_icon">
                                    <i className="fas fa-plus"></i>
                                </span> 
                                <span>New List</span>
                            </div>
                        </div>
                        {/* sidebar end */}

                        {/* dashboard top_nav start */}
                        {/* <div className="dashboard dashboard_dk"> */}
                        <div className={`dashboard dashboard_${theme}`}>
                            <div className="inner2_board">
                                <Route path="/dashboard" exact>{showLogs}</Route>
                                
                                <div className="listNoDeco">
                                    {/* <Route path="/dashboard"> */}
                                    <Route path="/dashboard/list">
                                        <List theme={this.state.theme} showWhichList={this.state.showWhichList} uid={this.props.uid}/>
                                    </Route>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
        
            </div>
            
            
        </div>;
    }
}

export default Dashboard;

// 在dashboard裡面有 month,week,day不同部位，使用者點擊上方按鈕，選擇要在dashboard顯示的部位
// =>類似開關的概念，不需要用到Route上一頁(分頁的概念)，dashboard用一個Route就好
// 若有需要上一頁、回到上個頁面的感覺，再用Route