import React from "react";
class LogTitle extends React.Component{
    render(){
        let data = this.props.data;
        let {year, month, date, theme} = data.state;
        let {ifChangeDate, handleDateBackward, handleDateForward, toggleIfInput} = data.method;
        
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
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-calendar popUp" onClick={()=>ifChangeDate()}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left"  onClick={()=>handleDateBackward()}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={()=>handleDateForward()}></i></span>
            <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={()=>toggleIfInput()}></i></span>
        </span>
    </div>
    }
}
export default LogTitle;