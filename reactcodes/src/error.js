import { useState } from "react";
import {  Modal, Alert } from 'react-bootstrap';

export const Error = (props) => {
    const {message} = props;
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
        props.setError(null);
    } 

    return (
        <Modal size="sm" show={show} onHide={handleClose}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Alert variant="warning" >
                    <Alert.Heading>Virhe:</Alert.Heading>
                    <p>
                    {message}
                    </p>
                </Alert>
            </Modal.Body>
        </Modal>

    )
}