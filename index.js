const kue = require('kue')
const dotenv = require('dotenv')
const fs = require('fs');
const {
    google
} = require('googleapis')

dotenv.config();

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })

async function retrieveSearchConsoleData(startDate, done) {
    console.log('Retrieving day ' + startDate + '!')

    const scopes = ['https://www.googleapis.com/auth/webmasters', 'https://www.googleapis.com/auth/webmasters.readonly']
    const jwt = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
        process.env.PRIVATE_KEY,
        scopes
    )

    await jwt.authorize().catch(err => done(new Error(err)))

    let req = google.webmasters('v3').searchanalytics.query({
        auth: jwt,
        siteUrl: process.env.SITE_URL,
        requestBody: {
            startDate: startDate,
            endDate: startDate,
            searchType: "web",
            dimensions: ['query', 'page'],
            rowLimit: 10000
        }
    }).catch(err => done(new Error(err)));

    let res = await req;

    let dataToWrite = '';
    let rows = res.data.rows;

    for (key in rows) {
        const row = rows[key];
        dataToWrite += row.keys[0] + "\t" + row.keys[1] + "\t" + row.keys[2] + "\t" + row.clicks + "\t" + row.impressions + "\t" + row.ctr + "\t" + row.position + "\n";
    }

    await writeFile("export/" + startDate + "-data.csv", dataToWrite).catch(err => done(new Error(err)))
    console.log('Done!')
    return done();
}

const queue = kue.createQueue();

queue.process('retrieveSearchConsoleData', function (job, done) {
    retrieveSearchConsoleData(job.data.startDate, done);
});

queue.on('error', function (err) {
    console.log('Oops... ', err);
});

queue.on('job complete', function (id, result) {
    kue.Job.get(id, function (err, job) {
        if (err) return;
        job.remove(function (err) {
            if (err) throw err;
            console.log('removed completed job #%d', job.id);
        });
    });
});

process.once('SIGTERM', function (sig) {
    queue.shutdown(5000, function (err) {
        console.log('Kue shutdown: ', err || '');
        process.exit(0);
    });
});