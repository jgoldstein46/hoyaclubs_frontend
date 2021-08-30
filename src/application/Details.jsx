import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { applicationService, subService } from '@/_services'; 
import { Formik, Field, Form, ErrorMessage, yupToFormErrors } from 'formik';
import { alertService, accountService } from '../_services';
import * as Yup from 'yup'; 




function Details ({ history, match }) {
    const { id } = match.params;
    
    const [app, setApp] = useState(null); 

    // const [initialValues, setInitialValues] = useState(null); 
    // const app = applicationService.getByAppId(id)
    useEffect(() => {
        applicationService.getByAppId(id).then(x => setApp(x));
    }, []); 
      // setInitialValues({app: x}); 
        // }).then(x => setInitialValues({app: x})); 
        // setInitialValues({app: app}); 
    const initialValues = {
        // 0: Yup.string()
    }; 
    const validationSchema = Yup.object().shape({
        orgName: Yup.string(),
        email: Yup.string()
            .email('Email is invalid'),
        position: Yup.string().required('Position title is required'),
        description: Yup.string().required('Position description is required'),
        due: Yup.date().required('Application deadline is required'),
        questionType: Yup.string(),
        questions: Yup.array().of(
            Yup.object().shape({
                questionText: Yup.string().required('Question text is required'),
                options: Yup.array().of(
                            Yup.object().shape({
                                optionText: Yup.string().required()
                            })
                        ),
                questionType: Yup.string(),
                required: Yup.bool().required(),
                file: Yup.mixed(), 
                response: Yup.string(), 
                
            })
        )
    }); 
    // console.log("this is adpp" + JSON.stringify(app)); 
    // for (let i=0; i < app.questions.length; i++ ) {
    //     initialValues[app.questions[i].questionText] = ''; 
    // }
    console.log("this is initial values: " + JSON.stringify(initialValues)); 
    // console.log("details is being called"); 
    function onSubmit (fields, { setSubmitting } ) {
        console.log("From onSubmit these are the fields: " + JSON.stringify(fields)); 
        alertService.clear();
        subService.create(fields)
            .then(() => {
                // const { from } = location.state || { from: { pathname: "/" } };
                // history.push(from);
                alertService.success('Application submitted successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });

    }; 

    function addQuestion(values, setValues, question) {
        console.log("Calling addQuestion now"); 
        const questions = [...values.questions]; 
        questions.push(question); 
        setValues({...values, questions}); 
    }; 

    return (
        <div>
            {/* <p>This is the application: {JSON.stringify(app)} </p> */}
            <h5>{app?.orgName}</h5>
            <h6>{app?.position}</h6>
            <p>Position description: {app?.description}</p>
            <p>{app?.email && `Contact email: ${app?.email}`}</p>
            {app?.questions && 
            
            renderForm(initialValues, validationSchema, onSubmit, app)
                 
            }
            
        </div>


    ); 
}; 

function renderForm(initialValues, validationSchema, onSubmit, app) {
    const user = accountService.userValue;
    console.log("From renderForm, this is app: " +JSON.stringify(app)); 

    initialValues = app; 
    initialValues['appId'] = app.id; 
    initialValues['id'] = ''; 
    initialValues['firstName'] = user.firstName;
    initialValues['lastName'] = user.lastName; 
    initialValues['email'] = user.email; 
    for (let i=0; i < app.questions.length; i++) {
        
        // let message = 'Question is required'
        // if (app.questions[i].questionType != 'File Upload') {
        //     // validationSchema[i] = Yup.string().required('Question is required');
        //     // if (app.questions[i].required) {
        //     //     validationSchema[i] = Yup.string().required('Question is required'); 
        //     // } else {
        //     //     validationSchema[i] = Yup.string();
        //     // }
        //     validationSchema['questions'] = app.questions[i].required ? Yup.string().required('Question is required') : Yup.string();
        // } else {
        //     // Yup.string().required('Question is required')
        //     validationSchema[i] = app.questions[i].required ? Yup.mixed().required('File upload is required') : Yup.mixed(); 
        // }
        initialValues['questions'][i].response = ''; 
        initialValues['questions'][i].file = null; 
    }
    // console.log("from renderForm, this is validationSchema: " + JSON.stringify(validationSchema)); 
    // console.log("from renderForm, this is initial values: " + JSON.stringify(initialValues));
    
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, values, touched, setValues, setFieldValue, isSubmitting, handleChange }) => {
        {/* console.log("Loggging these are the questions: " + JSON.stringify(app.questions)); */}

        return (
            <Form>
            <h5 className="card-header">Questions</h5>
            <div className="card-body">
            {app && app.questions.map((question, indx) => {
                 
                let field = null; 
                let component = null; 
                let options = null;
                let type = "text";
                let onChange = handleChange;  
                if (question.questionType == 'Paragraph') {
                    component = "textarea"; 
                } else if (question.questionType == 'Multiple Choice Question') {
                    component = "select"; 
                    options = question.options.map((option, indx) => {
                        return (
                            <option key={indx+1} value={option.optionText}>{option.optionText}</option>
                        );
                    }
                    );
                    options.unshift(<option key={0} value=""></option>); 
                } else if (question.questionType == 'File Upload') {
                    type = "file";
                    onChange = (event) => {
                        setFieldValue(indx, event.target.files); 
                    };
                }
                {/* else if (question.questionType == 'Paragraph') {
                    field = <div key={indx} className="form-group"> 
                        <label>Question {indx+1}: {question.questionText}</label>
                        <Field name={`questions.${indx}`} type="text" component="textarea" className={'form-control' + (errors.indx && touched.indx ? ' is-invalid' : '')} />
                        <ErrorMessage name={`questions.${indx}`} component="div" className="invalid-feedback" />
                    </div>; 
                } */}
                field = <div key={indx} className="form-group">
                        <label>Question {indx+1}: {question.questionText}</label>
                        <Field name={`questions.${indx}.response`} onChange={onChange} type={type} component={component} className={'form-control' + (errors.indx && touched.indx ? ' is-invalid' : '')}>
                        {options}
                        </Field>
                        <ErrorMessage name={`questions.${indx}.response`} component="div" className="invalid-feedback" />
                    </div>
                return field; 
                {/* ( 
                    <div key={indx} className="form-group">
                        <label>Question {indx+1}: {question.questionText}</label>
                        <Field name={`questions.${indx}`} type="text" className={'form-control' + (errors.indx && touched.indx ? ' is-invalid' : '')} />
                        <ErrorMessage name={`questions.${indx}`} component="div" className="invalid-feedback" />
                    </div>
                
                ); */}
            })
            }
                <div className="form-row">
                    <div className="form-group col">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Submit Application
                        </button>
                        <button className="btn btn-secondary mr-1" type="reset">Reset</button>
                    </div>   
                </div>
            </div>
            </Form>); 
    
        }
        }
        
    </Formik>
    );
     
}

export { Details };



