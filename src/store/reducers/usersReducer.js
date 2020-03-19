import { FETCH_USERS } from "../actions/usersActions"

const initialValues = {
    users: []
}

export default usersReducer = (state = initialValues, action) => {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                users: action.fetchedUsers
            }
        default: return state
    }
}