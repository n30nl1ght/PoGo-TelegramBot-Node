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
telegram.use(require('telebot/modules/ask.js'));

/* ---- set telegram commands ------ */

telegram.on('/start', function(msg){
    let user = bot.doStart(msg.from);
    bot.displayStartInfo(telegram, user);
});
telegram.on('/stop', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user){
        bot.doStop(telegram, user);
    }
});

telegram.on('/id', function(msg){
    bot.displayId(telegram, msg.from.id);
});

telegram.on('/add', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doAdd(telegram, user);
});

telegram.on('/remove', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doRemove(telegram, msg.text);
});

telegram.on('/set', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doSetGeneration(telegram, msg.text);
});

telegram.on('/list', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doList(telegram, user);
});

telegram.on('/reset', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doResetConfirm(telegram, user);
});

telegram.on('ask.reset', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doReset(telegram, user, msg.text);
});

telegram.on(['location'], function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doLocation(telegram, user, msg.location);
});

telegram.on('ask.radius', function(msg){
    let user = bot.doCheck(telegram, msg.from.id);
    if(user) bot.doLocationRadius(telegram, user, msg.text);
});

telegram.on('/backup', function(msg){
    if(bot.doAdminCheck(telegram, msg.from.id)){
        bot.doBackup(telegram, msg.from.id);
    }
});

telegram.on('/save', function(msg){
    if(bot.doAdminCheck(telegram, msg.from.id)){
        bot.doSave(telegram, msg.from.id);
    }
});

/* --------------------------------- */

telegram.connect();