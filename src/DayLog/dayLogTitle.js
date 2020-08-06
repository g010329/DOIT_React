import React from "react";
class LogTitle extends React.Component{
    render(){
        let {year, month, date, theme} = this.props;
        let todayHint = <span className="onlyShowToday">Today </span>
        let yearHint = <span className="showYear">{year}</span>
        return <div className={`month_title month_title_${theme}`}>
        <div>
            {date==new Date().getDate() && month==new Date().getMonth()?todayHint:''}
            <span className="title_month">
                {month+1}/{date}
            </span>
            {date==new Date().getDate() && month==new Date().getMonth()?'':yearHint}
            
        </div>
        
        <span className="title_right">
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-calendar popUp" onClick={this.props.ifChangeDate}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left"  onClick={this.props.handleDateBackward}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={this.props.handleDateForward}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={this.props.toggleIfInput}></i></span>
        </span>
    </div>
    }
}
export default LogTitle;