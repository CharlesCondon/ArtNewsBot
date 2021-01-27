var Twit = require('twit');
var puppeteer = require('puppeteer');
var config = require('./config');

var T = new Twit(config);
// scraping function that goes to artnews.com and tweets the top story
async function scrapeAN () {
    const url = 'https://www.artnews.com';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // scrape title of article to use as text in tweet
    const [first] = await page.$x('//*[@id="main-wrapper"]/main/div[2]/div[1]/div/article/div/div[2]/div/h3/a/text()');
    const txt = await first.getProperty('textContent');
    const title = await txt.jsonValue();

    // scrape the link that the article is on to direct to in tweet
    const hrefs = await Promise.all((
        await page.$x('//*[@id="main-wrapper"]/main/div[2]/div[1]/div/article/div/div[2]/div/h3/a')).map(async item => await (await item.getProperty('href')).jsonValue()));

    makeTweet(title, hrefs[0]);
}
scrapeAN();
setInterval(scrapeAN, (1000*60*60*24));

// scraping function that goes to theartnewspaper.com and tweets the top story
async function scrapeNewspaper () {
    const url2 = 'https://www.theartnewspaper.com/new-york';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url2);

    // scrape title of article to use as text in tweet
    const [second] = await page.$x('/html/body/div[2]/div[2]/div[3]/main/div/div[1]/div[1]/a/text()');
    const txt2 = await second.getProperty('textContent');
    const title2 = await txt2.jsonValue();

    // scrape the link that the article is on to direct to in tweet
    const hrefs = await Promise.all((
        await page.$x('/html/body/div[2]/div[2]/div[3]/main/div/div[1]/div[1]/a')).map(async item => await (await item.getProperty('href')).jsonValue()));

    makeTweet(title2, hrefs[0]);
}
scrapeNewspaper();
setInterval(scrapeNewspaper, (1000*60*60*24));

// scraping function that goes to ny-artnews.com and tweets the top story
async function scrapeNYart () {
    const url3 = 'https://www.ny-artnews.com';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url3);

    // scrape title of article to use as text in tweet
    const [third] = await page.$x('//*[@id="pgi600af639162d990017db73c8_0"]/div[2]/div/article/div/a/div[1]/h2/div');
    const txt3 = await third.getProperty('textContent');
    const title3 = await txt3.jsonValue();

    // scrape the link that the article is on to direct to in tweet
    const hrefs = await Promise.all((
        await page.$x('//*[@id="pgi600af639162d990017db73c8_0"]/div[2]/div/article/div/a')).map(async item => await (await item.getProperty('href')).jsonValue()));

    makeTweet(title3, hrefs[0]);
}
scrapeNYart();
setInterval(scrapeNYart, (1000*60*60*24));

// tweet function that connects to Twitter api to send out the tweet
// and writes to console if the post worked or not
function makeTweet(title, link) {
    var tweet = {
        status: title + link 
    }
    var timeline = {
        screen_name: 'artnewsforyou',
        count: 25
    }

    T.get('statuses/user_timeline', timeline, timelineCheck);

    // mini function to check if this article has already been tweeted
    function timelineCheck(err, data, response) {
        var checker = 0;
        if (err) {
            console.log("Error with checking timeline :(");
        }
        else {
            var pastTL = data;
            for (var i = 0; i < pastTL.length; i++) {
                if (pastTL[i].text.includes(title.trim())) {
                    checker = 1;
                    console.log("This has already been tweeted");
                }
            }
            if (checker == 0) {
                T.post('statuses/update', tweet, tweeted);
                console.log("Tweet sending");
            }
        }
    }

    // mini function to catch errors that come from the twitter api itself
    function tweeted(err, data, response) {
        if (err) {
            console.log("Error with tweet :(");
        }
        else {
            console.log("The tweet worked!");
        }
    }
}
