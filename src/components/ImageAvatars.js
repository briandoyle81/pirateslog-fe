import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import sloopSvg from '../static/images/sloop.svg'
import brigSvg from '../static/images/brig.svg'
import galleonSvg from '../static/images/galleon.svg'

const useStyles = makeStyles({
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
});

function SloopAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Sloop" src={sloopSvg} className={classes.avatar} />
    </Grid>
  );
}

function BrigAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Brig" src={brigSvg} className={classes.avatar} />
    </Grid>
  );
}

function GalleonAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Sloop" src={galleonSvg} className={classes.avatar} />
    </Grid>
  );
}

export  {
  SloopAvatar,
  BrigAvatar,
  GalleonAvatar,
}