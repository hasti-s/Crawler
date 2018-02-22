const Crawler = require("crawler");
const fs = require('fs');

let persons = []
const crawler = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const coResarchers = $(".gsc_rsb_a_desc > a");
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log('researcher:' + $("title").text());

            for (let c = 0; c < coResarchers.length; c++) {
                console.log('co-researcher:',coResarchers[c].children[0].data,
                    coResarchers[c].children[0].parent.attribs.href)
                if (persons.indexOf(coResarchers[c].children[0].parent.attribs.href) === -1) {
                    crawler.queue('https://scholar.google.com' + coResarchers[c].children[0].parent.attribs.href)
                    persons.push(coResarchers[c].children[0].parent.attribs.href)
                }

                //write in file
                fs.appendFile("./test.txt", coResarchers[c].children[0].data + ";;" +
                    coResarchers[c].children[0].parent.attribs.href + "\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            }
        }
        done();
    }
});


// Queue just one URL, with default callback
crawler.queue(['https://scholar.google.com/citations?user=Jfq6yqMAAAAJ&hl=en&oi=sra']);
