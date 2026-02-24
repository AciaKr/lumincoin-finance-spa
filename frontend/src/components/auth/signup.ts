import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {OpenNewRouteType} from "../../types/route.type";
import {ValidationType} from "../../types/validation.type";
import {LoginResponseType, SignupResponseType} from "../../types/response.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class SignUp {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly validations: ValidationType[] | undefined;
    private readonly nameElement: HTMLInputElement | null | undefined;
    private readonly lastNameElement: HTMLInputElement | null | undefined;
    private readonly emailElement: HTMLInputElement | null | undefined;
    private readonly passwordElement: HTMLInputElement | null | undefined;
    private readonly confirmPasswordElement: HTMLInputElement | null | undefined;
    private readonly commonErrorElement: HTMLElement | null | undefined;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.nameElement = DOMUtils.getById('name', HTMLInputElement);
        this.lastNameElement = DOMUtils.getById('last-name', HTMLInputElement);
        this.emailElement = DOMUtils.getById('email', HTMLInputElement);
        this.passwordElement = DOMUtils.getById('password', HTMLInputElement);
        this.confirmPasswordElement = DOMUtils.getById('confirm-password', HTMLInputElement);
        this.commonErrorElement = DOMUtils.getById('common-error');

        this.validations = [
            {element: this.nameElement, options: {pattern: /^(?=.*[А-ЯA-Z])[А-ЯA-Zа-яa-z]+\s*$/}},
            {element: this.lastNameElement, options: {pattern: /^(?=.*[А-ЯA-Z])[А-ЯA-Zа-яa-z]+\s*$/}},
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/}},
            {element: this.confirmPasswordElement, options: {compareTo: this.passwordElement?.value || ''}},
        ]

        DOMUtils.getById('process-button')?.addEventListener('click', this.signUp.bind(this))
    }

    private async signUp(): Promise<void> {
        if (!this.emailElement || !this.passwordElement || !this.nameElement || !this.lastNameElement
            || !this.confirmPasswordElement || !this.commonErrorElement || !this.validations) return;

        this.commonErrorElement.style.display = 'none';

        for (const validation of this.validations) {
            if ((validation.element === this.confirmPasswordElement) && (validation.options && 'compareTo' in validation.options)) {
                validation.options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const resultSignUp: boolean | SignupResponseType = await AuthService.signUp({
                name: this.nameElement.value.trim(),
                lastName: this.lastNameElement.value.trim(),
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.confirmPasswordElement.value,
            });

            if (resultSignUp) {
                const resultLogIn: boolean | LoginResponseType = await AuthService.logIn({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: false,
                });

                if (resultLogIn && (resultLogIn as LoginResponseType).tokens !== undefined) {
                    AuthUtils.setAuthInfo((resultLogIn as LoginResponseType).tokens.accessToken, (resultLogIn as LoginResponseType).tokens.refreshToken, {
                        id: (resultLogIn as LoginResponseType).user.id,
                        name: (resultLogIn as LoginResponseType).user.name + ' ' + (resultLogIn as LoginResponseType).user.lastName
                    });

                    await this.openNewRoute('/');
                }
            } else {
                this.commonErrorElement.style.display = 'block';
            }

        }
    }
}