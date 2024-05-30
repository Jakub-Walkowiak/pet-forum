import { AccountEditData } from '../../../validators/account-validators'

export const generateAccountEditQuery = (data: AccountEditData, user: number) => {
    const setBlock = [
        data.accountName !== undefined ? `account_name = \'${data.accountName}\'` : '',
        data.displayName !== undefined ? `display_name = \'${data.displayName}\'` : '',
        data.email !== undefined ? `email = \'${data.email}\'` : '',
        data.likesVisible !== undefined ? `likes_visible = ${data.likesVisible}` : '',
        data.followedVisible !== undefined ? `followed_visible = ${data.followedVisible}` : '',
        data.profilePictureId !== undefined ? `profile_picture_id = ${data.profilePictureId}` : '',
        data.bio !== undefined ? `bio = \'${data.bio}\'` : '',
    ]
        .filter((string) => string !== '')
        .join(',')

    return setBlock.length === 0
        ? ''
        : `--sql
        UPDATE user_account
        SET ${setBlock}
        WHERE id = ${user}`
}
