import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const baseUrl = `${config.apiUrl}/submissions`;

export const subService = {
    getAll,
    // getById,
    create,
    getByOrgId,
    getByAppId,
    // update,
    // delete: _delete,
};

function create(params) {
    console.log("These are the submitted params: " + JSON.stringify(params)); 
    return fetchWrapper.post(baseUrl, params);
}

function getByOrgId(orgId) {
    return fetchWrapper.get(`${baseUrl}/org/${orgId}`);
}

function getAll() {
    return fetchWrapper.get(baseUrl); 
}

function getByAppId(appId) {
    return fetchWrapper.get(`${baseUrl}/app/${appId}`); 
}