import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { onAddQuestion, onAddOption, onDeleteQuestion } from './_helpers';

import { accountService, alertService, applicationService } from '@/_services';

function Create({ history, location }) {
    const user = accountService.userValue;

    const initialValues = {
        orgName: user.orgName,
        position: '',
        email: user.email,
        description: '',
        due: '',
        questionType: '',
        questions: [], 
        optionText: ''
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
                required: Yup.bool().required()
            })
        )
    });

    function onSubmit(fields, { setSubmitting }) {
        // console.log("THese are the fields " + JSON.stringify(fields)); 
        alertService.clear();
        applicationService.create(fields)
            .then(() => {
                // const { from } = location.state || { from: { pathname: "/" } };
                // history.push(from);
                alertService.success('Application posted successfully', { keepAfterRouteChange: true });
                
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }
    console.log("In create this is the validation schema: " + JSON.stringify(validationSchema)); 

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, values, touched, setValues, setFieldValue, isSubmitting }) => (
                <Form>
                    <h3 className="card-header">Create a new position opening</h3>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Position</label>
                            <Field name="position" type="text" className={'form-control' + (errors.position && touched.position ? ' is-invalid' : '')} />
                            <ErrorMessage name="position" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label>Organization Contact Email</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label>Description of Postion</label>
                            <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label>Application Due Date</label>
                            <Field name="due" type="date" className={'form-control' + (errors.due && touched.due ? ' is-invalid' : '')} />
                            <ErrorMessage name="due" component="div" className="invalid-feedback" />
                        </div>
                        
                        
                        <FieldArray name="questions">
                        {() => (values.questions.map((question, indx) => {
                            {/* console.log("These are the values when a question is updated " + indx + JSON.stringify(values));  */}
                            {/* console.log("These are the errors when a question is updated " + indx + JSON.stringify(errors)); 
                            console.log("These are the touched when a question is updated " + indx + JSON.stringify(touched));  */}
                            {/* console.log("This is the new question: " + JSON.stringify(question));  */}
                            const questionErrors = errors.questions?.length && errors.questions[indx] || {};
                            const questionTouched = touched.questions?.length && touched.questions[indx] || {};
                            return (
                                <div key={indx} className="list-group list-group-flush">
                                    <div className="list-group-item">
                                        <h5 className="card-title">Question {indx + 1}: {question.questionType} </h5>
                                        <div className="form-row">
                                            <div className="form-group col-6">
                                                
                                                <div> 
                                                    <label> {question.questionType != 'File Upload' ? "Question Text" : "File Name" }</label>
                                                    <Field name={`questions.${indx}.questionText`} type="text" className={'form-control' + (questionErrors.questionText && questionTouched.questionText ? ' is-invalid' : '' )} />
                                                    <ErrorMessage name={`questions.${indx}.questionText`} component="div" className="invalid-feedback" />
                                                </div>
                                                
                                                {/* {question.questionType == 'File Upload' && 
                                                  <label>File </label>  
                                                } */}
                                            </div>
                                            {question.options && 
                                                <FieldArray name={`questions.${indx}.options`}>
                                                    {() => (values.questions[indx].options.map((option, j) => {
                                                        {/* const questionErrors = errors.questions?.length && errors.questions[indx] || {}; */}
                                                        {/* console.log("When error happens these are the values: " + JSON.stringify(values)); 
                                                        console.log("This is indx: " + indx); 
                                                        console.log("These are the errors: " + JSON.stringify(errors));  */}
                                                        // error occurs when you add an mc question when the question before didn't have text (was mc question before too) 
                                                  
                                                        {/* let optionErrors = {}; 
                                                        let optionTouched = {}; 
                                                        if (errors.questions?.length > indx) {
                                                            console.log("This is the question: " + JSON.stringify(question)); 
                                                            optionErrors = errors.questions[indx].options[j];
                                                        } 
                                                        if (touched.questions?.length > indx) { 
                                                            optionTouched = touched.questions[indx].options[j]
                                                        } */}

                                                        const optionErrors = questionErrors.options?.length && questionErrors.options[j] || {};
                                                        const optionTouched = questionTouched.options?.length && questionTouched.options[j] || {}; 
                                                        return (
                                                            <div key={j} className="list-group list-group-flush"> 
                                                                <div className="list-group-item">
                                                                    <p className="card-title">Option {j + 1}</p>
                                                                    <div className="form-row">
                                                                        <div className="form-group col-6">
                                                                            <Field name={`questions.${indx}.options.${j}.optionText`} type="text" className={'form-control' + (optionErrors.optionText && optionTouched.optionText ? ' is-invalid' : '' )} />
                                                                            <ErrorMessage name={`questions.${indx}.options.${j}.optionText`} component="div" className="invalid-feedback" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        );
                                                    }))}
                                                    {/* <div className="form-group col-6">
                                                <label>Option 1</label>
                                                <Field name={`questions.${indx}.options.text`} type="text" className={'form-control' + (questionErrors.text && questionTouched.text ? ' is-invalid' : '' )} />
                                                <ErrorMessage name={`questions.${indx}.text`} component="div" className="invalid-feedback" />
                                            </div> */}
                                                </FieldArray>
                                            }
                                            {question.options && 
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        {/* <label>Add option</label> */}
                                                        <Field> 
                                                        {({ field, form, meta }) => (
                                                            <div>
                                                                <input name={`questions.${indx}.addOption`} type='button' value='Add option' onClick={e => {
                                                                    return onAddOption(e, field, values, setValues, setFieldValue, indx) 
                                                                    // console.log("these are the values: " + JSON.stringify(values))
                                                                }} /> 
                                                                {/* <input value={values.optionText} name={`questions.${indx}.addOption`} className={'form-control' + (errors.addOption && touched.addOption ? ' is-invalid' : '')} onChange={e => {
                                                                    return onAddOption(e, field, values, setValues, setFieldValue, indx) 
                                                                    // console.log("these are the values: " + JSON.stringify(values))
                                                                }
                                                                    }/> */}
                                                            </div>
                                                        )}
                                                        
                                                        </Field>
                                                        <ErrorMessage name={`questions.${indx}.addOption`} component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                            }
                                            <div className="form-group col-6 form-check">
                                                
                                                <label className="form-check-label">
                                                <Field type='checkbox' name={`questions.${indx}.required`} className={'form-check-input' + (questionErrors.required && questionTouched.required ? ' is-invalid' : '' )} />
                                                    {/* {console.log("This is values again: " + JSON.stringify(values))} */}
                                                    {/* {`${values.questions[indx].required}`} */}
                                                    Required
                                                </label>
                                                <ErrorMessage name={`questions.${indx}.required`} component="div" className="invalid-feedback" />
                                               
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <Field name="delete">
                                            {({ field }) => (
                                                <div>
                                                    <button className='btn btn-danger' name={`delete`} type='button' onClick={e => {
                                                        onDeleteQuestion(e, field, values, setValues, setFieldValue)
                                                        // console.log("These are the values after one question has been deleted: " + JSON.stringify(values)); 
                                                        }}>Delete question</button>
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                </div>
                            
                        
                            );
                        }))}
                        </FieldArray>
                        
    

                        <div className="form-row">
                            <div className="form-group">
                                <label>Add Question</label>
                                <Field name="questionType">
                                {({ field }) => (
                                    <select {...field} className={'form-control' + (errors.questionType && touched.questionType ? ' is-invalid' : '')} onChange={e => onAddQuestion(e, field, values, setValues, setFieldValue)}>
                                        <option value={values.questionType}></option>
                                        {['Short Answer Question', 'Multiple Choice Question', 'Paragraph', 'File Upload'].map((i, indx) => 
                                            <option key={indx} value={i}>{i}</option>
                                        )}
                                    </select>
                                )}
                                </Field>
                                <ErrorMessage name="questionType" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        

                        <div className="form-row">
                            <div className="form-group col">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Post Application
                                </button>
                                <button className="btn btn-secondary mr-1" type="reset">Reset</button>
                            </div>
                            
                        </div>
                        </div>
                    
                </Form>
            )}
        </Formik>
    )
}

export { Create }; 