import { LoginResponseType, SignupResponseType } from "../types/response.type";
import { BodyRequestLoginType, BodyRequestSignupType } from "../types/request.type";
export declare class AuthService {
    static logIn(data: BodyRequestLoginType): Promise<LoginResponseType | boolean>;
    static signUp(data: BodyRequestSignupType): Promise<SignupResponseType | boolean>;
    static logOut(): Promise<void>;
    static getBalance(): Promise<any>;
}
//# sourceMappingURL=auth-service.d.ts.map