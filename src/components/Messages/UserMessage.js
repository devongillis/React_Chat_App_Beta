import React, { ReactComponent } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
    chatMessage:{
        float: 'left',
        width: '80%',
        alignItems: 'center',
        border: '2px solid #00aabb',
        margin: '10px',
        border_radius: '.0em',
        background: '#00aabb',
    },
    chatMessageMe:{
        float: 'right',
        width: '80%',
        alignItems: 'center',
        border: '2px solid black',
        margin: '10px',
        border_radius: '.0em',
        background: '#00aabb',
    },
    chip: {
        color: colorProps => colorProps.color,
        float: 'left',
    },
    message: {
        //float: 'left',
        textAlign: 'left',
    },
    date: {
        //float: 'left',
        marginTop: '8px',
        textAlign: 'left',
    },
}));

export default function UserStatusEntry(props){

    const colorProps = {color: props.chat.color};

    const classes = useStyles(colorProps);
    let cl = classes.chatMessage;
    if(props.isUser){
        cl = classes.chatMessageMe;
    }

    return(
        <div className={cl}>
            <Chip label={props.chat.from} className={classes.chip} />
            <Typography variant='body1' gutterBottom className={classes.message}>{props.chat.msg}</Typography>
            <Typography variant='body1' gutterBottom className={classes.date}>{props.chat.date}</Typography>
        </div>
    )
}
