const fixtures = require('../fixture');
const chai = require('chai');
const axios = require('axios').default;
const chaiHttp = require('chai-http');
const app =  require('../..');
chai.use(chaiHttp);
const { expect } = chai;

describe('Integration Tests for Medical Practice APIs', () => {
    let token;
    before(async () => {
        const response = await axios.get(fixtures.MEDICAL_PRACTICE_AUTH_URL);
        token = response.data.data.session.token;
    });
describe('GET https://qa-challenge-api.scratchpay.com/api/clinics/:id/emails', () => {
    const apiEmailRoute = `${fixtures.MEDICAL_PRACTICE_BASE_URL}/clinics/2/emails`;
    it ('should return an authentication error response (401) if the authorization token is not passed', async () => {
        const response = await axios.get(apiEmailRoute, {
            headers: {},
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
        expect(response.status).to.eql(401);
    });
    it ('should return an authentication error response (401) if an invalid authorization token is passed', async () => {
        const response = await axios.get(apiEmailRoute, {
            headers: {
                Authorization: 'Bearer invalid token'
            },
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
        expect(response.status).to.eql(401);
    });
    it('should prevent a user from accessing a list of emails', async () => {
        const response = await axios.get(apiEmailRoute, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
    });

    it('should return a 403 status code with indicates the user is not permitted to view the list of emails although logged in', async () => {
        const response = await axios.get(apiEmailRoute, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: false
        });
        expect(response.status).to.eql(403);
    });

    it('should validate ID parameter and ensure a numeric string is passed', async () => {
        const incorrectPath = `${fixtures.MEDICAL_PRACTICE_BASE_URL}/clinics/invalid-ID/emails`;
        const response = await axios.get(incorrectPath, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: false
        });
        expect(response.status).to.eql(400);
        expect(response.data).to.have.property('ok', false);
        expect(response.data.data.error).to.not.eql('Error: User does not have permissions');
    })
})
describe('GET https://qa-challenge-api.scratchpay.com/api/clinics?term=<search term>', () => {
    const searchRoute = `${fixtures.MEDICAL_PRACTICE_BASE_URL}/clinics`;
    it('should prevent user from using the API if the user is not logged in (401 error check)', async () => {
        const response = await axios.get(`${searchRoute}?term=veterinary`, {
            headers: {},
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
        expect(response.status).to.eql(401);
    });

    it('should prevent user from using the API if the user passes through as invalid token (401 error check)', async () => {
        const response = await axios.get(`${searchRoute}?term=veterinary`, {
            headers: {
                Authorization: 'Invalid'
            },
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
        expect(response.status).to.eql(401);
    });

    it('should validate that the search "term" field is passed as a query to the API for a logged in user', async () => {
        const response = await axios.get(searchRoute, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
        expect([400, 422]).to.include(response.status);
        expect(response.data).to.have.property('error')
    });

    it('should validate that whitespaces only is not an acceptable value for the search "term" field', async () => {
        const response = await axios.get(`${searchRoute}?term=   `, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', false);
        expect([400, 422]).to.include(response.status);
    });

    it('should response successfully with a list of clinics that matches the search term "veterinary" for logged in users', async () => {
        const response = await axios.get(`${searchRoute}?term=veterinary`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: false
        });
        expect(response.data).to.have.property('ok', true);
        expect(response.status).to.eql(200);
        expect(response.data).to.have.property('data')
        expect(response.data.data.length).to.not.eql(0);
    });
})
});