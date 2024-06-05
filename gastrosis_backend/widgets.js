function convertLocaleTimeString(timeString = '00:00'){
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);
    const formattedString = date.toLocaleTimeString([], {hour12: false})
    return formattedString;
}

module.exports = {
    convertLocaleTimeString
}