import { useEffect, useState } from "react";

export const SkyObjects = () => {
    const [objects, setObjects] = useState([]);
    const [doFetch, setDoFetch] = useState(true);

    useEffect(() => {
        const fetchObjects = async () => {
            let r = await fetch("http://localhost:3002/api/kohde");
            let data = await r.json();
            
            setObjects(data.kohteet);
        }

        if (doFetch) {
            fetchObjects();
        }

    }, [doFetch])



    return (
        <div>
            {
                doFetch ? <ObjectsTable objects={objects} /> : null
            }  
        </div>
    );
}

const ObjectsTable = (props) => {

    const data = props.objects.map((o, i) => {

        return (
            <tr>
                <td>{o.kohde}</td>
                <td>{o.alias ? o.alias : "-"}</td>
                <td>{o.tyyppi}</td>
            </tr>
        );
    });

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Kohde</th>
                        <th>Alias</th>
                        <th>Tyyppi</th>
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}