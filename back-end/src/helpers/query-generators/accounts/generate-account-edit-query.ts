import { AccountEditData } from '../../../validators/account-validators'

export const generateAccountEditQuery = (data: AccountEditData, user: number) => {
    const setBlock = [
        data.displayName !== undefined ? `display_name = \'${data.displayName}\'` : '',
        data.email !== undefined ? `email = \'${data.email}\'` : '',
        data.likeVisibility !== undefined ? `like_visibility = ${data.likeVisibility}` : '',
        data.followedVisibility !== undefined ? `followed_visible = ${data.followedVisibility}` : '',
        data.profilePictureId !== undefined ? `profile_picture_id = ${data.profilePictureId}` : '',
        data.bio !== undefined ? `bio = \'${data.bio}\'` : '',
    ].filter(string => string !== '').join(',')

    return setBlock.length === 0 ? '' : `--sql
        UPDATE user_account
        SET ${setBlock}
        WHERE id = ${user}`
}