import { alertService, applicationService } from "@/_services";


export function onAddQuestion(e, field, values, setValues, setFieldValue) {

    const questions = [...values.questions];
    // const questionType = [...values.questionType]; 

    // const previousNumber = parseInt(field.value || '0');
    // const numberOfQuestions = previousNumber + 1 || 0;
    // questionType.push({ questionType: e.target.value }); 
    if (e.target.value === 'Short Answer Question') {
        questions.push({ questionText: '', required: false, questionType: e.target.value });
    } else if (e.target.value === 'Multiple Choice Question') {
        questions.push({ questionText: '', options: [{optionText: ''}], required: false, questionType: e.target.value }); 
    } else if (e.target.value === 'Paragraph') {
        questions.push({questionText: '', required: false, questionType: e.target.value }); 
    } else if (e.target.value == 'File Upload') {
        questions.push({ fileName: '', required: false, questionType: e.target.value }); 
    }
    // questionType = [];
    const questionType = ''; 
    setValues({ ...values, questionType, questions  });
    // call formik onChange method
    field.onChange(e);
    // console.log("This is values after adding question " + JSON.stringify(values)); 
    // console.log("This is field after adding question " + JSON.stringify(field)); 
    // setFieldValue(`questions.${len()}`)
    // e.selectedIndex = 0; 
    // console.log("this is the dropdown value: " + e.target.value); 
    // e.target.value = "";
    // console.log("this is the dropdown value: " + e.target.value);
}
export function onAddOption (e, field, values, setValues, setFieldValue, indx) {
    // console.log("onAddOption is triggered"); 
    const options = [...values.questions[indx].options];
    const questions = [...values.questions]; 
    // console.log("These are the questions: " + JSON.stringify(questions)); 

    options.push({ optionText: '' }); 
    questions[indx].options = options; 
    // const optionText = ''; 
    setValues({ ...values, questions }); 
    field.onChange(e); 
}

export function onDeleteQuestion(e, field, values, setValues, setFieldValue) {
    const questions = [...values.questions]; 
    questions.splice(questions.length -1, 1); 

    console.log("These are the questions after one has been popped: " + JSON.stringify({ ...values, questions})); 
    setValues({ ...values, questions }, false); 
    field.onChange(e); 
}


