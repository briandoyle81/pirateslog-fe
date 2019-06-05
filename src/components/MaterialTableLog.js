import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';

import Avatar from '@material-ui/core/Avatar';
import SloopAvatar from './ImageAvatars'
import ImageIcon from '@material-ui/icons/Image';

const axios = require('axios');
const DEBUG_TOKEN = process.env.REACT_APP_DEBUG_TOKEN;
const BE_SERVER = process.env.REACT_APP_BE_SERVER;

function RemoteData(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(props.data.isAuthenticated);
    const [user, setUser] = useState(props.data.user);
    const [token, setToken] = useState(props.data.token);
    const [beToken, setBeToken] = useState(props.data.beToken);

    useEffect(() => {
        console.log("using effect in material table");
        setBeToken(props.data.beToken);
        console.log("beToken", beToken);
    })

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
                let url = BE_SERVER + "/api/entries/";
                url += '?limit=' + query.pageSize;
                url += '&offset=' + (query.page + 1);
                console.log("beToken ", beToken)
                let config = {
                    headers: {
                      'Authorization': 'Token  ' + beToken
                    }
                  }
                  console.log("config: ", config);
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
        />
      )
  }

export default RemoteData;