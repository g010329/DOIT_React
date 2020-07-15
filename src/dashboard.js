import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RenderMonthLog from "./month_log";
import RenderWeekLog from "./week_log";
import RenderDayLog from "./day_log";
// 此頁有 dashboard 的 sidebar和top nav
// 有使用者的uid: this.props.uid
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            reRender: false
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.getDate = this.toggleNav.bind(this);
        this.reRenderLog = this.reRenderLog.bind(this);
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
// 
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
            if(toggleLog.style.display == "block"){
                toggleLog.style.display = "none";
                document.getElementById("week").style.display = "block";
            }else{
                toggleLog.style.display = "block";
                document.getElementById("week").style.display = "none";
            }
        }else if (logBtn == "week"){
            if(toggleLog.style.display == "block"){
                toggleLog.style.display = "none";
                document.getElementById("month").style.display = "block";
            }else{
                toggleLog.style.display = "block";
                document.getElementById("month").style.display = "none";
            }
        }
        
        console.log(logBtn);
    }
    render(){
        console.log(this.props.uid);
        return <div>
            <header>
                <div>
                    <span onClick={this.toggleNav} className="top_nav_logo"><i className="fas fa-bars"></i></span>
                    <span>Bullet</span>
                    <span><i className="fas fa-bolt"></i></span>
                    
                </div>
                <span className="header_member">
                    <div className="login" onClick={this.props.toggleSignIn}>LOGOUT</div>
                    <span className="top_nav_logo"><i className="fas fa-user"></i></span>
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

                        <div className="sidebar_li">
                            <span className="sidebar_icon">
                                <i className="fas fa-ellipsis-v"></i>
                            </span> 
                            <span>個人專案</span>
                        </div>

                        <div className="sidebar_li">
                            <span className="sidebar_icon">
                                <i className="fas fa-ellipsis-v"></i>
                            </span> 
                            <span>英文學習</span>
                        </div>
                        
                        <div className="sidebar_li">
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
                        {/* top nav */}
                            <div className="top_nav">
                                <span className="top_nav_btn" data-btn={"month"} onClick={this.toggleBtn}>month</span>
                                <span className="top_nav_btn" data-btn={"week"} onClick={this.toggleBtn}>week</span>
                                <span className="top_nav_btn" data-btn={"today"} onClick={this.toggleBtn}>today</span>
                                <span className="top_nav_btn" data-btn={"overdue"} onClick={this.toggleBtn}>overdue</span>
                            </div>
                            {/* 主控制面板 */}
                            <div className="inner_board">

                                {/* 左面版 */}
                                <Route path="/dashboard"><RenderMonthLog uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/></Route>
                                <Route path="/dashboard"><RenderWeekLog uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/></Route>
                                {/* <Route path="/dashboard/week_log"><RenderWeekLog/></Route> */}
                                {/* 左面版結束 */}

                                {/* 右面板 */}
                                <Route path="/dashboard"><RenderDayLog uid={this.props.uid} reRender={this.state.reRender} reRenderLog={this.reRenderLog.bind(this)}/></Route>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
        </div>;
    }
}
export default Dashboard;

// 在dashboard裡面有 month,week,day不同部位，使用者點擊上方按鈕，選擇要在dashboard顯示的部位
// =>類似開關的概念，不需要用到Route上一頁(分頁的概念)，dashboard用一個Route就好
// 若有需要上一頁、回到上個頁面的感覺，再用Route