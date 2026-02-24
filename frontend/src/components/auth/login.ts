import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {OpenNewRouteType} from "../../types/route.type";
import {ValidationType} from "../../types/validation.type";
import {LoginResponseType} from "../../types/response.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class Login {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly validations: ValidationType[] | undefined;
    private readonly emailElement: HTMLInputElement | null | undefined;
    private readonly passwordElement: HTMLInputElement | null | undefined;
    private readonly rememberMeElement: HTMLInputElement | null | undefined;
    private readonly commonErrorElement: HTMLElement | null | undefined;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.emailElement = DOMUtils.getById('email', HTMLInputElement);
        this.passwordElement = DOMUtils.getById('password', HTMLInputElement);
        this.rememberMeElement = DOMUtils.getById('remember-me', HTMLInputElement);
        this.commonErrorElement = DOMUtils.getById('common-error');

        this.validations = [
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}},
            {element: this.passwordElement},
        ]

        DOMUtils.getById('process-button')?.addEventListener('click', this.login.bind(this));
    }

    private async login(): Promise<void> {
        if (!this.commonErrorElement || !this.emailElement || !this.passwordElement || !this.rememberMeElement) return;
        this.commonErrorElement.style.display = 'none';

        if (this.validations && ValidationUtils.validateForm(this.validations)) {
            const result: boolean | LoginResponseType = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });

            if (result && (result as LoginResponseType).tokens !== undefined) {
                AuthUtils.setAuthInfo((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken, {
                    id: (result as LoginResponseType).user.id,
                    name: (result as LoginResponseType).user.name + ' ' + (result as LoginResponseType).user.lastName
                });

                await this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}