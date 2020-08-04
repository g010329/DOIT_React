

const countWeekNum=(d)=>{
    // console.log('dy',d.getFullYear(),d.getMonth(),d.getDate());
    // console.log(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    //算出今日是第幾週 d=new Date("2020-05-02")
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // console.log('d',d);
    // console.log(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // console.log('setUTCDate',d);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // console.log('yearStart',yearStart);
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // console.log('weekNo',weekNo);
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