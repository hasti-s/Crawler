const Crawler = require("crawler")
const mysql = require('mysql')


let persons = []
let index = 0
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('test.txt')
})

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const crawler = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error)
        } else {
            let query = 'INSERT INTO hasti.articles (name) values '
            const $ = res.$
            for (let c = 0; c < $(".gsc_a_t > a").length; c++) {
                // console.log($(".gsc_a_t > a")[c].children[0].data)
                query += `(\'${$(".gsc_a_t > a")[c].children[0].data}\')`
                if (c  === $(".gsc_a_t > a").length - 1)
                    query += ';'
                else
                    query += ','
            }
            console.log(query)
            con.query(query, function (err, result) {
                if (err) throw err;
                console.log("Result: " + result);
            });
            //put data in DB
        }
        done()
        index++
        crawl()
    }
});

lineReader.on('line', function (line) {
    if (persons.indexOf(line.split(';;')[0]) === -1) {
        persons.push('https://scholar.google.com' + line.split(';;')[1])
    }
})

lineReader.on('close', function () {
    crawl()
})

const crawl = () => {
    if (index < persons.length)
        crawler.queue(persons[index]);
}
