import {ValidationType, OptionsType} from "../types/validation.type";

export class ValidationUtils {

    public static validateField(element: HTMLElement | null, options: OptionsType | undefined): boolean {
        if (element) {
            let valueInputElement: string = (element as HTMLInputElement).value;
            let conditionFul: boolean = !!valueInputElement;

            if (options) {
                if (options.hasOwnProperty('pattern')) {
                    conditionFul = !!(valueInputElement && valueInputElement.match(options.pattern));
                } else if (options.hasOwnProperty('compareTo')) {
                    conditionFul = !!(valueInputElement && valueInputElement === options.compareTo);
                } else if (options.hasOwnProperty('select') && element instanceof HTMLSelectElement) {
                    conditionFul = element.selectedIndex > 0;
                }
            }

            if (conditionFul) {
                element.classList.remove('is-invalid');
                return true;
            } else {
                element.classList.add('is-invalid');
                return false;
            }
        } else {
            return false;
        }
    }

    public static validateForm(validations: ValidationType[]): boolean {
        let isValid: boolean = true;

        for (let i: number = 0; i < validations.length; i++) {
            const validationField: ValidationType | undefined = validations[i];
            if (validationField) {
                if (!ValidationUtils.validateField(validationField.element, validationField.options)) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }
}