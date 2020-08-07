import React from "react";
class LogTitle extends React.Component{
    render(){
        let data = this.props.data;
        let {year, month, theme} = data.state;
        let {ifChangeMonth, handleMonthBackward, handleMonthForward, toggleIfInput} = data.method;
        let eachMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return <div className={`month_title month_title_${theme}`}>
            <span>
                <span className="title_month">{eachMonth[month]}</span>
                <span className="title_monthyear"> &nbsp; of {year}</span>
            </span>
            <span className="title_right">
                <span className={`icon_hover_span icon_hover_span_${theme} popUp`}><i className="fas fa-calendar popUp" onClick={()=>ifChangeMonth()}></i></span>
                <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-left"  value="-" onClick={()=>handleMonthBackward()}></i></span>
                <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-angle-right" onClick={()=>handleMonthForward()}></i></span>
                <span className={`icon_hover_span icon_hover_span_${theme}`}><i className="fas fa-plus" onClick={()=>toggleIfInput()}></i></span>
            </span>
        </div>
    }
}
export default LogTitle;