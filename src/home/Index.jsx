import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService, applicationService } from '@/_services';
import { Container } from 'react-bootstrap'; 


function Home() {
    const user = accountService.userValue;
    // console.log("This is the user's role: " + user.role);
    // const { path } = match;
    const [applications, setApplications] = useState(null);
    console.log("this is the user: " + JSON.stringify(user)); 
    useEffect(() => {
        applicationService.getAll().then(x => setApplications(x));
    }, []);
    // console.log("This is being called"); 
    // console.log("These are the applications: " + JSON.stringify(applications)); 
    // console.log(typeof applications[0].due)
    return (
        <div>
            <Container>
            <h1>Browse Clubs</h1>
            <Container className='Browse-box'>
                {applications && applications.map(application => {
                    const dueDate = new Date(application.due); 
                    const dueFormatted = `${dueDate.getMonth()+1}/${dueDate.getDate()+1}/${dueDate.getFullYear()}`
                    return (
                    <Link to={`/details/${application.id}`} 
                        className="item"
                        key={application.id}>
                        <Container className='Club-box'>
                            <h2>{application.orgName}</h2>
                            <h4>{application.position}</h4>
                            <p>Applicaiton Deadline: {dueFormatted}</p>
                        </Container>
                    </Link>
                    
                    ); 
                })}
                {!applications && 
                    <div>No Applications Posted Yet...</div>
                }
            </Container>
        </Container>
        </div>
        
    );
}

export { Home };