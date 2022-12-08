import React, { useEffect, useState } from 'react';

export const FetchData = () => {
    const [echoData, setEchoData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEcho = async () => {
        
        const response = await fetch('http://localhost:4455/api/echo');
        const json = await response.json();

        setEchoData(json);
        setLoading(false);
    }

    const renderEchoDataTable = function (data) {
        return (
            <div>
                <span>{data.username}</span>
                <span>{data.email}</span>
            </div>
        )
    }

    useEffect(() => {
        fetchEcho();
    }, []);

    var contents = (loading) ? <p><em>Loading...</em></p>
        : renderEchoDataTable(echoData);

    return (
        <div>
            <h1 id="tabelLabel" >Echo Api</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
    
}
