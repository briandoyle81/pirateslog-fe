import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import sloopSvg from '../static/images/sloop.svg'
import brigSvg from '../static/images/brig.svg'
import galleonSvg from '../static/images/galleon.svg'
import cloudShipSvg from '../static/images/cloud_ship.svg'
import fort from '../static/images/fort.svg'
import highTears from '../static/images/high_tears.svg'
import highTreasure from '../static/images/high_treasure.svg'
import karen from '../static/images/karen.svg'
import lowTears from '../static/images/low_tears.svg'
import lowTreasure from '../static/images/low_treasure.svg'
import medTears from '../static/images/med_tears.svg'
import medTreasure from '../static/images/med_treasure.svg'
import meg from '../static/images/meg.svg'
import skelleon from '../static/images/skelleon.svg'
import { withStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  avatar: {
    margin: 10,
    backgroundColor: '#fff'
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
    backgroundColor: '#fff'
  },
});

// TODO: Exporting this causes errors
// function NoneAvatar() {
//   const classes = useStyles();

//   return (
//     <Grid container justify="center" alignItems="center">
//       <Avatar alt="None" className={classes.avatar}>-</Avatar>
//     </Grid>
//   );
// }

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
      <Avatar alt="Galleon" src={galleonSvg} className={classes.avatar} />
    </Grid>
  );
}

function HighTearsAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="High Tears" src={highTears} className={classes.avatar} />
    </Grid>
  );
}

function HighTreasureAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="High Treasure" src={highTreasure} className={classes.avatar} />
    </Grid>
  );
}

function KarenAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Karen" src={karen} className={classes.avatar} />
    </Grid>
  );
}

function LowTearsAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Low Tears" src={lowTears} className={classes.avatar} />
    </Grid>
  );
}

function LowTreasureAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Low Treasure" src={lowTreasure} className={classes.avatar} />
    </Grid>
  );
}

function MedTearsAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Medium Tears" src={medTears} className={classes.avatar} />
    </Grid>
  );
}

function MedTreasureAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Medium Treasure" src={medTreasure} className={classes.avatar} />
    </Grid>
  );
}

function MegAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Meg" src={meg} className={classes.avatar} />
    </Grid>
  );
}

function SkelleonAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Skelleon" src={skelleon} className={classes.avatar} />
    </Grid>
  );
}

function FortAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Fort" src={fort} className={classes.avatar} />
    </Grid>
  );
}

function ShipCloudAvatar() {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Avatar alt="Ship Cloud" src={cloudShipSvg} className={classes.avatar} />
    </Grid>
  );
}

// const StyledNoneAvatar = withStyles(useStyles)(NoneAvatar)

export {
  // StyledNoneAvatar,
  SloopAvatar,
  BrigAvatar,
  GalleonAvatar,
  HighTearsAvatar,
  HighTreasureAvatar,
  KarenAvatar,
  LowTearsAvatar,
  LowTreasureAvatar,
  MedTearsAvatar,
  MedTreasureAvatar,
  MegAvatar,
  SkelleonAvatar,
  FortAvatar,
  ShipCloudAvatar,
}
