import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import {DefaultResponseType, ErrorResponseType, LoginResponseType, SignupResponseType} from "../types/response.type";
import {BodyRequestLoginType, BodyRequestSignupType} from "../types/request.type";

export class AuthService {

    public static async logIn(data: BodyRequestLoginType): Promise<LoginResponseType | boolean> {
        const result: DefaultResponseType = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!(result.response as LoginResponseType).tokens || !(result.response as LoginResponseType).user))) {
            return false;
        }

        return result.response;
    }

    public static async signUp(data: BodyRequestSignupType): Promise<SignupResponseType | boolean> {
        const result: DefaultResponseType = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && !result.response.user)) {
            return false;
        }

        return result.response;
    }

    public static async logOut(): Promise<void> {
        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        AuthUtils.removeAuthInfo();
    }

    public static async getBalance(): Promise<any> {
        const result: DefaultResponseType = await HttpUtils.request('/balance');

        if (result.error || !result.response || (result.response && !isFinite(result.response.balance))) {
            return;
        }

        return result.response.balance;
    }
}