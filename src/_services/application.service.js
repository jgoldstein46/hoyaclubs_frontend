import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const baseUrl = `${config.apiUrl}/applications`;

export const applicationService = {
    getAll,
    // getById,
    create,
    getByUserId,
    getByAppId,
    // update,
    delete: _delete,
};

function create(params) {
    // console.log("These are the submitted params: " + JSON.stringify(params)); 
    return fetchWrapper.post(baseUrl, params);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getByUserId(userId) {
    return fetchWrapper.get(`${baseUrl}/user/${userId}`);
}

function getByAppId(appId) {
    return fetchWrapper.get(`${baseUrl}/app/${appId}`); 
}

function _delete(appId) {
    return fetchWrapper.delete(`${baseUrl}/${appId}`); 
}
