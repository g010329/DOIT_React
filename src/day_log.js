import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class RenderDayLog extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return <div className="right_board">
        <div className="today_board">
            <div className="month_title">
                <span className="title_month">Today</span>
                <span className="title_right">
                    <span><i className="fas fa-calendar"></i></span>
                    <span><i className="fas fa-angle-left"></i></span>
                    <span><i className="fas fa-angle-right"></i></span>
                    <span><i className="fas fa-plus"></i></span>
                </span>
            </div>
            <div className="month_todos">
                <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div>
            </div>
        </div>
        <div className="overdue_board">
            <div className="month_title">
                <span className="title_month">Overdue</span>
            </div>
            <div className="month_todos">
                <div className="month_todo">
                    <span><input type="checkbox" name="" id=""/>睡覺</span>
                    <span className="month_todo_feacture">
                        <span><i className="fas fa-angle-double-right"></i></span>
                        <span><i className="fas fa-info-circle"></i></span>
                        <span><i className="fas fa-arrows-alt"></i></span>
                    </span>
                </div>
            </div>
        </div>   
    </div>
    }
}
export default RenderDayLog;