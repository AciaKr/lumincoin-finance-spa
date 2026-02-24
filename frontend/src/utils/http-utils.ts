import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {ParamsRequestType} from "../types/request.type";
import {DefaultResponseType} from "../types/response.type";

export class HttpUtils {

    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<DefaultResponseType> {
        const result: DefaultResponseType = {
            error: false,
            response: null
        }

        const params: ParamsRequestType = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token: string | null = null;

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string | null;

            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    // 1. токена нет
                    result.redirect = '/login';
                } else {
                    // 2. токен устарел (надо обновить его)
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        // запрос повторить
                        await this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}