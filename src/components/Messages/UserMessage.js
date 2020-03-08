import React, { ReactComponent } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
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
    chip: {
        color: colorProps => colorProps.color,
    }
}));

export default function UserStatusEntry(props){

    const colorProps = {color: props.chat.color};

    const classes = useStyles(colorProps);
    if(props.isUser){
        return(
            <div className={classes.chatMessageMe}>
                <Chip label={props.chat.from + '' + props.chat.accountID} className={`${classes.chip}`} />
                <Typography variant='body1' gutterBottom>{props.chat.msg}</Typography>
                <Typography variant='body1' gutterBottom>{props.chat.date}</Typography>
            </div>
        )
    }
    else{
        return(
            <div className={classes.chatMessage}>
                <Chip label={props.chat.from + '' + props.chat.accountID} className={classes.chip} />
                <Typography variant='body1' gutterBottom>{props.chat.msg}</Typography>
                <Typography variant='body1' gutterBottom>{props.chat.date}</Typography>
            </div>
        )
    }
    
}
