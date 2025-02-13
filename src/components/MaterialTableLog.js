import React, { useState, useEffect } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles';

import ConfirmationRemoveMeAlert from './ConfirmationRemoveMeAlert'
import ConfirmationDeleteLogAlert from './ConfirmationDeleteLogAlert'


import Avatar from '@material-ui/core/Avatar';
import {
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
  } from './ImageAvatars'
import ImageIcon from '@material-ui/icons/Image';

const axios = require('axios');
const BE_SERVER = process.env.REACT_APP_BE_SERVER;

const SHOW_ALL_ENDPOINT = "/api/entries/";
const SHOW_MY_ENDPOINT = "/api/my_entries/";

const useStyles = makeStyles({
    avatar: {
      backgroundColor: '#b4e3f6'
    },
  });

function RemoteData(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        showOnlyUserEntries: true, // Set to true here by default.  Lack of token will prevent error below
    })

    const [removeMeRowID, setRemoveMeRowID] = React.useState(null);
    const [deleteLogRowID, setDeleteLogRowID] = React.useState(null);

    const [updateTrigger, setUpdateTrigger] = React.useState(true)
    
    const tableRef = React.createRef();


    useEffect(() => {
        // Reset table
        tableRef.current.onQueryChange() //TODO:  Figure out why this works
        // TODO set query.page to zero ^^
        
    }) // TODO: Adding tableRef like it asks causes infinate loop

    const handleSwitch = name => event => {
        // This is being clever and using one for all switches
        // Not sure if it is necessary or wise
        setState({...state, showOnlyUserEntries: event.target.checked });
        tableRef.current.onQueryChange() //TODO:  Figure out why this works
    }

    function getTreasureIcon(treasure) {
        switch(treasure) {
            case 'U':
                return(<Avatar className={classes.avatar}>
                        ?
                    </Avatar>)
            case 'N':
                return(<Avatar className={classes.avatar}>
                        -
                    </Avatar>)
            case 'L':
                return(<Avatar>
                        <LowTreasureAvatar />
                    </Avatar>)
            case 'H':
                return(<Avatar>
                        <HighTreasureAvatar />
                    </Avatar>)
            default:
                return(<Avatar>
                        ?
                    </Avatar>)
        }
    }

    function getTearsIcon(tears) {
        switch(tears) {
            case 'U':
                return(<Avatar className={classes.avatar}>
                        ?
                    </Avatar>)
            case 'N':
                return(<Avatar className={classes.avatar}>
                        -
                    </Avatar>)
            case 'L':
                return(<Avatar>
                        <LowTearsAvatar />
                    </Avatar>)
            case 'H':
                return(<Avatar>
                        <HighTearsAvatar />
                    </Avatar>)
            default:
                return(<Avatar>
                        ?
                    </Avatar>)
        }
    }

    function getShipIcon(shipType) {
        switch(shipType) {
            case 'U':
                return(<Avatar>
                        <ImageIcon />
                    </Avatar>)
            case 'S':
                return(<Avatar>
                        <SloopAvatar />
                    </Avatar>)
            case 'B':
                return(<Avatar>
                        <BrigAvatar />
                    </Avatar>)
            case 'G':
                return(<Avatar>
                        <GalleonAvatar />
                    </Avatar>)
            case 'K':
                return(<Avatar>
                        <KarenAvatar />
                    </Avatar>)
            case 'M':
                return(<Avatar>
                        <MegAvatar />
                    </Avatar>)
            case 'SK':
                return(<Avatar>
                        <SkelleonAvatar />
                    </Avatar>)
            case 'F':
                return(<Avatar>
                        <FortAvatar />
                    </Avatar>)
            case 'SC':
                return(<Avatar>
                        <ShipCloudAvatar />
                    </Avatar>)
            default:
                return(<Avatar>
                        <ImageIcon />
                    </Avatar>)
        }
    }
    const tableHeader = props.beToken != null ? 
    (
        <div style={ {padding: '10px 10px'} }>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={ state.showOnlyUserEntries }
                                onChange={ handleSwitch('showOnlyUserEntries') }
                                value="showOnlyUserEntries"
                                inputProps={{ 'aria-label': 'primary checkbox'} }
                            />
                        }
                        label="Show Only My Logs"
                    />
                </FormGroup>
        </div>
    ):
    (
       <div></div> // Override toolbar with empty div
    )

    function updateTable() {
        // Tickle state to trigger redraw
        setUpdateTrigger(!updateTrigger)
    }

    function deleteEntry(id) {
        handleCloseDeleteLogConfirmation();
        let config = {
            headers: {
                'Authorization': 'Token  ' + props.beToken
            }
          }
        //   let body = { pk: id };
          axios.delete(BE_SERVER + "/api/my_entries/" + id, config) 
                  .then((response) => {
                    updateTable()
                  })
                  .catch((error) => {
                      console.log(error);
                  })
    }

    function removeMeFromEntry(id) {
        handleCloseRemoveMeConfirmation();
        let config = {
            headers: {
                'Authorization': 'Token  ' + props.beToken
            }
          }
          let body = { id: id };
          axios.post(BE_SERVER + "/remove_me/", body, config) 
                  .then((response) => {
                    updateTable()
                  })
                  .catch((error) => {
                      console.log(error);
                  })
    }

    function handleCloseDeleteLogConfirmation() {
        setDeleteLogRowID(null);
    }

    function handleDeleteLogConfirmation(rowID) {
        setDeleteLogRowID(rowID)
    }

    function handleCloseRemoveMeConfirmation() {
        setRemoveMeRowID(null);
    }

    function handleRemoveMeConfirmation(rowID) {
        setRemoveMeRowID(rowID);
    }

    function getTableRef() {
        return tableRef
    }

    return (
    <div>
        <ConfirmationRemoveMeAlert
            rowID={removeMeRowID}
            handleClose={handleCloseRemoveMeConfirmation}
            removeMeFromEntry={removeMeFromEntry}
        />
        <ConfirmationDeleteLogAlert
            rowID={deleteLogRowID}
            handleClose={handleCloseDeleteLogConfirmation}
            deleteEntry={deleteEntry}
        />
        <MaterialTable style={ {padding: '10px 10px'} }
            title={'All Logs'}
            tableRef={tableRef}
            columns={[
            {
                title: 'Date',
                field: 'encounterTime',
                render: rowData => ( // Date and time from timestamp
                    <div>
                        <div>
                            {rowData.encounterTime.slice(5, 10)}
                        </div>
                        <div>
                            {rowData.encounterTime.slice(11, 16)}
                        </div>
                    </div>
                ),
            },
            {
                title: 'Encounter',
                field: 'avatar',
                render: rowData => (
                            getShipIcon(rowData.enemyShip)
                ),
            },
            {
                title: 'Treasure',
                field: 'avatar',
                render: rowData => (
                            getTreasureIcon(rowData.treasure)
                ),
            },
            {
                title: 'Tears',
                field: 'avatar',
                render: rowData => (
                            getTearsIcon(rowData.tears)
                ),
            },
            { 
                title: 'Location', 
                field: 'island',
                render: rowData => (
                    <div>
                        { rowData.island }
                    </div>
                    ),
            },
            { 
                title: 'Known Crew', 
                field: 'crew',
                render: rowData => (
                    <div>
                        { rowData.crew.map(crewMember => (
                            <div>{ crewMember }</div>
                        ))}
                    </div>
                ),
            },
            {
                title: 'Ship',
                field: 'avatar',
                render: rowData => (
                    getShipIcon(rowData.myShip)
                ),
            },
            {
                title: 'Loss',
                field: 'loss',
                render: rowData => (
                    <Checkbox
                        checked={rowData.loss}
                        value="rowData_loss"
                        disabled
                    />
                ),
            },
        ]}
        data={ query => 
            new Promise((resolve, reject) => {
                let url = BE_SERVER + SHOW_ALL_ENDPOINT;
                let config = {}
                if(state.showOnlyUserEntries && props.beToken != null) {
                    url = BE_SERVER + SHOW_MY_ENDPOINT;
                    config = {
                        headers: {
                            'Authorization': 'Token  ' + props.beToken
                        }
                    }
                }
                url += '?limit=' + query.pageSize;
                url += '&offset=' + (query.page * query.pageSize);
                axios.get(url, config)
                .then(result => {
                    resolve({
                        data: result.data.results,
                        page: query.page,
                        totalCount: result.data.count,
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
            })}
            components={{//TODO: Inline style
                Toolbar: props => ( tableHeader )
            }}
            actions={ props.userProfile == null ? [] :
                [
                rowData => ({
                    icon: 'edit',
                    tooltip: 'Edit Log',
                    onClick: () => props.handleEditLog(rowData),
                    disabled: rowData.added_by !== props.userProfile.gamertag
                }),
                rowData => ({
                    icon: 'delete',
                    tooltip: 'Delete Log',
                    onClick: () => {handleDeleteLogConfirmation(rowData.id)},
                    disabled: rowData.added_by !== props.userProfile.gamertag
                }),
                rowData => ({
                    icon: 'report_problem',
                    tooltip: 'It wasn\'t me!',
                    onClick: () => {handleRemoveMeConfirmation(rowData.id)},                      // TODO: Doesn't work with ===.  Why?
                    disabled: (rowData.crew.filter(e => e === props.userProfile.gamertag) != props.userProfile.gamertag 
                                || rowData.added_by === props.userProfile.gamertag)
                })
            ]} // TODO: Possibly mixing styles
            options={{
                rowStyle: rowData => ({
                    backgroundColor: (rowData.loss ? '#FFDDDD' : '#FFF')
                }),
                actionsColumnIndex: -1
            }}
        />
    </div>
)}

export default RemoteData;