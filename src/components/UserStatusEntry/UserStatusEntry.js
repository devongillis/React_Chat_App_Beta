import React, { ReactComponent } from 'react';
import ButtonImageRed from '../../images/red.png';
import ButtonImageGreen from '../../images/green.png';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    UserStatusEntry_outerBox: {
        color: 'blue',
        width: '100%',
        height: '20px',
        //border: '1px solid green',
    },
    UserStatusEntry_image_div: {
        width: '20px',
        height: '20px',
        //border: '1px solid green',
        float: 'left',
        top: '5px',
    },
    UserStatusEntry_image: {
        width: '100%',
        //border: '1px solid green',
    },
    UserStatusEntry_text_div: {
        //width: '10%',
        height: '20px',
        //border: '1px solid green',
        float: 'left',
        margin: '0',
    },
    UserStatusEntry_text: {
        //width: '10%',
        height: '20px',
        //border: '1px solid green',
        float: 'left',
        margin: '0',
    }
}));

export default function UserStatusEntry(props){
    const classes = useStyles();
    
    let b = ButtonImageRed;
    if(props.status.loggedIn){
        b = ButtonImageGreen;
    }
    return (
        <div>
            <div className={classes.UserStatusEntry_outerBox}>
                <div className={classes.UserStatusEntry_image_div}>
                    <img src={b} className={classes.UserStatusEntry_image}></img>
                </div>
                <div className={classes.UserStatusEntry_text_div}>
                    <p className={classes.UserStatusEntry_text}>{props.status.username + props.status.accountID}</p>
                </div>
            </div>
        </div>
    )

    
}
