import React from 'react';
import { Form, Col, Button, Container } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LocationForm = () => {
    const formik = useFormik({
        initialValues: {
            locName: '',
            locDesc: '',
            locAddr: '',
            locCity: '',
            locState: '',
            locZip: ''
        },
        validationSchema: Yup.object({
            locName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
            locDesc: Yup.string()
            .max(1000, 'Must be 1000 characters or less')
            .required('Required'),
            locAddr: Yup.string()
            .max(50, 'Must be 50 characters or less')
            .required('Required'),
            locCity: Yup.string()
            .max(50, 'Must be 50 characters or less')
            .required('Required'),
            locState: Yup.string()
            .max(50, 'Must be 50 characters or less')
            .required('Required'),
            locZip: Yup.string()
            .max(11, 'Must be 11 characters or less')
            .required('Required'),
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const handleSubmit = values => {alert(JSON.stringify(values, null, 2))}
    return (
        <Container fluid className="d-flex vh-100 pt-25 bg-dark text-white justify-content-center" >

            <Form onSubmit={handleSubmit} noValidate>
                <Form.Group controlId="locName">
                <Form.Label>Location Name</Form.Label>
                <Form.Control type="text" placeholder="Title" required />
                <Form.Control.Feedback type="invalid">
                    Please provide a title for the listing.
                </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="locDesc">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows="3" required />
                </Form.Group>

                <Form.Group controlId="locAddr">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Address" required />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid address.
                </Form.Control.Feedback>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} md="6" controlId="locCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" placeholder="City" required />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid city.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="locState">
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" placeholder="State" required />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid state.
                        </Form.Control.Feedback>
                    </Form.Group>
                        <Form.Group as={Col} md="3" controlId="locZip">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control type="text" placeholder="Zip" required />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid zip.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default LocationForm