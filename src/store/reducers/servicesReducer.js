import { FETCH_DATA } from "../actions/servicesActions"

const initialValues = {
    services: {}
}

export default feedReducer = (state = initialValues, action) => {
    switch (action.type) {
        case FETCH_DATA:
            return {
                ...state,
                services: action.fetchedData
            }
        default: return state
    }
}