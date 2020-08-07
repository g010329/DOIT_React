import React from "react";
class LogTitle extends React.Component{
    render(){
        let data = this.props.data;
        let {weekNum, theme} = data.state;
        let {ifChangeWeek, handleWeekBackward, handleWeekForward, toggleIfInput} = data.method;
        return <div className={`month_title month_title_${theme}`}>
        <span className="title_month">Week {weekNum}</span>
        <span className="title_right">
            <span className={`icon_hover_span popUp icon_hover_span_${theme}`}><i className="fas fa-calendar popUp" onClick={()=>ifChangeWeek()}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left" onClick={()=>handleWeekBackward()}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={()=>handleWeekForward()}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={()=>toggleIfInput()}></i></span>
        </span>
    </div>
    }
}
export default LogTitle;