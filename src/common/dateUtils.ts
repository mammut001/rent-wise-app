/**
 * TimeUtils
 * @export
 * @class DateUtils
 */
export default class DateUtils {

    /**
     * Get current timestamp
     * @returns {number}
     */
    static getCurrentTimeStamp() {
        return (new Date()).getTime();
    }

    /**
     * Cover timestamp to YYYY-MM-DD HH:mm:ss
     * number: Pass in the timestamp
     * format: Return format, support custom, but the parameter must be kept in line with the formateArr
     */
    static formatTime(number, format = 'Y-M-D') {

        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        var date = new Date(number);
        returnArr.push(date.getFullYear());
        returnArr.push(formatNumber(date.getMonth() + 1));
        returnArr.push(formatNumber(date.getDate()));

        returnArr.push(formatNumber(date.getHours()));
        returnArr.push(formatNumber(date.getMinutes()));
        returnArr.push(formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    }


    /**
     * Fetch the current time in Y/M/D format
     * @returns {*}
     */
    static getCurrentDateformaterString() {
        return DateUtils.dateFormatterString()
    }

    /**
     * Conver Unix timestamp to Y/M/D format
     * @param timeStamp
     * @returns {*}
     */
    static dateFormatterString(timeStamp = DateUtils.getCurrentTimeStamp()) {
        return DateUtils.formatTime(timeStamp, 'Y/M/D')
    }


    /**
     * Fetch the timestamp by year, month, day
     * @param year
     * @param month
     * @param day
     */
    static getTimeStampFromYearMonthDay(year = 1970, month = 1, day = 1) {
        let dateString = `${year}-${this.add0(month)}-${this.add0(day)} 00:00:00`
        let timestamp = Date.parse(dateString)
        return timestamp
    }

    /**
     * Return format: YY-MM-DD based on the YY-MM-DD
     * @param year
     * @param month
     * @param day
     * @return {string}
     */
    static formatFromYearMonthDay(year = 1970, month = 1, day = 1) {
        let dateString = `${year}-${this.add0(month)}-${this.add0(day)}`
        return dateString
    }
    /**
     * Month day add 0
     * @param m
     * @returns {string}
     */
    static add0 = function (m) {
        return m < 10 ? '0' + m : m
    }


    /**
     * Unified string format.
     * @param date
     * @returns {string return format:yyyy-MM-dd}
     */
    static formatToUniqueDate(date = "") {
        if (date.indexOf('-') < 0) {
            return date
        }
        return `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`;

    }


}


//Data conversion
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
