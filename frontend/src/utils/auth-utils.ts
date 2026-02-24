import config from "../config/config";
import {AuthInfoType, TokenKeyName, UserInfoType} from "../types/auth.type";
import {DefaultResponseType, RefreshResponseType} from "../types/response.type";

export class AuthUtils {
    public static accessTokenKey: TokenKeyName = TokenKeyName.accessTokenKey;
    public static refreshTokenKey: TokenKeyName = TokenKeyName.refreshTokenKey;
    public static userInfoTokenKey: TokenKeyName = TokenKeyName.userInfoTokenKey;


    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static getAuthInfo(key: null): AuthInfoType;
    public static getAuthInfo(key: TokenKeyName): string | null;
    public static getAuthInfo(key: TokenKeyName | null = null): AuthInfoType | string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) return localStorage.getItem(key);

        return {
            accessToken: localStorage.getItem(this.accessTokenKey),
            refreshToken: localStorage.getItem(this.refreshTokenKey),
            userInfo: localStorage.getItem(this.userInfoTokenKey),
        };
    }

    public static async updateRefreshToken(): Promise<boolean> {
        const refreshToken = this.getAuthInfo(this.refreshTokenKey) as string | null;

        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    'refreshToken': refreshToken,
                })
            });

            if (response && response.status === 200) {
                const result: DefaultResponseType | RefreshResponseType = await response.json();
                if ((result as RefreshResponseType).tokens) {
                    this.setAuthInfo((result as RefreshResponseType).tokens.accessToken, (result as RefreshResponseType).tokens.refreshToken);
                    return true;
                }
            }
        }

        this.removeAuthInfo();
        return false;
    }
}