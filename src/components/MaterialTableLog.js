import React, { useState, useEffect } from 'react';
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
        showOnlyUserEntries: true, // Set to true here by default.  Lack of token will prevent error below
    })
    
    const tableRef = React.createRef();

    useEffect(() => {
        // console.log("using effect, props are: ", props);
        tableRef.current.onQueryChange() //TODO:  Figure out why this works
        // console.log("tableref is", tableRef.current)
        // let tablestate = tableRef.current.state;
        // tablestate.query.page = 0;
        // tableRef.current.setState
        
        // TODO set query.page to zero ^^
    })

    const handleSwitch = name => event => {
        // This is being clever and using one for all switches
        // Not sure if it is necessary or wise
        setState({...state, showOnlyUserEntries: event.target.checked });
        console.log("state in handleSwitch: ", state)
        tableRef.current.onQueryChange() //TODO:  Figure out why this works
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
                url += '&offset=' + query.page;
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
            actions={[
                {
                    icon: 'refresh',
                    tooltip: 'Refresh Data',
                    isFreeAction: true,
                    onClick: () => tableRef.current && tableRef.current.onQueryChange(),
                }
            ]}
        />
    </div>
)}

export default RemoteData;