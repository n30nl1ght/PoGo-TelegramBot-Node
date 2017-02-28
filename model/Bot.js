const config = require('../config');
const Storage = require('../persistence/Storage');
const Pokemon = require('./Pokemon');
const User = require('./User');

class Bot{

    constructor(){
        this.init();
    }

    init(){

        //init pokemon info list
        this.pokemon = new Pokemon();

        //setup user array
        this.users = [];

        //setup admin array
        this.admins = [];

        //get data from localstorage
        let storage = new Storage();
        let self = this;
        storage.readFromLocal(function(data){
            console.log(data);
            try{ self.users = data.users; }catch(err){ }
            try{ self.admins = data.admins; }catch(err){ }
        });

        //set main admins
        if(!this.admins.indexOf(config.adminID.toString()) >= 0) this.admins.push(config.adminID.toString());

    }

    findUser(uid){
        let foundUser = false;
        this.users.forEach(function(user){
            if(user.uid == uid) foundUser = user;
        });
        return foundUser;
    }

    displayStartInfo(telegram, user){
        telegram.sendMessage(user.uid,
            "Willkommen zum Pokemon Go Telegram Bot " + user.getName() + "!"
        )
    }

    displayId(telegram, uid){
        telegram.sendMessage(uid,
            "Telegram User ID: " + uid
        );
    }

    doStart(from){
        //create user and append to users if not exists
        let user = new User(from.id, from.first_name, from.last_name);
        if(!this.findUser(from.id)) this.users.push(user);
        return user;
    }

    doStop(telegram, user){
        let markup = telegram.inlineKeyboard([
            [telegram.inlineButton('Starten', { callback: '/start' })]
        ]);
        telegram.sendMessage(user.uid, 'Funktion wird noch implementiert...', {markup});
    }

    doCheck(telegram, uid){
        let user = this.findUser(uid);
        if(user) return user;
        this.doWarn(telegram, uid);
        return false;
    }

    doAdminCheck(telegram, uid){
        if(this.admins.indexOf(uid.toString()) >= 0) return true;
        this.doAdminWarn(telegram, uid);
        return false;
    }

    doWarn(telegram, uid){
        telegram.sendMessage(uid, 'Bitte führe den Befehl /start aus um den Bot zu starten.');
    }

    doAdminWarn(telegram, uid){
        telegram.sendMessage(uid, 'Dieses Kommando ist Admin Benutzern vorbehalten.');
    }

    doAdd(telegram, user){
        telegram.sendMessage(user.uid, 'Funktion wird noch implementiert...');
    }

    doRemove(telegram, user){
        telegram.sendMessage(user.uid, 'Funktion wird noch implementiert...');
    }

    doSetGeneration(telegram, user, cmd){
        telegram.sendMessage(user.uid, 'Funktion wird noch implementiert...');
    }

    doList(telegram, user){
        telegram.sendMessage(user.uid, 'Funktion wird noch implementiert...');
    }

    doResetConfirm(telegram, user){
        telegram.sendMessage(
            user.uid,
            'Wirklich alle deine Einstellungen zurücksetzen?\nBestätige mit "Ja"',
            {ask: 'reset'});
    }

    doReset(telegram, user, answere){
        // Reset der Userconfig implementieren und setzen des active status auf false

        telegram.sendMessage(user.uid, 'Einstellungen wurden zurückgesetzt.');
    }

    doLocation(telegram, user, location){
        // Speichern in der localeStorage muss noch implementiert werden
        //location.latitude
        //location.longitude

        telegram.sendMessage(user.uid,
            'Dein Standort wurde festgelegt.\nSetze nun einen Radius in Meter:',
            { ask: 'radius'});
    }

    doLocationRadius(telegram, user, radius){
        // Speichern in der localeStorage muss noch implementiert werden

        telegram.sendMessage(user.uid,
            'Der Radius von *' + radius + '* wurde gesetzt.',
            {'parse': 'Markdown'});
    }


    doBackup(telegram, uid){
        let storage = new Storage();
        storage.saveToFile({users: this.users, admins: this.admins}, function(status){
            console.log(status);
            telegram.sendMessage(uid, status);
        });
    }

    doSave(telegram, uid){
        let storage = new Storage();
        storage.saveToLocal({users: this.users, admins: this.admins}, function(status){
            console.log(status);
            telegram.sendMessage(uid, status);
        });
    }

}

module.exports = Bot;