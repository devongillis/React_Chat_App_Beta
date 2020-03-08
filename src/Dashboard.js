import React from 'react'
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ScrollToBottom from 'react-scroll-to-bottom';

import {CTX} from './Store';
import UserStatusEntry from './components/UserStatusEntry/UserStatusEntry';
import UserMessage from './components/Messages/UserMessage';



const useStyles = makeStyles(theme => ({
    root: {
        margin: '50px',
        padding: theme.spacing(3, 2),
        //border: '1px solid #ffaaaa',
        background: '#aaaaff',
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        //border: '1px solid red',
    },
    topicsWindow: {
        width: '20%',
        height: '300px',
        //border: '1px solid #8888ff',
        background: '#57ffdd',
    },
    usersWindow: {
        width: '20%',
        height: '300px',
        //border: '1px solid orange',
        background: '#a6fffb',
    },
    chatWindow: {
        width: '60%',
        height: '300px',
        //border: '1px solid lightBlue',
        background: 'lightBlue',
    },
    chatBox: {
        width: '100%',
        //border: '1px solid pink',
        background: '#ffffff',
    },
    button: {
        width: '15%',
        //border: '1px solid yellow',
    },
    block: {
        height: '90%',
    }
}));

export default function Dashboard() {

    const classes = useStyles();

    // CTX store
    const {allChats, sendChatAction, getUserName, userStats, getAllChats, userName} = React.useContext(CTX); // all chats now refers to the state of Store.js

    const topics = Object.keys(allChats);

    // local state
    const [activeTopic, changeActiveTopic] = React.useState(topics[0]); // default to the first topic in the Store
    const [textValue, changeTextValue] = React.useState('');

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
                        <div className={classes.block}></div>
                        {
                            allChats[activeTopic].map((chat, i) => {
                                let isUser = false;
                                if(chat.accountID === userName.accountID1[0].accountID2){
                                    isUser = true;
                                }
                                return (
                                    <UserMessage key={i} chat={chat} isUser={isUser}/>
                                )
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