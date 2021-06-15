import { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { Error } from './error.js';
import './style.css';

export const SkyObjects = () => {
    const [objects, setObjects] = useState([]);
    const [doFetch, setDoFetch] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [objectToBeInserted, setObjectToBeInserted] = useState(null);
    const [objectToBeModified, setObjectToBeModified] = useState(null);
    const [objectToBeUpdated, setObjectToBeUpdated] = useState(null);
    const [modifyId, setModifyId] = useState(-1);
    const [deleteId, setDeleteId] = useState(-1);
    const [error, setError] = useState(null);
    const [sortType, setSortType] = useState(null);

    const SaveClicked = (name, alias, typeid, object) => {
        if (object) {
            let id = object.id;
            setObjectToBeUpdated({id, name, alias, typeid});
        }
        else {
            setObjectToBeInserted({name, alias, typeid});
        }
    }

    const CancelClicked = () => {
        setShowForm(false);
        setObjectToBeModified(null);
    }

    const OnEdit = (id) => {
        setModifyId(id);
    }

    useEffect(() => {   
        // Haetaan kohteet listalle     
        const fetchObjects = async () => {
            let r = await fetch("http://localhost:3002/api/kohde");
            let data = await r.json();
            
            setObjects(data.kohteet);
            setDoFetch(false);
            setSortType("kohde");
        }

        if (doFetch) {
            fetchObjects();
        }

    }, [doFetch])

    useEffect(() => {
        // Kohteen lisäys
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
                setError(response.message);              
            }
        }        

        if (objectToBeInserted) {
            insertObject();
        }
    }, [objectToBeInserted]);

    useEffect(() => {
        // Haetaan kohde, jota halutaan muokata
        const fetchObject = async () => {
            let r = await fetch("http://localhost:3002/api/kohde/" + modifyId);
            let data = await r.json();            

            setObjectToBeModified(data.kohde[0]);
        }

        if (modifyId > 0) {
            fetchObject();
            setShowForm(true);
            setModifyId(-1);
        }

    }, [modifyId]);

    useEffect(() => {
        // Muokattavan kohteen päivitys
        const updateObject = async () => {
            const r = await fetch("http://localhost:3002/api/kohde/" + objectToBeUpdated.id, {
                method: "PUT",
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({name: objectToBeUpdated.name, alias: objectToBeUpdated.alias, 
                    typeid: objectToBeUpdated.typeid})
            });

            if ( r.status == 204 ){
                setShowForm(false);
                setDoFetch(true);
                setObjectToBeModified(null);
            }
            else {
                let response = await r.json();
                setError(response.message);
            }
        }

        if (objectToBeUpdated) {
            updateObject();
        }
    }, [objectToBeUpdated]);

    useEffect(() => {
        // Kohteen poisto
        const deleteObject = async () => {
            const r = await fetch("http://localhost:3002/api/kohde/" + deleteId, {
                method: "DELETE"
            });

            setDeleteId(-1);
            setDoFetch(true);
        }

        if (deleteId > 0) {
            deleteObject();           
        }
    }, [deleteId]);

    useEffect(() => {
        // Asetetaan tyyppi, jonka mukaan taulukko lajitellaan
        const sortArray = () => {
            const sorted = [...objects].sort((a, b) => a[sortType].localeCompare(b[sortType], undefined, {numeric: true, sensitivity: 'base'})  );
            setObjects(sorted);
            setSortType(null);
        }
    
        if (sortType) sortArray();
      }, [sortType]);


    return (
        <Container fluid>
            <Button className="item" variant="secondary" onClick={() => setShowForm(true)}>Lisää uusi kohde</Button>

            <Row className="justify-content-md-left">
                <Col md={{ span: 10 }}>
                    <ObjectsTable objects={objects} OnEdit={OnEdit} setDeleteId={setDeleteId} setSortType={setSortType}/>
                </Col>
            </Row> 

            {
                showForm ? <ObjectForm SaveClicked={SaveClicked} CancelClicked={CancelClicked} object={objectToBeModified}/> : null
            }
            {
                error ? <Error message={error} setError={setError} /> : null
            }
        </Container>
    );
}

const ObjectsTable = (props) => {

    const data = props.objects.map((o, i) => {

        return (
            <tr key={i}>
                <td>{o.kohde}</td>
                <td>{o.alias ? o.alias : ""}</td>
                <td>{o.tyyppi}</td>
                <td><Button variant="link" onClick={() => props.OnEdit(o.id)}>Muokkaa</Button></td>
                <td><Button variant="link" onClick={() => props.setDeleteId(o.id)}>Poista</Button></td>
            </tr>
        );
    });

    return (
        <div>
            <Table striped bordered hover size="sm" lg="auto">
                <thead>
                    <tr>
                        <th><a href="#" onClick={() => props.setSortType("kohde")}>Kohde</a></th>
                        <th><a href="#" onClick={() => props.setSortType("alias")}>Alias</a></th>
                        <th><a href="#" onClick={() => props.setSortType("tyyppi")}>Tyyppi</a></th>
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
    const object = props.object;    

    const [types, setTypes] = useState([]);
    const [name, setName] = useState("");
    const [alias, setAlias] = useState("");
    const [typeid, setTypeid] = useState(-1);

    const show = true;

    useEffect(() => {
        // Haetaan kohdetyypit alasvetovalikkoon
        const fetchTypes = async () => {
            let r = await fetch("http://localhost:3002/api/tyyppi");
            let data = await r.json();

            setTypes([{id: -1, nimi: "Valinta"}, ...data.tyypit]);
        }

        fetchTypes();
    }, []);

    useEffect(() => {
        // Tarkistetaan ollaanko muokkaamassa kohdetta. Jos ollaan -> laitetaan arvot kenttiin
        if (object) {
            setName(object.kohde);
            setAlias(object.alias);
            setTypeid(object.tyyppi_id);
        }
    }, [object]);

    const objectTypes = types.map((t, i) => {
        return (
            <option value={t.id} key={t.id}>{t.nimi}</option>
        );
        
    });

    return (
        <Modal show={show} onHide={() => props.CancelClicked()}>
            <Modal.Header closeButton>
                <Modal.Title>{object ? "Muokkaa kohdetta" : "Lisää uusi kohde"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nimi</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Alias</Form.Label>
                        <Form.Control type="text" value={alias} onChange={(e) => setAlias(e.target.value)}/>
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
                <Button variant="primary" onClick={() => props.SaveClicked(name, alias, typeid, object)}>{object ? "Tallenna muutos" : "Tallenna"}</Button>
            </Modal.Footer>
        </Modal>
    ) 
}