import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';

export const Observations = () => {
    const [doFetch, setDoFetch] = useState(true);
    const [observations, setObservations] = useState([]);

    useEffect(() => {
        const fetchObserations = async () => {
            let r = await fetch("http://localhost:3002/api/havainto");
            let data = await r.json();

            setObservations(data.havainnot);
        }

        if (doFetch) {
            fetchObserations();
        }

    }, [doFetch])

    return (
        <div>
            <Button variant="secondary">Lisää havainto</Button>
            {
                doFetch ? <ObservationsTable observations={observations} /> : null
            }  
        </div>
        
    );
}

const ObservationsTable = (props) => {

    const data = props.observations.map((o, i) => {
        return (
            <tr>
                <td>{o.kohde}</td>
                <td>{o.pvm}</td>
                <td>{o.valine}</td>
                <td>{o.paikka}</td>
                <td>{o.selite}</td>
                <td><Button variant="link">Muokkaa</Button></td>
                <td><Button variant="link">Poista</Button></td>
            </tr>
        );
    });

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Kohde</th>
                        <th>Päivämäärä</th>
                        <th>Väline</th>
                        <th>Paikka</th>
                        <th>Selite</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </Table>
        </div>
    );
}