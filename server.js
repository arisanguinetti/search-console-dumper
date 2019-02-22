const moment = require('moment')
const kue = require('kue')
const queue = kue.createQueue()

queue.on('job enqueue', function (id, type) {
    console.log('Job %s got queued of type %s', id, type);
});

const months = 16;
const now = moment().subtract(3, 'days'); // NO DATA IN THE LAST 3 DAYS
const startDate = moment(now).subtract(months, 'months'); // NO DATA IN THE LAST 3 DAYS

let i = 0;
let delay = 500;

while (now.diff(startDate) > 0) {
    let job = queue.create('retrieveSearchConsoleData', {
        startDate: startDate.format('YYYY-MM-DD')
    }).delay(
        i * delay
    ).attempts(3).backoff({
        type: 'exponential'
    }).save(function (err) {
        if (!err) console.log(job.id);
    });

    i++;

    startDate.add(1, 'days')
}

process.once('SIGTERM', function (sig) {
    queue.shutdown(5000, function (err) {
        console.log('Kue shutdown: ', err || '');
        process.exit(0);
    });
});;