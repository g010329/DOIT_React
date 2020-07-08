import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RenderMonthLog from "./month_log";
import RenderWeekLog from "./week_log";
import RenderDayLog from "./day_log";
// 此頁有 dashboard 的 sidebar和top nav

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.getDate = this.toggleNav.bind(this);
    }
    
    toggleNav(){
        let sider = document.getElementById("sidebar");
        if(sider.style.display == "block"){
            sider.style.display = "none";
        }else{
            sider.style.display = "block";
        }
    }
    getDate(){
        
    }
    render(){
        
        return <div>
            <header>
                <div>
                    <span onClick={this.toggleNav} className="top_nav_logo"><i className="fas fa-bars"></i></span>
                    <span>Bullet</span>
                    <span><i className="fas fa-bolt"></i></span>
                    
                </div>
                <span className="header_member">
                    <Link to="/" style={{ textDecoration: 'none' }}><div className="login">LOGOUT</div></Link>
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
                                <Link to="/dashboard/month_log"><span className="top_nav_btn">month</span></Link>
                                <Link to="/dashboard/week_log"><span className="top_nav_btn">week</span></Link>
                                <span className="top_nav_btn">today</span>
                                <span className="top_nav_btn">overdue</span>
                            </div>
                            {/* 主控制面板 */}
                            <div className="inner_board">

                                {/* 左面版 */}
                                <Route exact path="/"><RenderWeekLog/></Route>
                                <Route path="/dashboard/month_log"><RenderMonthLog/></Route>
                                <Route path="/dashboard/week_log"><RenderWeekLog/></Route>
                                {/* 左面版結束 */}

                                {/* 右面板 */}
                                <Route exact path="/"><RenderDayLog/></Route>
                            </div>


                        </div>
                    </div>
                </div>
            </main>
        </div>;
    }
}
export default Dashboard;