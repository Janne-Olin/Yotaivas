import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Container, Col, Row } from 'react-bootstrap';

import { Error } from './error.js';
import './style.css';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from 'date-fns/locale/fi';
registerLocale('fi', fi)

const sortArray = (array, sortType) => {
    // Asetetaan tyyppi, jonka mukaan taulukko lajitellaan
    const sorted = [...array].sort((a, b) => a[sortType].localeCompare(b[sortType], undefined, {numeric: true, sensitivity: 'base'})  );
    return sorted;
}

export const Observations = () => {
    const [doFetch, setDoFetch] = useState(true);
    const [observations, setObservations] = useState([]);
    const [error, setError] = useState(null);
    const [observationToBeInserted, setObservationToBeInsterted] = useState(null);
    const [observationToBeModified, setObservationToBeModified] = useState(null);
    const [observationToBeUpdated, setObservationToBeUpdated] = useState(null)
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState(-1);
    const [modifyId, setModifyId] = useState(-1);
    const [sortType, setSortType] = useState(null);
    const [object, setObject] = useState(-1);
    const [objectList, setObjectList] = useState([]);
    const [objListSortType, setObjListSortType] = useState(null);


    const SaveClicked = (date, equipment, location, description, objectid, observation) => {
        if (observation) {
            let id = observation.id;
            setObservationToBeUpdated({id, date, equipment, location, description, objectid});
        }
        else {
            setObservationToBeInsterted({date, equipment, location, description, objectid});
        }

    }

    const CancelClicked = () => {
        setShowForm(false);
        setObservationToBeModified(null);
    }

    const OnEdit = (id) => {
        setModifyId(id);
    }

    const ObjectSelected = (e) => {
        setObject(e.target.value);
    }

    useEffect(() => {
        // Haetaan kohteet alasvetovalikkoon
        const fetchObjectList = async () => {
            const r = await fetch("http://localhost:3002/api/kohde");
            const data = await r.json();
            console.log(data.kohteet);
            setObjectList([{ id: -1, kohde: "--Valitse--" }, ...data.kohteet]);
            setObjListSortType("kohde");
        }
        fetchObjectList();
    }, []);

    useEffect(() => {
        // Haetaan havainnot taulukkoon
        const fetchObserations = async () => {
            let r = await fetch("http://localhost:3002/api/havainto");
            let data = await r.json();

            setObservations(data.havainnot);
            setDoFetch(false);
            setSortType("pvm");
        }

        if (doFetch) {
            fetchObserations();
        }

    }, [doFetch]);

    useEffect(() => {
        // Uuden havainnon lisääminen
        const insertObservation = async () => {
            const r = await fetch("http://localhost:3002/api/havainto", {
                method: "POST",
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({date: observationToBeInserted.date, equipment: observationToBeInserted.equipment, 
                    location: observationToBeInserted.location, description: observationToBeInserted.description, objectid: observationToBeInserted.objectid})
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

        if (observationToBeInserted) {
            insertObservation();
        }
    }, [observationToBeInserted]);

    useEffect(() => {
        // Havainnon poisto
        const deleteObservation = async () => {
            const r = await fetch("http://localhost:3002/api/havainto/" + deleteId, {
                method: "DELETE"
            });

            setDeleteId(-1);
            setDoFetch(true);
        }

        if (deleteId > 0) {
            deleteObservation();           
        }
    }, [deleteId]);

    useEffect(() => {
        // Haetaan havainto jota halutaan muokata
        const fetchObservation = async () => {
            let r = await fetch("http://localhost:3002/api/havainto/" + modifyId);
            let data = await r.json();        

            setObservationToBeModified(data.havainto[0]);
        }

        if (modifyId > 0) {
            fetchObservation();
            setShowForm(true);
            setModifyId(-1);
        }

    }, [modifyId]);

    useEffect(() => {
        // Havainnon päivitys
        const updateObservation = async () => {
            const r = await fetch("http://localhost:3002/api/havainto/" + observationToBeUpdated.id, {
                method: "PUT",
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({date: observationToBeUpdated.date, equipment: observationToBeUpdated.equipment, 
                    location: observationToBeUpdated.location, description: observationToBeUpdated.description, objectid: observationToBeUpdated.objectid})
            });

            if ( r.status == 204 ){
                setShowForm(false);
                setDoFetch(true);
                setObservationToBeModified(null);
            }
            else {
                let response = await r.json();
                setError(response.message);
            }
        }

        if (observationToBeUpdated) {
            updateObservation();
        }
    }, [observationToBeUpdated]);

    useEffect(() => {    
        if (sortType) setObservations(sortArray(observations, sortType));

      }, [sortType]);

    useEffect(() => {
        if (objectList.length > 0) setObjectList(sortArray(objectList, objListSortType));

    }, [objListSortType]);

      const objectSelection = objectList.map((o, i) => {
        return <option key={i} value={o.id}>{o.kohde}</option>
    })



    return (
        <Container fluid>
            <Form.Label className="item">Suodata kohteen mukaan:</Form.Label>  
                <Col xs lg={2}>      
                    <Form.Group>                        
                        <Form.Control className="item" as="select" value={object} onChange={(e) => ObjectSelected(e)}>
                            {objectSelection}
                        </Form.Control>
                    </Form.Group>             
                   
                </Col>
            <Button className="item" variant="secondary" onClick={() => setShowForm(true)}>Lisää havainto</Button>

            <Row className="justify-content-md-left">
                <Col md={{ span: 10 }}>
                    <ObservationsTable observations={observations} setDeleteId={setDeleteId} OnEdit={OnEdit} setSortType={setSortType} object={object}/>
                </Col>
            </Row>   
            {
                showForm ? <ObservationForm SaveClicked={SaveClicked} CancelClicked={CancelClicked} observation={observationToBeModified}/> : null
            } 
            {
                error ? <Error message={error} setError={setError} /> : null
            }
        </Container>
        
    );
}

const ObservationsTable = (props) => {

    const data = props.observations.map((o, i) => {
        return (
            <tr key={i}>
                <td>{o.kohde}</td>
                <td>{new Date(o.pvm).toLocaleDateString('fi-FI')}</td>
                <td>{o.valine}</td>
                <td>{o.paikka}</td>
                <td>{o.selite}</td>
                <td><Button variant="link" onClick={() => props.OnEdit(o.id)}>Muokkaa</Button></td>
                <td><Button variant="link" onClick={() => props.setDeleteId(o.id)}>Poista</Button></td>
            </tr>
        );
    });

    // Taulukon suodatus, jos alasvetovalikosta ollaan valittu kohde
    const filteredTable = props.observations.filter(o => o.kohde_id == props.object);

    const filtereddata = filteredTable.map((o, i) => {
        return (
            <tr key={i}>
                <td>{o.kohde}</td>
                <td>{new Date(o.pvm).toLocaleDateString('fi-FI')}</td>
                <td>{o.valine}</td>
                <td>{o.paikka}</td>
                <td>{o.selite}</td>
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
                        <th><a href="#" onClick={() => props.setSortType("pvm")}>Päivämäärä</a></th>
                        <th><a href="#" onClick={() => props.setSortType("valine")}>Väline</a></th>
                        <th><a href="#" onClick={() => props.setSortType("paikka")}>Paikka</a></th>
                        <th>Selite</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.object > 0 ? filtereddata : data}
                </tbody>
            </Table>
        </div>
    );
}

const ObservationForm = (props) => {
    const observation = props.observation;    

    const [objects, setObjects] = useState([]);
    const [date, setDate] = useState(new Date());
    const [equipment, setEquipment] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [objectid, setObjectid] = useState(-1);
    const [objSortType, setObjSortType] = useState(null);

    const show = true;

    useEffect(() => {
        // Kohteiden haku alasvetovalikkoon
        const fetchObjects = async () => {
            let r = await fetch("http://localhost:3002/api/kohde");
            let data = await r.json();

            setObjects([{id: -1, kohde: "Valinta"}, ...data.kohteet]);
            setObjSortType("kohde");
        }

        fetchObjects();
    }, []);

    useEffect(() => {
         // Tarkistetaan ollaanko muokkaamassa havaintoa. Jos ollaan -> laitetaan arvot kenttiin
        if (observation) {
            console.log(observation.pvm);
            setDate(new Date(observation.pvm));
            setEquipment(observation.valine);
            setLocation(observation.paikka);
            setDescription(observation.selite);
            setObjectid(observation.kohde_id);
        }
    }, [observation]);

    useEffect(() => {    
        if (objSortType) setObjects(sortArray(objects, objSortType));

      }, [objSortType]);

    const objectData = objects.map((o, i) => {
        return (
            <option value={o.id} key={o.id}>{o.kohde}</option>
        );
        
    });

    return (
        <Modal show={show} onHide={() => props.CancelClicked()}>
            <Modal.Header closeButton>
                <Modal.Title>{observation ? "Muokkaa havaintoa" : "Lisää uusi havainto"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Row><Form.Label>Päivämäärä </Form.Label></Form.Row>
                        <Form.Row><DatePicker
                            selected={date}
                            onChange={date => setDate(date)}
                            locale={fi}
                            dateFormat="P"/></Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Kohde</Form.Label>
                        <Form.Control as="select" value={objectid} onChange={(e) => setObjectid(e.target.value)}>
                            {objectData}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Väline</Form.Label>
                        <Form.Control type="text" value={equipment} onChange={(e) => setEquipment(e.target.value)}/>
                    </Form.Group> 
                    <Form.Group>
                        <Form.Label>Paikka</Form.Label>
                        <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Selite</Form.Label>
                        <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.CancelClicked()}>Sulje</Button>
                <Button variant="primary" onClick={() => props.SaveClicked(date, equipment, location, description, objectid, observation)}>{observation ? "Tallenna muutos" : "Tallenna"}</Button>
            </Modal.Footer>
        </Modal>
    ) 
}