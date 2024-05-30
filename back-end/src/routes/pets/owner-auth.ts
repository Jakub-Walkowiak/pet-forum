import { pool } from '../../helpers/pg-pool'

export const authOwnership = (pet: string, user: number) => {
    const verifySql = 'SELECT owner_id FROM pet_own WHERE pet_id = $1'

    return pool.query(verifySql, [pet]).then((result) => {
        return result.rows.map((row) => row.owner_id).includes(user)
    })
}
