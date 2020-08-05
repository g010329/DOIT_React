import React from "react";
class LogTitle extends React.Component{
    render(){
        let theme = this.props.theme;
        return <div className={`month_title month_title_${theme}`}>
        <span className="title_month">Week {this.props.weekNum}</span>
        <span className="title_right">
            <span className={`icon_hover_span popUp icon_hover_span_${theme}`}><i className="fas fa-calendar popUp" onClick={this.props.ifChangeWeek}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left" onClick={this.props.handleWeekBackward}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={this.props.handleWeekForward}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={this.props.toggleIfInput}></i></span>
        </span>
    </div>
    }
}
export default LogTitle;