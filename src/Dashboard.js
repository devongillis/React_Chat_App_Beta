import React from 'react'
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ScrollToBottom from 'react-scroll-to-bottom';

import {CTX} from './Store';
import ButtonImageRed from './images/red.png';
import ButtonImageGreen from './images/green.png';
import UserStatusEntry from './components/UserStatusEntry/UserStatusEntry';
import UserMessage from './components/Messages/UserMessage';



const useStyles = makeStyles(theme => ({
    root: {
        margin: '50px',
        padding: theme.spacing(3, 2),
        border: '1px solid blue',
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid red',
    },
    topicsWindow: {
        width: '20%',
        height: '300px',
        border: '1px solid green',
    },
    usersWindow: {
        width: '20%',
        height: '300px',
        border: '1px solid orange',
    },
    chatWindow: {
        width: '60%',
        height: '300px',
        border: '1px solid cyan',
        background_color: 'transparent',
    },
    chatMessage:{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid purple',
        margin: '10px',
    },
    chatMessageMe:{
        display: 'flex',
        alignItems: 'center',
        border: '2px solid black',
        margin: '10px',
    },
    chatBox: {
        width: '100%',
        border: '1px solid pink',
    },
    button: {
        width: '15%',
        border: '1px solid yellow',
    },
    block: {
        height: '90%',
    }
}));

export default function Dashboard() {

    const classes = useStyles();

    // CTX store
    const {allChats, sendChatAction, getUserName, userStats, getAllChats, userName} = React.useContext(CTX); // all chats now refers to the state of Store.js

    //console.log({allChats});

    const topics = Object.keys(allChats);

    // local state
    const [activeTopic, changeActiveTopic] = React.useState(topics[0]); // default to the first topic in the Store
    const [textValue, changeTextValue] = React.useState('');
    //const [name, changeName] = React.useState('devon');

    return (
        <div>
            <Paper className={classes.root}>
                <Typography variant="h4" component="h3">
                    Chap App
                </Typography>
                <Typography variant="h5" component="h5">
                    {activeTopic}
                </Typography>
                <Typography variant="h5" component="h5">
                    {userName.name1[0].name2}
                </Typography>
                <div className={classes.flex}>
                    <ScrollToBottom className={classes.topicsWindow}>
                        {
                            topics.map(topic => (
                                <ListItem onClick={event => changeActiveTopic(event.target.innerText)} key={topic} button>
                                    <ListItemText primary ={topic} />
                                </ListItem>
                            ))
                        }
                    </ScrollToBottom>
                    <ScrollToBottom className={classes.chatWindow}>
                        <div className={classes.block}>

                        </div>
                        {
                            allChats[activeTopic].map((chat, i) => {
                                //let color = 'color: ' + chat.color;
                                if(i === 0){
                                    //alert(userName.accountID1[0].accountID2);
                                }
                                if(chat.accountID === userName.accountID1[0].accountID2){
                                    return (
                                        <UserMessage className={classes.chatMessageMe} key={i} chat={chat} isUser={true}/>
                                    )
                                }
                                else{
                                    return (
                                        <UserMessage className={classes.chatMessage} key={i} chat={chat} isUser={false}/>
                                    )
                                }
                            })
                        }
                    </ScrollToBottom>
                    <ScrollToBottom className={classes.usersWindow}>
                        {
                            userStats['states'].map(status => {
                                return (
                                    <UserStatusEntry class={classes.test} status={status} />
                                )
                            })
                        }
                    </ScrollToBottom>
                </div>
                <div className={classes.flex}>
                    <TextField
                        label="Send a chat"
                        className={classes.chatBox}
                        value={textValue}
                        onChange={event => changeTextValue(event.target.value)} // when text is typed into it triggers an onchange which will send the event to our function to update the text
                    />
                    <Button 
                    variant="contained" 
                    color="primary"
                    className={classes.button}
                    onClick={()=> {
                        sendChatAction({from: userName.name1[0].name2, msg: textValue, topic: activeTopic, accountID: userName.accountID1[0].accountID2});
                        changeTextValue('');
                    }}
                    >
                        Send
                    </Button>
                </div>
            </Paper>
        </div>
    )
}