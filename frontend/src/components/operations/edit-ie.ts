import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CommonUtils} from "../../utils/common-utils";
import {OperationsService} from "../../services/operations-service";
import {BodyRequestOperationType} from "../../types/request.type";
import {OpenNewRouteType} from "../../types/route.type";
import {ValidationType} from "../../types/validation.type";
import {DefaultResponseType, OperationResponseType} from "../../types/response.type";
import {Page} from "../../config/config";
import {DOMUtils} from "../../utils/DOM-utils";

export class EditIE {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly id: string | null | undefined;
    private readonly validations: ValidationType[] | undefined;
    private readonly typeSelectElement: HTMLSelectElement | null | undefined;
    private readonly categorySelectElement: HTMLSelectElement | null | undefined;
    private readonly costItemInputElement: HTMLInputElement | null | undefined;
    private readonly dateItemInputElement: HTMLInputElement | null | undefined;
    private readonly commentItemInputElement: HTMLTextAreaElement | null | undefined;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            this.redirectToParentPage();
            return;
        }

        this.typeSelectElement = DOMUtils.getById('typeSelect', HTMLSelectElement);
        this.categorySelectElement = DOMUtils.getById('categorySelect', HTMLSelectElement);
        this.costItemInputElement = DOMUtils.getById('costItemInput', HTMLInputElement);
        this.dateItemInputElement = DOMUtils.getById('dateItemInput', HTMLInputElement);
        this.commentItemInputElement = DOMUtils.getById('commentItemInput', HTMLTextAreaElement);

        this.validations = [
            {element: this.typeSelectElement},
            {element: this.categorySelectElement, options: {select: true}},
            {element: this.costItemInputElement},
            {element: this.dateItemInputElement},
            {element: this.commentItemInputElement},
        ];

        DOMUtils.getById('buttonSave')?.addEventListener('click', this.updateOperation.bind(this));
        DOMUtils.getById('buttonCanceled')?.addEventListener('click', this.redirectToParentPage.bind(this));

        this.init().then();
    }

    private async init(): Promise<void | null> {
        if (!this.id) return;

        const result: DefaultResponseType = await OperationsService.getOperation(this.id);

        if (result.error) {
            if (result.response.error && result.response.message) {
                alert(result.response.message);
            }
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        CommonUtils.showTitlePage(Page.editOperation, result.response.type);
        await this.showCurrentOperation(result.response);
    }

    private async showCurrentOperation(operation: OperationResponseType): Promise<void> {
        if (!this.typeSelectElement || !this.categorySelectElement || !this.costItemInputElement
            || !this.dateItemInputElement || !this.commentItemInputElement) return;

        this.typeSelectElement.value = operation.type;
        await CommonUtils.showCategories(this.typeSelectElement, this.categorySelectElement);
        for (let i: number = 0; i < this.categorySelectElement.options.length; i++) {
            const optionCategory: HTMLOptionElement | undefined = this.categorySelectElement.options[i];
            if (optionCategory && optionCategory.value === operation.category) {
                this.categorySelectElement.selectedIndex = i;
            }
        }

        this.costItemInputElement.value = operation.amount.toString();
        this.dateItemInputElement.value = operation.date;
        this.commentItemInputElement.value = operation.comment;
    }

    private async updateOperation(): Promise<void | null> {
        if (!this.id || !this.typeSelectElement || !this.categorySelectElement || !this.costItemInputElement
            || !this.dateItemInputElement || !this.commentItemInputElement) return;
        const SelectCategoryId: string | null | undefined = this.categorySelectElement.options[this.categorySelectElement.selectedIndex]?.getAttribute('data-categoryId');

        if (SelectCategoryId && this.validations && ValidationUtils.validateForm(this.validations)) {
            const data: BodyRequestOperationType = {
                type: this.typeSelectElement.value,
                category_id: +SelectCategoryId,
                amount: +this.costItemInputElement.value,
                date: this.dateItemInputElement.value,
                comment: this.commentItemInputElement.value
            }

            const result: DefaultResponseType = await OperationsService.editOperation(data, this.id);

            if (result.error) {
                if (result.response.error && result.response.message) {
                    alert(result.response.message);
                }
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }

            this.redirectToParentPage();
        }
    }

    private redirectToParentPage(): void {
        this.openNewRoute('/operations').then();
    }
}