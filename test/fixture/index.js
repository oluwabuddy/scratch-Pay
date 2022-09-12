module.exports = {
    BASE_URL_V1 : '/api/v1',
    MEDICAL_PRACTICE_BASE_URL: 'https://qa-challenge-api.scratchpay.com/api',
    SETTLEMENT_DATE_REQUEST_PAYLOAD: {
        WITHOUT_INITIAL_DATE: {
            delay: 5
        },
        WITHOUT_DELAY_DATE: {
            initialDate: '2022-09-08'
        },
        WITH_INVALID_INITIAL_DATE: {
            delay: 5,
            initialDate: 'how your side',
        },
        WITH_INVALID_DELAY: {
            delay: 'I am invalid yeh',
            initialDate: '2022-09-08',
        },
        VALID: {
            delay: "5",
            initialDate: '2022-09-08'
        },
        WITH_WEEKEND_INITIAL_DATE: {
            delay: "5",
            initialDate: '2022-09-10'
        }
    },
    IS_BUSINESS_DATE_REQUEST_PAYLOAD: {
        WITHOUT_DATE: {},
        WITH_INVALID_DATE: {
            date: 'I am invalid and I know it'
        },
        WITH_VALID_BUSINESS_DATE: {
            date: '2022-09-09'
        },
        WITH_VALID_NON_BUSINESS_DATE: {
            date: '2022-09-10'
        },
    },
    MEDICAL_PRACTICE_AUTH_URL: 'https://qa-challenge-api.scratchpay.com/api/auth?email=gianna@hightable.test&password=thedantonio1',
}
