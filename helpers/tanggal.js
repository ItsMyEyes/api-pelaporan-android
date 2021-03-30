

exports.now = () => {
    const time = new Date().toLocaleString("en-us",{ timeZone: "Asia/Jakarta" })
    return new Date(time).toJSON()
}

exports.formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

exports.formatTime = (date) => {
    var d  = new Date(date),
        hours = '' + (d.getHours()),
        minute = '' + (d.getMinutes()),
        seccond = '' + (d.getSeconds())

    if (hours.length < 2) 
        hours = '0' + hours;
    if (minute.length < 2) 
        minute = '0' + minute;
    if (seccond.length < 2) 
        seccond = '0' + seccond;

    return [hours,minute,seccond].join(':')
}
exports.formatTime2 = (date) => {
    var d  = new Date(date),
        hours = '' + (d.getHours()),
        minute = '' + (d.getMinutes()),
        seccond = '' + (d.getSeconds())

    if (hours.length < 2) 
        hours = '0' + hours;
    if (minute.length < 2) 
        minute = '0' + minute;
    if (seccond.length < 2) 
        seccond = '0' + seccond;

    return [hours,minute,seccond].join('-')
}

exports.getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }