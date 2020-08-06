type UserTokenData = { id : number };

export function isUserToken(tokenData : unknown) : tokenData is UserTokenData {
    return Object(tokenData).hasOwnProperty('id');
}