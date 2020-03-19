import users from '../../dummy-data/users'

export const FETCH_USERS = 'fetch_users'


export const fetchUsers = () => {

    let fetchedUsers = users

    return { type: FETCH_USERS, fetchedUsers }
}