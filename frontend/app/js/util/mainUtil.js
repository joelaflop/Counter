const http2 = require('http2');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const fs = require('fs');
const config = require('../../../../config.json')
const httpConfig = config.httpInfo[1]

module.exports = {

    handleDBTime: function (m, d, y) {
        let month;
        switch (m) {
            case 'Jan':
                month = 'January';
                break;
            case 'Feb':
                month = 'February';
                break;
            case 'Mar':
                month = 'March';
                break;
            case 'Apr':
                month = 'April';
                break;
            case 'May':
                month = 'May';
                break;
            case 'Jun':
                month = 'June';
                break;
            case 'Jul':
                month = 'July';
                break;
            case 'Aug':
                month = 'August';
                break;
            case 'Sept':
                month = 'September';
                break;
            case 'Oct':
                month = 'October';
                break;
            case 'Nov':
                month = 'November';
                break;
            case 'Dec':
                month = 'December';
                break;
        }
        if (d.charAt(0) === '0') {
            d = d.substring(1, 2)
        }
        return `${month} ${d}, ${y}`
    },

    handleTime: function (str) {
        let year = parseInt(str.substring(0, 4))
        let month = parseInt(str.substring(5, 7)) - 1
        let day = parseInt(str.substring(8, 10))
        let hour = parseInt(str.substring(11, 13))
        let min = parseInt(str.substring(14, 16))
        let sec = parseInt(str.substring(17, 19))
        let ms = parseInt(str.substring(20, 23))
        // console.log(`listen: ${year}-${month}-${day} -- ${hour}:${min}:${sec}.${ms}`)
        var played_at = Date.UTC(year, month, day, hour, min, sec, ms)
        var now = Date.now();
        // console.log(now)
        // console.log(played_at)
        let min_passed = (now - played_at) / (1000 * 60);
        let res;
        if (min_passed < 1.5) {
            res = `1 minute ago`
        } else if (min_passed < 60) {
            min_passed = Math.round(min_passed)
            res = `${min_passed} minutes ago`
        } else if (min_passed < (60 * 24)) {
            hours_passed = min_passed / 60;
            hours_passed = Math.round(hours_passed)
            if (hours_passed === 1) {
                res = `1 hour ago`
            } else {
                res = `${hours_passed} hours ago`
            }
        } else if (min_passed < (60 * 24 * 2)) {
            res = `yesterday`
        } else {
            days_passed = min_passed / (60 * 24);
            days_passed = Math.round(days_passed)
            if (days_passed === 1) {
                res = `1 day ago`
            } else {
                res = `${days_passed} days ago`
            }
        }
        return res;
    },

    clientRequest: function (headers, callback) {
        const clientS = http2.connect(httpConfig.URL, {
           ca: fs.readFileSync(`./certs/${httpConfig.name}-cert.pem`)
        }, function () {
           console.log('connected to https server');
        });
        const req = clientS.request(headers);
        req.on('response', (headers, flags) => {
           console.log('responses (headers):')
           for (const name in headers) {
              console.log(`${name}: ${headers[name]}`);
           }
           console.log('---------')
        });
        let data = '';
        req.on('data', (chunk) => {
           data += chunk;
        });
        req.on('end', () => {
           callback(data);
           clientS.close();
        });
        req.end();
     }

}