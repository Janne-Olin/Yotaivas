import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from 'react-bootstrap';

export const SkyObjects = () => {
    const [objects, setObjects] = useState([]);
    const [doFetch, setDoFetch] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [objectToBeInserted, setObjectToBeInserted] = useState(null);

    const SaveClicked = (name, alias, typeid) => {
        setShowForm(false);
        setObjectToBeInserted({name, alias, typeid});
    }

    const CancelClicked = () => {
        setShowForm(false);
    }

    useEffect(() => {
        const fetchObjects = async () => {
            let r = await fetch("http://localhost:3002/api/kohde");
            let data = await r.json();
            
            setObjects(data.kohteet);
            setDoFetch(false);
        }

        if (doFetch) {
            fetchObjects();
        }

    }, [doFetch])

    useEffect(() => {
        const insertObject = async () => {
            const r = await fetch("http://localhost:3002/api/kohde", {
                method: "POST",
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({name: objectToBeInserted.name, alias: objectToBeInserted.alias, 
                    typeid: objectToBeInserted.typeid})
            });

            if ( r.status == 201 ){
                setShowForm(false);
                setDoFetch(true);
            }
            else {
                let response = await r.json();                
            }
        }        

        if (objectToBeInserted) {
            console.log(objectToBeInserted);
            insertObject();
        }
    }, [objectToBeInserted])

    return (
        <div>
            <Button variant="secondary" onClick={() => setShowForm(true)}>Lisää uusi kohde</Button>

            <ObjectsTable objects={objects}/>

            {
                showForm ? <ObjectForm SaveClicked={SaveClicked} CancelClicked={CancelClicked}/> : null
            }
        </div>
    );
}

const ObjectsTable = (props) => {

    const data = props.objects.map((o, i) => {

        return (
            <tr>
                <td>{o.kohde}</td>
                <td>{o.alias ? o.alias : ""}</td>
                <td>{o.tyyppi}</td>
                <td><Button variant="link">Muokkaa</Button></td>
                <td><Button variant="link">Poista</Button></td>
                <td><Button variant="link">Lisää havainto</Button></td>
            </tr>
        );
    });

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Kohde</th>
                        <th>Alias</th>
                        <th>Tyyppi</th>
                        <th></th>
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

const ObjectForm = (props) => {
    const [types, setTypes] = useState([]);
    const [name, setName] = useState("");
    const [alias, setAlias] = useState("");
    const [typeid, setTypeid] = useState(-1);

    const show = true;

    useEffect(() => {
        const fetchTypes = async () => {
            let r = await fetch("http://localhost:3002/api/tyyppi");
            let data = await r.json();

            setTypes([{id: -1, nimi: "Valinta"}, ...data.tyypit]);
        }

        fetchTypes();
    }, []);

    const objectTypes = types.map((t, i) => {
        return (
            <option value={t.id} key={t.id}>{t.nimi}</option>
        );
        
    });

    return (
        <Modal show={show} onHide={() => props.CancelClicked()}>
            <Modal.Header closeButton>
                <Modal.Title>Lisää kohde</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nimi</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label type="text" value={alias} onChange={(e) => setAlias(e.target.value)}>Alias</Form.Label>
                        <Form.Control/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tyyppi</Form.Label>
                        <Form.Control as="select" value={typeid} onChange={(e) => setTypeid(e.target.value)}>
                            {objectTypes}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.CancelClicked()}>Sulje</Button>
                <Button variant="primary" onClick={() => props.SaveClicked(name, alias, typeid)}>Tallenna</Button>
            </Modal.Footer>
        </Modal>
    )
        
    
}