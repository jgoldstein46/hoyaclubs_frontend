import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { accountService, applicationService, subService } from '@/_services';

function Submissions({ match }) {
    const { path } = match;
    const [subs, setSubs] = useState(null);
    const user = accountService.userValue;
    useEffect(() => {
        subService.getByAppId(match.params.id).then(x => setSubs(x)); 
    }, []);
    return (
        <Container>
            {subs && subs.map((sub, indx) => (
                <Container>
                    <h6>Applicant Name: {sub.firstName} {sub.lastName} Email: {sub.email}</h6>
                    {sub.questions && sub.questions.map((question, j) => (
                        <Container>
                            <p>Question {j+1}: {question.questionText}<br></br>
                            response: {question.response}</p>
                        </Container>
                    ))}
                </Container> 
            )
            ) }
        </Container>
    );
}

export { Submissions }; 