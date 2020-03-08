let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let defaultColor = '#000000';

let messages = [
    /*
    {message: {from: 'devon', msg: 'fuck', topic: 'general'}, date: '2020-02-07 12:30:13', color: '#ff0000', accountID: 1234567890},
    */
];

let availableUserNames = [
    "aaaa","bbbb","cccc","dddd","eeee","ffff","gggg","hhhh","iiii",
    "j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
];

let allUsersEver = [
    // {socketID: 4579437, username: devon, loggedIn: true, accountID: 1234567890}
];

function generateUniqueID(){
    let id;
    let unique = false;
    while(!unique){
        id = Math.floor(Math.random() * 10000000000);
        let test = true;
        for(let i = 0; i < allUsersEver.length; i++){
            if(allUsersEver[i].accountID === id){
                // a failed unique number
                test = false;
                break;
            }
        }
        if(test){
            unique = true;
        }
    }
    return "#" + JSON.stringify(id);
}

function findAUsername(){
    
    for(let i = 0; i < availableUserNames.length; i++){
        let found = true;
        for(let j = 0; j < allUsersEver.length; j++){
            if(availableUserNames[i] === allUsersEver[j].username){
                // this username wont due
                j = allUsersEver.length; // end the loop
                found = false;
            }
        }
        if(found === true){
            // available[i] is not used
            return availableUserNames[i];
        }
    }
    return "not a unique username";
}

function checkIfUserAccountExists(ID){
    console.log('check' + JSON.stringify(allUsersEver) + ' ' + ID);
    let result;
    if (typeof ID === 'string' || ID instanceof String){
        console.log('id is a string');
    }
    else{
        console.log('id is not a string');
    }
    if(allUsersEver.length > 0){
        if (typeof allUsersEver[0].ID === 'string' || allUsersEver[0].ID instanceof String){
                console.log('all is a string');
        }
        else{
            console.log('all is not a string');
        }
    }
    for(let i = 0; i < allUsersEver.length; i++){
        if(allUsersEver[i].accountID === ID){
            return allUsersEver[i];
        }
    }
    return null;
}
/*
function checkIfUserNameAllowed(username, socketID){
    // we first check if username already exists
    // if so then check if its already logged in
    // if so then reject
    // else either add the new name or set the status to logged in
    //let unique = false;
    for(let i = 0; i < allUsersEver.length; i++){
        //unique = false;
        if(allUsersEver[i].username === username){
            // if so then check if its already logged in
            if(allUsersEver[i].loggedIn){
                // reject
                return {allowed: false, exists: true, online: true};
            }
            else{
                // set the status to logged in
                allUsersEver[i].loggedIn = true;
                allUsersEver[i].socketID = socketID;
                return {allowed: true, exists: true, online: false}; // we are giving this account to either the existing user, or a new user that wants this username
            }
            // this username wont due
            //i = allUsersEver.length; // end the loop
            //found = false;
        }
    }
    // if we made it here then the username does not exists
    return {allowed: true, exists: false, online: false};
}
*/
function isMessageCommandAttempt(message){
    // check if first part of message qualifies as a command
    if(message.includes('/nick')){
        return true;
    }
    else{
        return false;
    }
}

function checkIfCharacterIsHex(character){
    let validCharacters = '0123456789abcdef';
    for(let i = 0; i < validCharacters.length; i++){
        if(character === validCharacters[i]){
            return true;
        }
    }
    return false;
}

function isMessageValidCommand(message){
    // check if command is valid
    // the client is sending a command
    console.log('checking: ' + message.length);
    if(message.length > 8){
        if(message.substring(0, 7) === '/nick <' && message[message.length-1] === '>'){
            console.log('the user wishes to change their nickname ' + message);
            let subS = message.substring(7, message.length-1);
            console.log('the user wishes to change their nickname 2' + subS);
            return {valid: true, type: 'name', result: subS};
        }
        else if(message.length === 17){
            console.log('checking: ');
            if(message.substring(0, 11) === '/nickcolor '){
                console.log('the user wishes to change their nickname color');
                let subS = message.substring(11, 18);
                for(let i = 0; i < subS.length; i++){
                    console.log('checking: ' + i + ' string: ' + subS);
                    if(!checkIfCharacterIsHex(subS[i])){
                        return {valid: false, type: null, result: null};
                    }
                }
                // if we reach this point then the command is valid
                return {valid: true, type: 'color', result: subS};
            }
        }
    }
    return {valid: false, type: null, result: null};
}

