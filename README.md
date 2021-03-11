# ArtNewsBot

This is a little pet project in which I created an automated Twitter bot using Twitter's API.

## What It Does
The bot itself scrapes various news sites related to art, grabs the attached link and artile title, and posts it to twitter in one convenient space.

The bot is also set to only check for new articles once every 24 hours in order to not clog up the twitter feed. A safety function was also added here to make sure that no duplicate tweets were sent out either. 

### What is being used:
The program was made using node.js, Twit from npm, and Puppeteer from npm.
Deployment and maintenance is done by Heroku.
