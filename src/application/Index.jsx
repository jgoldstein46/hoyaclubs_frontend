import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { accountService } from '@/_services';
import { applicationService } from '@/_services'; 

import { Create } from './Create';
import { Details } from './Details'; 
import { List } from './List'; 
import { Submissions } from './Submissions'; 


function Application({ history, match }) {
    const { path } = match;

    // useEffect(() => {
    //     // redirect to home if already logged in
    //     if (accountService.userValue) {
    //         history.push('/');
    //     }
    // }, []);
    // console.log("application is being called"); 

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 mt-5">
                    <div className="card m-3">
                        <Switch>
                            <Route exact path={path} component={List} />
                            <Route path={`${path}/create`} component={Create} />
                            <Route path={`${path}/submissions/:id`} component={Submissions} /> 

                            {/* <Route path={`${path}/details/:id`} component={Details} />  */}
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Application };