var moment = require('moment');

var utils = {
    dbLog(saveData) {
        console.log('');
        console.log('> Time         :', moment().format('MMMM Do YYYY, h:mm:ss a'));
        console.log('> DB PRE SAVE  :', saveData._id);
        console.log('⇣ DATA ⇣')
        console.log(saveData)
        console.log('_');
    }
}

module.exports = utils;
