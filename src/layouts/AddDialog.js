import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 260,
    minWidth: 400,
    overflow: 'hidden'
  },
  main: {
    padding: 16
  },
  groupTitle: {
    fontSize: 12,
    backgroundColor: '#F0F0F0',
    padding: 8,
    paddingLeft: 16,
    marginTop: 0,
    marginBottom: 0,
    textTransform: 'uppercase'
  },
  icon: {
    display: 'block !important',
    marginLeft: 'auto !important',
    marginRight: 'auto !important'
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
    add: {
        padding: 12,
        '&:hover': {
            background: '#D3D3D3'
        },
        width: 100,
        borderRadius: 4,
        cursor: 'pointer'
    },
    linkTitle: {
        marginTop: 4,
        textAlign: 'center',
        fontSize: 12
    }
}));

const groups = [
    {
        title: 'Record',
        links: [
            {
                id: 'account',
                title: 'Account',
                icon: 'account_circle'
            },
            {
                id: 'subscription',
                title: 'Subscription',
                icon: 'autorenew'
            },
            {
                id: 'invoice',
                title: 'Invoice',
                icon: 'receipt'
            }
        ]
    },
    {
        title: 'Configuration',
        links: [
            {
                id: 'plan',
                title: 'Plan',
                icon: 'local_offer'
            }
        ]
    }
]

function AddDialog(props) {
    const classes = useStyles();
    const { onClose, open, anchor } = props;

    return (
        <Popover
            open={ open }
            anchorEl={ anchor }
            onClose={ onClose }
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}>
            <div className={ classes.root }>
                {
                    groups.map((group, index) => (
                        <div>
                            <h6 className={ classes.groupTitle }>{ group.title }</h6>
                            <Grid  className={ classes.main } container={ true } spacing={ 0 }>
                            {
                                group.links.map((link, index) => (
                                    <Grid item={ true }>
                                        <div className={ classes.add } onClick={ () => onClose(link.id) }>
                                            <Icon className={ classes.icon }>{ link.icon }</Icon>
                                            <Typography className={ classes.linkTitle }>{ link.title }</Typography>
                                        </div>
                                    </Grid>
                                ))
                            }
                            </Grid>
                        </div>))
                }
            </div>
      </Popover>
    );
}

AddDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired
};

export default AddDialog;