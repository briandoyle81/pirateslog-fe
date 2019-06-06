import React, { useState } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';
import SloopAvatar from './ImageAvatars'
import ImageIcon from '@material-ui/icons/Image';

const axios = require('axios');
const DEBUG_TOKEN = process.env.REACT_APP_DEBUG_TOKEN;
const BE_SERVER = process.env.REACT_APP_BE_SERVER;

const SHOW_ALL_ENDPOINT = "/api/entries/";
const SHOW_MY_ENDPOINT = "/api/my_entries/";

function RemoteData(props) {
    // const [isAuthenticated, setIsAuthenticated] = useState(props.data.isAuthenticated);
    // const [googleUser, setGoogleUser] = useState(props.data.googleUser);
    // const [googleToken, setGoogleToken] = useState(props.data.googleUser);
    // const [beToken, setBeToken] = useState(props.data.beToken);
    const [state, setState] = React.useState({
        beToken: props.data.beToken,
        showOnlyUserEntries: false,
        getEndpoint: SHOW_ALL_ENDPOINT,
        label: "Show All Log Entries",
    })

    const handleSwitch = name => event => {
        // This is being clever and using one for all switches
        // Not sure if it is necessary
        setState({...state, [name]: event.target.checked });
        if(name === 'showOnlyUserEntries') {
            console.log('changed showOnlyUserEntries', state.showOnlyUserEntries);
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
                        <ImageIcon />
                    </Avatar>)
            case 'G':
                return(<Avatar>
                        <ImageIcon />
                    </Avatar>)
            default:
                return(<Avatar>
                        <ImageIcon />
                    </Avatar>)
        }
    }
        const tableHeader = state.beToken != null ? 
        (
            {//TODO: Inline style
                Toolbar: props => (
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
                                    label="Show All Logs"
                                />
                            </FormGroup>
                    </div>
                )
            }
        ):
        (
            { Toolbar: props => ( <div></div> ) } // Override toolbar with empty div
        )

        return (
        <MaterialTable
            title="Pirate's Log"
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
                title: 'Victim',
                field: 'avatar',
                render: rowData => (
                            getShipIcon(rowData.enemyShip)
                ),
            },
            {
                title: 'Treasure',
                field: 'avatar',
                render: rowData => (
                    <Avatar>
                        <ImageIcon />
                    </Avatar>
                ),
            },
            {
                title: 'Tears',
                field: 'avatar',
                render: rowData => (
                    <Avatar>
                        <ImageIcon />
                    </Avatar>
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
        ]}
        data={query => //TODO: Deal with pagination AND cache this
            new Promise((resolve, reject) => {
                console.log("loading entry list")
                let url = BE_SERVER + SHOW_ALL_ENDPOINT;
                url += '?limit=' + query.pageSize;
                url += '&offset=' + (query.page + 1);
                let config = ''
                if(state.beToken !== null && state.showOnlyUserEntries === true) {
                    url = BE_SERVER + SHOW_ALL_ENDPOINT;
                    config = {
                        headers: {
                        'Authorization': 'Token  ' + state.beToken
                        }
                    }
                    console.log(config)
                }
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
            })
        }
        components={ tableHeader }
        />
    )
  }

export default RemoteData;