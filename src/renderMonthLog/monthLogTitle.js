import React from "react";
class LogTitle extends React.Component{
    render(){
        let eachMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return <div className={`month_title month_title_${this.props.theme}`}>
            <span>
                <span className="title_month">{eachMonth[this.props.month]}</span>
                <span className="title_monthyear"> &nbsp; of {this.props.year}</span>
            </span>
            <span className="title_right">
                <span className={`icon_hover_span icon_hover_span_${this.props.theme} popUp`}><i className="fas fa-calendar popUp" onClick={this.props.ifChangeMonth}></i></span>
                <span className={`icon_hover_span icon_hover_span_${this.props.theme}`}><i className="fas fa-angle-left"  value="-" onClick={this.props.handleMonthBackward}></i></span>
                <span className={`icon_hover_span icon_hover_span_${this.props.theme}`}><i className="fas fa-angle-right" onClick={this.props.handleMonthForward}></i></span>
                <span className={`icon_hover_span icon_hover_span_${this.props.theme}`}><i className="fas fa-plus" onClick={this.props.toggleIfInput}></i></span>
            </span>
        </div>
    }
}
export default LogTitle;