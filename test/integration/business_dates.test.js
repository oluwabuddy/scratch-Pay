const fixtures = require('../fixture');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app =  require('../..');
chai.use(chaiHttp);
const { expect } = chai;


describe('Integration Test for Business Dates APIs', () => {
 describe('GET /api/v1/settlementDate', () => {
    const settlementDateRoute = `${fixtures.BASE_URL_V1}/settlementDate`;
    it(`should validate that the API returns an error (400 status code) if the "initialDate" field is not passed`, async () => {
        const response = await chai.request(app).get(settlementDateRoute)
                                        .query(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.WITHOUT_INITIAL_DATE);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('errorMessage');
            expect(response.body).to.have.property('ok', false);
    });
    it(`should validate that the API returns an error (400 status code) if the "delay" field is not passed`, async () => {
        const response = await chai.request(app).get(settlementDateRoute)
                                        .query(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.WITHOUT_DELAY_DATE);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('errorMessage');
            expect(response.body).to.have.property('ok', false);
    });
    it(`should validate that the API returns an error (400 status code) if the "initialDate" value is invalid`, async () => {
        const response = await chai.request(app).get(settlementDateRoute)
                                        .query(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.WITH_INVALID_INITIAL_DATE);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('errorMessage');
            expect(response.body).to.have.property('ok', false);
    });
    it(`should validate that the API returns an error (400 status code) if the "delay" value is invalid`, async () => {
        const response = await chai.request(app).get(settlementDateRoute)
                                        .query(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.WITH_INVALID_DELAY);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('errorMessage');
            expect(response.body).to.have.property('ok', false);
    });
    it(`should return a successful response if valid "initialDate" and "delay" query values are passed`, async () => {
        const response = await chai.request(app).get(settlementDateRoute)
                                        .query(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.VALID);
            expect(response).to.have.status(200);
            expect(response.body).to.have.property('ok', true);
            expect(response.body).to.have.property('initialQuery');
            expect(response.body.initialQuery).to.deep.equal(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.VALID)
            expect(response.body).to.have.property('results');
            expect(response.body.results).to.have.property('businessDate');
            expect(new Date(response.body.results.businessDate) != 'Invalid Date').to.be.true;
    });
    it(`should account for weekends (saturday and sunday) in calculating the correct settlement date`, async () => {
        const response = await chai.request(app).get(settlementDateRoute)
                                        .query(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.WITH_WEEKEND_INITIAL_DATE);
            expect(response).to.have.status(200);
            const resultingDate = new Date(response.body.results.businessDate.split('T')[0]);
            let actualDate = new Date(fixtures.SETTLEMENT_DATE_REQUEST_PAYLOAD.WITH_WEEKEND_INITIAL_DATE.initialDate);
            actualDate.setDate(actualDate.getDate() + 7);
            expect(resultingDate.getTime()).to.eql(actualDate.getTime());
    });
 })
 describe('GET /api/v1/isBusinessDay', () => {
    const isBusinessDayRoute = `${fixtures.BASE_URL_V1}/isBusinessDay`;
    it('should return an error response with 400 status code if the "date" field is not passed', async () => {
        const response = await chai.request(app).get(isBusinessDayRoute).query(fixtures.IS_BUSINESS_DATE_REQUEST_PAYLOAD.WITHOUT_DATE);
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('errorMessage');
        expect(response.body).to.have.property('ok', false);
    });
    it('should validate the date passed and return an error response with a 400 status code if the date is invalid', async () => {
        const response = await chai.request(app).get(isBusinessDayRoute).query(fixtures.IS_BUSINESS_DATE_REQUEST_PAYLOAD.WITH_INVALID_DATE);
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('errorMessage');
        expect(response.body).to.have.property('ok', false);
    });
    it('should return a success response with the "results" value as true if the date passed is a valid business date', async () => {
        const response = await chai.request(app).get(isBusinessDayRoute).query(fixtures.IS_BUSINESS_DATE_REQUEST_PAYLOAD.WITH_VALID_BUSINESS_DATE);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('results', true);
        expect(response.body).to.have.property('ok', true);
    });
    it('should return a success response with the "results" value as false if the date passed falls on a weekend', async () => {
        const response = await chai.request(app).get(isBusinessDayRoute).query(fixtures.IS_BUSINESS_DATE_REQUEST_PAYLOAD.WITH_VALID_NON_BUSINESS_DATE);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('results', false);
        expect(response.body).to.have.property('ok', true);
    });
 });
})