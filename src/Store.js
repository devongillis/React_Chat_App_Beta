import React from 'react'
import io from 'socket.io-client'

export const CTX = React.createContext();
let removeCookie = false;
let initState = {
    general: [],
    topic2: []
}

let usersState = {
    states: []
};

let username_state = {
    name1:[
        {name2: 'devon'},
    ],
    accountID1:[
        {accountID2: ''},
    ]
}

//let accountID = '';

function userName_reducer(state, action){
    const {name2, name1, accountID2, accountID1} = action.payload;
    switch(action.type){
        case 'CHANGE_USERNAME':
            //alert('hello' + newName);
            return {
                [name1]: [
                    {name2,}
                ],
                [accountID1]: [
                    {accountID2,}
                ],
            }
        default:
            return state
    }
}

//{msg: msg, date: dateString}
function reducer(state, action){
    //const {from, msg, topic, date} = action.payload;
    //{message: msg, date: dateString};
    const {message, date, color, accountID} = action.payload;
    const {from, msg, topic} = message;
    switch(action.type){
        case 'RECEIVE_MESSAGE':
            return {
                ...state, // bring in the old state
                [topic]: [ // select the array we want to override by its key
                    ...state[topic], // fill it in with the previous messages from that array (so we don't lose them)
                    {from, msg, date, color, accountID} // add the new message
                ]
            }
        case 'REMOVE_MESSAGES':
            return {
                ...state, // bring in the old state
                [topic]: []
            }
        default:
            return state
    }
}
//{username: user.username, loggedIn: user.loggedIn, states: 'states'}});
function userState_reducer(state, action){
    const {username, loggedIn, states, accountID} = action.payload;
    switch(action.type){
        case 'RECEIVE_STATUS':
            return {
                ...state, // bring in the old state of the entire thing
                [states]: [ // select the array we want to override by its key
                    ...state[states], // fill it in with the previous messages from that array (so we don't lose them)
                    {username, loggedIn, accountID} // add the new status
                ]
            }
        case 'REMOVE_STATUSES':
            console.log(states);
            return {
                [states]: []
            }
        default:
            return state
    }
}

let username = 'devon';
let accountID = '';
function getUserName(){
    return username;
}

function getAllChats(){
    return initState;
}

let socket;