function getTheColor(message){
    //ff0000'
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh ' + JSON.stringify(allUsersEver) + ' ' + JSON.stringify(message));
    //{from: getUserName(), msg: textValue, topic: activeTopic})
    let user = allUsersEver.find(x => x.accountID === message.accountID);
    //console.log('this is the user we found' + JSON.stringify(user));
    return user.color;
}

function getStatusOfNameChange(name){
    for(let i = 0; i < allUsersEver.length; i++){
        if(allUsersEver[i].username === name){
            // if so then check if its already logged in
            if(allUsersEver[i].loggedIn){
                // reject
                return {unique: false, userOnline: true, user: null};
            }
            else{
                return {unique: false, userOnline: false, user: allUsersEver[i]};
            }
        }
    }
    return {unique: true, userOnline: null, user: null}
}

function getStatusOfName(cookie){
    for(let i = 0; i < allUsersEver.length; i++){
        if(allUsersEver[i].username === cookie.name && allUsersEver[i].accountID !== cookie.accountID){
            // if so then check if its already logged in
            if(allUsersEver[i].loggedIn){
                // reject
                return {yours: false, unique: false, userOnline: true, user: null};
            }
            else{
                return {yours: false, unique: false, userOnline: false, user: allUsersEver[i]};
            }
        }
    }
    return {yours: true, unique: true, userOnline: null, user: null}
}

function getDateAsString(){
    let date = new Date();
    let year = JSON.stringify(date.getFullYear());
    let month = JSON.stringify(date.getMonth()); if(month.length === 1){month = '0' + month;}
    let day = JSON.stringify(date.getDate()); if(day.length === 1){day = '0' + day;}
    let hour = JSON.stringify(date.getHours()); if(hour.length === 1){hour = '0' + hour;}
    let minute = JSON.stringify(date.getMinutes()); if(minute.length === 1){minute = '0' + minute;}
    let second = JSON.stringify(date.getSeconds()); if(second.length === 1){second = '0' + second;}
    let dateString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateString;
}

