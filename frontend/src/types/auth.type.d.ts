export declare const enum TokenKeyName {
    accessTokenKey = "accessToken",
    refreshTokenKey = "refreshToken",
    userInfoTokenKey = "userInfo"
}
export type TokenKeyNameType = {
    [key in TokenKeyName]: string;
};
export type AuthInfoType = {
    [TokenKeyName.accessTokenKey]: string | null;
    [TokenKeyName.refreshTokenKey]: string | null;
    [TokenKeyName.userInfoTokenKey]: string | null;
};
export type UserInfoType = {
    id: number;
    name: string;
};
//# sourceMappingURL=auth.type.d.ts.map