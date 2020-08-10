

const countWeekNum=(d)=>{
    //算出今日是第幾週 d=new Date("2020-05-02")
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}


const handleValidation=(field)=>{
    // input required
    let formIsValid = true;
    if(!field){
        formIsValid = false;
    }
    return formIsValid;
}

const format = (number)=>{
    // if(number > 11 || number<0){
    //     console.log('month does not exist');
    //     return null;
    if(number<10){
		return "0" + number;
	}else{
		return "" + number;
	}
}

const autoHeight = ()=>{
    let x = this.testHeight.current;
    x.style.height = 'auto';
    x.style.height = x.scrollHeight + "px";
}
export {countWeekNum, handleValidation, format, autoHeight}