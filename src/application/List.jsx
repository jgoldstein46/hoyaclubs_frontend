import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService, applicationService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [applications, setApplications] = useState(null);
    const user = accountService.userValue;

    useEffect(() => {
        // console.log("First use effect is running")
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // // console.log("This is the user inside use effect: " + JSON.stringify(user)); 
        // return subscription.unsubscribe;
        applicationService.getByUserId(user.id).then(x => setApplications(x)); 
    }, []);
    // console.log("This is the user: " + JSON.stringify(user));
    
    // get all applications that have the club's name
    // must use authentication somehow to 
    // ensure that the club with that name is a user and is associated 
    // with that club 

    // useEffect(() => {
    //     console.log("second Use effect running")
    //     applicationService.getByUserId(accountService.user.id).then(x => setApplications(x));
    // }, []);

    function deleteApplication(appId) {
        setApplications(applications.map(x => {
            if (x.id === appId) { x.isDeleting = true; }
            return x;
        }));
        
        applicationService.delete(appId).then(() => {
            setApplications(applications => applications.filter(x => x.id !== appId));
        });
    }
    return (
        <div>
             {/* <Link to={`${path}/create`}>Create new applications</Link> */}
            <h1>{user.orgName} Applications</h1>
            <Link to={`${path}/create`} className="btn btn-sm btn-success mb-2">New Application</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Position</th>
                        <th style={{ width: '30%' }}>Contact Email</th>
                        <th style={{ width: '30%' }}>Deadline</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {applications && applications.map(application => {
                        const dueDate = new Date(application.due); 
                        const dueFormatted = `${dueDate.getMonth()+1}/${dueDate.getDate()+1}/${dueDate.getFullYear()}`
                        return (
                            <tr key={application.id}>
                            <td>{application.position} {application.firstName} {application.lastName}</td>
                            <td>{application.email}</td>
                            <td>{dueFormatted}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/submissions/${application.id}`} className="btn btn-sm btn-primary mr-1">View Submissions</Link>
                                <button onClick={() => deleteApplication(application.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={application.isDeleting}>
                                    {application.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                        )}
                        
                    )}
                    {!applications &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };