import React, { useState, useEffect } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox'

import Avatar from '@material-ui/core/Avatar';
import {
    SloopAvatar,
    BrigAvatar,
    GalleonAvatar,
  } from './ImageAvatars'
import ImageIcon from '@material-ui/icons/Image';

const axios = require('axios');
const BE_SERVER = process.env.REACT_APP_BE_SERVER;

const SHOW_ALL_ENDPOINT = "/api/entries/";
const SHOW_MY_ENDPOINT = "/api/my_entries/";

const LOGGED_TABLE_ACTIONS = [
    {
        icon: 'edit',
        tooltip: 'Edit Log',
        onClick: () => alert("Edit"),
    },
    {
        icon: 'delete',
        tooltip: 'Delete Log',
        onClick: () => alert("Delete Log"),
    },
    {
        icon: 'report_problem',
        tooltip: 'It wasn\'t me!',
        onClick: () => alert("It wasn't me!"),
    }
]

function RemoteData(props) {
    const [state, setState] = React.useState({
        showOnlyUserEntries: true, // Set to true here by default.  Lack of token will prevent error below
    })
    
    const tableRef = React.createRef();
    const [tableActions, setTableActions] = React.useState([])

    useEffect(() => {
        tableRef.current.onQueryChange() //TODO:  Figure out why this works
        // TODO set query.page to zero ^^
        if(props.beToken != null) {
            setTableActions(LOGGED_TABLE_ACTIONS);
        } else {
            setTableActions([]);
        }
    }, [props.beToken]) // TODO: Adding tableRef like it asks causes infinate loop

    const handleSwitch = name => event => {
        // This is being clever and using one for all switches
        // Not sure if it is necessary or wise
        setState({...state, showOnlyUserEntries: event.target.checked });
        console.log("state in handleSwitch: ", state)
        tableRef.current.onQueryChange() //TODO:  Figure out why this works
    }

    function getTreasureIcon(treasure) {
        switch(treasure) {
            case 'U':
                return(<Avatar>
                        ?
                    </Avatar>)
            case 'N':
                return(<Avatar>
                        N
                    </Avatar>)
            case 'L':
                return(<Avatar>
                        L
                    </Avatar>)
            case 'H':
                return(<Avatar>
                        H
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
                return(<Avatar>
                        ?
                    </Avatar>)
            case 'N':
                return(<Avatar>
                        N
                    </Avatar>)
            case 'L':
                return(<Avatar>
                        L
                    </Avatar>)
            case 'H':
                return(<Avatar>
                        H
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
                        label="Show My Logs"
                    />
                </FormGroup>
        </div>
    ):
    (
       <div></div> // Override toolbar with empty div
    )

    return (
    <div>
        <MaterialTable
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
                title: 'Enemy Ship',
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
                title: 'Crew', 
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
            actions={tableActions}
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