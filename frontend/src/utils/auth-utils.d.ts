import { AuthInfoType, TokenKeyName, UserInfoType } from "../types/auth.type";
export declare class AuthUtils {
    static accessTokenKey: TokenKeyName;
    static refreshTokenKey: TokenKeyName;
    static userInfoTokenKey: TokenKeyName;
    static setAuthInfo(accessToken: string, refreshToken: string, userInfo?: UserInfoType | null): void;
    static removeAuthInfo(): void;
    static getAuthInfo(key: null): AuthInfoType;
    static getAuthInfo(key: TokenKeyName): string | null;
    static updateRefreshToken(): Promise<boolean>;
}
//# sourceMappingURL=auth-utils.d.ts.map