io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    // first ask for a cookie
    socket.emit('do you have a cookie?', null);
    socket.on('yes my cookie username and ID is:', function(cookie){/////////////////////////////////////////////////////////////////////
        // fist check if account exists
        console.log('sent us his cookie and ID ' + JSON.stringify(cookie));
        console.log(JSON.stringify(allUsersEver));
        let account = checkIfUserAccountExists(cookie.accountID);
        if(account !== null){
            // we found your account
            account.loggedIn = true;
            console.log('found your account');
            // check if their username is still allowed
            let result = getStatusOfName(cookie);
            if(result.yours){
                // nothing needs to be changed
                console.log('sent active users');
                socket.emit("coookie processed, your username is available, here you go:", account.username);
                socket.emit('all messages', JSON.stringify(messages));
                io.emit('active users', JSON.stringify(allUsersEver));
            }
            else if(result.unique){
                // we can just go ahead and keep the name
                account.username = cookie.username;
                //socket.emit("your username is available, here you go:", account.username);///////////////////////////////////////////////////////
                socket.emit("coookie processed, your username is available, here you go:", account.username);
                socket.emit('all messages', JSON.stringify(messages));
                io.emit('active users', JSON.stringify(allUsersEver));
            }
            else{
                if(!result.userOnline){
                    // we can have the name but must change that users name to default
                    let toBeChanged = result.user;
                    toBeChanged.username = findAUsername();
                    // now you can have that username
                    acount.username = cookie.username;
                    socket.emit("coookie processed, your username is available, here you go:", account.username);
                    socket.emit('all messages', JSON.stringify(messages));
                    io.emit('active users', JSON.stringify(allUsersEver));
                }
                else{
                    // we cannot have that name
                    console.log('its not allowed');
                    account.username = findAUsername();
                    socket.emit("cookie processed but username is taken, here is a new random username:", account.username);
                    socket.emit('all messages', JSON.stringify(messages));
                    io.emit('active users', JSON.stringify(allUsersEver));
                }
            }
        }
        else{
            // must create a new account, even though they have a cookie, this results from the server being restarted
            let name = findAUsername();
            let id = generateUniqueID();
            allUsersEver.push({socketID: socket.id, username: name, loggedIn: true, color: defaultColor, accountID: id});
            //socket.emit("your new account is created, here you go:", {username: account.username, accountID: account.accountID});
            socket.emit("cookie processed and your id is invalid, here is a new random username and ID:", {name: name, accountID: id});/////////////////////////////////////////////////////////////////////////////////////////
            socket.emit('all messages', JSON.stringify(messages));
            io.emit('active users', JSON.stringify(allUsersEver));
            console.log('after creating the account ' + JSON.stringify(allUsersEver));
        }
    });
    socket.on('no i do not have a cookie', function(msg){
        // assign them a random username
        console.log('user does not have a cookie');
        let name = findAUsername();
        console.log(name);
        let id = generateUniqueID();
        console.log('here is an id ' + id);
        allUsersEver.push({socketID: socket.id, username: name, loggedIn: true, color: defaultColor, accountID: id});
        socket.emit("no cookie no problem, here is a new random username and ID:", {name: name, accountID: id});/////////////////////////////////////////////////////////////////////////////////////////
        socket.emit('all messages', JSON.stringify(messages));
        io.emit('active users', JSON.stringify(allUsersEver));
    });
    socket.on('chat message', function(msg){
        // first check if the message is a command
        let theMessage = msg.msg;
        if(isMessageCommandAttempt(theMessage)){
            let response = isMessageValidCommand(theMessage);
            if(response.valid){
                // execute the command
                console.log('command is valid: ' + response.type);
                if(response.type === 'name'){
                    // need to also check if name is unique
                    let user = allUsersEver.find(x => x.accountID === msg.accountID);
                    let name = response.result;
                    // we need to update list of logged in users
                    // emit back that username
                    console.log(name);
                    let result = getStatusOfNameChange(name);
                    if(result.unique){
                        // we can just go ahead and change the name
                        user.username = name;
                        //socket.emit("its available, here you go:", name);
                        socket.emit("command accepted, your username is available, here you go:", user.username);
                        io.emit('active users', JSON.stringify(allUsersEver));
                    }
                    else{
                        if(!result.userOnline){
                            let toBeChanged = result.user;
                            console.log('the username is going to be changed, the requesting user' + JSON.stringify(user) + ' the account whose losing the name' + JSON.stringify(toBeChanged));
                            toBeChanged.username = findAUsername();
                            // now you can have that username
                            user.username = name;
                            socket.emit("command accepted, your username is available, here you go:", user.username);
                            io.emit('active users', JSON.stringify(allUsersEver));
                            //socket.emit("its available, here you go:", name);
                            //io.emit('active users', JSON.stringify(allUsersEver));
                        }
                        else{
                            // we cannot have the name
                            console.log('its not allowed');
                            socket.emit("its not available", null);
                        }
                    }
                }
                else if(response.type === 'color'){
                    // we need to change the color of his username for all future texts
                    let user = allUsersEver.find(x => x.accountID === msg.accountID);
                    let color = '#' + response.result;
                    user.color = color;
                    console.log(color);
                    socket.emit('color updated', null);
                }
            }
            else{
                // indicate the command is an error
                console.log('comand is an error');
                socket.emit('comand is an error', null);
            }
            console.log(JSON.stringify(allUsersEver));
        }
        else{
            console.log('its just a message');
            // its just a message
            let color = getTheColor(msg);
            let m = {message: msg, date: getDateAsString(), color: color, accountID: msg.accountID};
            messages.push(m);
            io.emit('chat message', m); // emit to everyone
        }
    });
    socket.on('disconnect', function(){
        // update our client list
        // set user logged in to false, now his username is up for grabs
        let user = allUsersEver.find(x => x.socketID === socket.id);
        if(user !== undefined){
            user.loggedIn = false;
        }
        io.emit('active users', JSON.stringify(allUsersEver));
        console.log('user disconnected', JSON.stringify(user));
    });
})

http.listen(3001, function(){
    console.log('listening on port 3001');
})