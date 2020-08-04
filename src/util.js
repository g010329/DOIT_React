

const countWeekNum=(d)=>{
    //算出今日是第幾週 d=new Date("2020-05-02")
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}


const handleValidation=(field)=>{
    // input required
    // let field = this.state.note;
    console.log('handleValid');
    let formIsValid = true;
    if(!field){
        formIsValid = false;
    }
    return formIsValid;
}

const handleNoteChange=(e)=>{
    this.setState({
        note:e.currentTarget.value
    });
    console.log('note: '+e.currentTarget.value);
}
export {countWeekNum,handleValidation,handleNoteChange}