import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';

import { Error } from './error.js';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from 'date-fns/locale/fi';
registerLocale('fi', fi)

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

    useEffect(() => {
        const fetchObserations = async () => {
            let r = await fetch("http://localhost:3002/api/havainto");
            let data = await r.json();

            setObservations(data.havainnot);
            setDoFetch(false);
        }

        if (doFetch) {
            fetchObserations();
        }

    }, [doFetch]);

    useEffect(() => {
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



    return (
        <div>
            <Button variant="secondary" onClick={() => setShowForm(true)}>Lisää havainto</Button>

            <ObservationsTable observations={observations} setDeleteId={setDeleteId} OnEdit={OnEdit}/>

            {
                showForm ? <ObservationForm SaveClicked={SaveClicked} CancelClicked={CancelClicked} observation={observationToBeModified}/> : null
            } 
            {
                error ? <Error message={error} setError={setError} /> : null
            }
        </div>
        
    );
}

const ObservationsTable = (props) => {

    const data = props.observations.map((o, i) => {
        return (
            <tr>
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

const ObservationForm = (props) => {
    const observation = props.observation;    

    const [objects, setObjects] = useState([]);
    const [date, setDate] = useState(new Date());
    const [equipment, setEquipment] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [objectid, setObjectid] = useState(-1);

    const show = true;

    useEffect(() => {
        const fetchObjects = async () => {
            let r = await fetch("http://localhost:3002/api/kohde");
            let data = await r.json();

            setObjects([{id: -1, kohde: "Valinta"}, ...data.kohteet]);
        }

        fetchObjects();
    }, []);

    useEffect(() => {
        if (observation) {
            console.log(observation.pvm);
            setDate(new Date(observation.pvm));
            setEquipment(observation.valine);
            setLocation(observation.paikka);
            setDescription(observation.selite);
            setObjectid(observation.kohde_id);
        }
    }, [observation]);

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