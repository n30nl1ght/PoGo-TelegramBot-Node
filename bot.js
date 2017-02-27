'use strict';

const Bot = require('./model/Bot');
const config = require('./config');
const TeleBot = require('telebot');

//init bot
let bot = new Bot();

//init telegram
let telegram = new TeleBot({
    token: config.API,
    polling: {
        interval: 1000,
        timeout: 0,
        limit: 100,
        retryTimeout: 5000
    }
});

/* ---- set telegram commands ------ */

telegram.on('/start', function(msg){
    let user = bot.doStart(msg.from);
    bot.displayStartInfo(telegram, user);
});

telegram.on('/add', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doAdd(telegram, user);
});

/* --------------------------------- */

telegram.connect();