function sendChatAction(value){
    //sendChatAction({from: getUserName(), msg: textValue, topic: activeTopic});
    //{from: getUserName(), msg: textValue, topic: activeTopic, accountID: number}
    socket.emit('chat message', value);//////////////////////////////////////////////// include accountid
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//const {allChats, sendChatAction, user, allUsers}
export default function Store(props){

    const [allChats, dispatch] = React.useReducer(reducer, initState);
    const [userStats, new_dispatch] = React.useReducer(userState_reducer, usersState);
    const [userName, newer_dispatch] = React.useReducer(userName_reducer, username_state);

    if(!socket){
        socket = io(':3001');
        if(removeCookie){
            document.cookie = 'username=' + "" + '; expires=' + new Date(2000, 3, 1).toUTCString();
            document.cookie = 'accountID=' + "" + '; expires=' + new Date(2000, 3, 1).toUTCString();
        }
        socket.on('do you have a cookie?', function(msg){
            // check if we have a cookie, if so send cookie, if not send null
            console.log("asked for cookie");
            let value = readCookie('username');
            accountID = readCookie('accountID');
            //accountID = accountID.toString();
            if(value !== null && accountID !== null && !removeCookie){ // we have a cookie
                console.log("asked for cookie, yes " + value + " " + accountID);
                socket.emit('yes my cookie username and ID is:', {username: value, accountID: accountID}); //socket.on('yes my cookie username and ID is:
            }
            else{
                console.log("asked for cookie, no");
                socket.emit('no i do not have a cookie', null);
            }
        });
        socket.on("coookie processed, your username is available, here you go:", function(msg){
            // we receive this after sending a cookie that is not taken
            document.cookie = 'username=' + msg + '; expires=' + new Date(2020, 3, 1).toUTCString();
            username = msg;
            //accountID = readCookie('accountID');
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: msg, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        });
        socket.on("command accepted, your username is available, here you go:", function(msg){
            // we receive this after sending a cookie that is not taken
            document.cookie = 'username=' + msg + '; expires=' + new Date(2020, 3, 1).toUTCString();
            username = msg;
            //accountID = readCookie('accountID');
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: msg, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        });
        /*
        socket.on("your username is available, here you go:", function(msg){
            // we receive this after sending a cookie that is not taken
            document.cookie = 'username=' + msg + '; expires=' + new Date(2020, 3, 1).toUTCString();
            username = msg;
            //accountID = readCookie('accountID');
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: msg, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        });
        */
        socket.on("its not available", function(msg){
            alert('username is not available');
        });
        socket.on("cookie processed but username is taken, here is a new random username:", function(name){
            username = name;
            //let accountID = readCookie('accountID');
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: name, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        
            if(!removeCookie){
                document.cookie = 'username=' + name + '; expires=' + new Date(2020, 3, 1).toUTCString();
            }
        });
        /*
        socket.on("sorry its taken, here is a new random username:", function(name){
            username = name;
            //let accountID = readCookie('accountID');
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: name, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        
            if(!removeCookie){
                document.cookie = 'username=' + name + '; expires=' + new Date(2020, 3, 1).toUTCString();
            }
        });
        */
        socket.on("cookie processed and your id is invalid, here is a new random username and ID:", function(msg){
            // we receive this if we did not have a cookie to send
            console.log('i received a username: ' + msg.name);
            console.log('i received a id: ' + msg.accountID);
            username = msg.name;
            accountID = msg.accountID;
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: msg.name, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        
            if(!removeCookie){
                document.cookie = 'username=' + msg.name + '; expires=' + new Date(2020, 3, 1).toUTCString();
                document.cookie = 'accountID=' + msg.accountID + '; expires=' + new Date(2020, 3, 1).toUTCString();
            }
        });
        socket.on("no cookie no problem, here is a new random username and ID:", function(msg){
            // we receive this if we did not have a cookie to send
            console.log('i received a username: ' + msg.name);
            console.log('i received a id: ' + msg.accountID);
            username = msg.name;
            accountID = msg.accountID;
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: msg.name, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        
            if(!removeCookie){
                document.cookie = 'username=' + msg.name + '; expires=' + new Date(2020, 3, 1).toUTCString();
                document.cookie = 'accountID=' + msg.accountID + '; expires=' + new Date(2020, 3, 1).toUTCString();
            }
        });
        /*
        socket.on("here is a new random username and ID:", function(msg){
            // we receive this if we did not have a cookie to send
            console.log('i received a username: ' + msg.name);
            console.log('i received a id: ' + msg.accountID);
            username = msg.name;
            accountID = msg.accountID;
            newer_dispatch({type: 'CHANGE_USERNAME', payload: {name2: msg.name, name1: 'name1', accountID2: accountID, accountID1: 'accountID1'}});
        
            if(!removeCookie){
                document.cookie = 'username=' + msg.name + '; expires=' + new Date(2020, 3, 1).toUTCString();
                document.cookie = 'accountID=' + msg.accountID + '; expires=' + new Date(2020, 3, 1).toUTCString();
            }
        });
        */
        socket.on('comand is an error', function(msg){
            alert('comand is an error, command formats are:\n' +
            '/nick <"your new user name">\n' +
            '/nickcolor "your six digit hexidecimal color"');
        });
        socket.on('chat message', function(msg){
            //dispatch({type: 'REMOVE_MESSAGES', payload: msg});
            dispatch({type: 'RECEIVE_MESSAGE', payload: msg});
        });
        socket.on('all messages', function(messagesJSON){
            console.log('i received an object', messagesJSON);
            initState = {general: [], topic2: []}
            let messages = JSON.parse(messagesJSON);
            for(let i = 0; i < messages.length; i++){
                let msg = messages[i];
                dispatch({type: 'RECEIVE_MESSAGE', payload: msg});
            }
        });
        socket.on('active users', function(usersJSON){
            // refresh the list
            console.log('active users: ' + usersJSON);
            let users = JSON.parse(usersJSON);
            new_dispatch({type: 'REMOVE_STATUSES', payload: {username: null, loggedIn: null, states: 'states'}});
            for(let i = 0; i < users.length; i++){
                let user = users[i];
                //const {name, active, states} = action.payload;
                new_dispatch({type: 'RECEIVE_STATUS', payload: {username: user.username, loggedIn: user.loggedIn, states: 'states', accountID: user.accountID}});
            }
        });
    }

    return (
        <CTX.Provider value={{allChats, sendChatAction, getUserName, userStats, getAllChats, userName}}>
            {props.children}
        </CTX.Provider>
    )
}