import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CommonUtils} from "../../utils/common-utils";
import {OperationsService} from "../../services/operations-service";
import {OperationName, Page} from "../../config/config";
import {OpenNewRouteType} from "../../types/route.type";
import {ValidationType} from "../../types/validation.type";
import {ConfigUtils} from "../../utils/config-utils";
import {BodyRequestOperationType} from "../../types/request.type";
import {DefaultResponseType} from "../../types/response.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class CreateIE {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly typeName: string | null | undefined;
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

        this.typeName = UrlUtils.getUrlParam('type');
        if (!this.typeName) {
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

        DOMUtils.getById('buttonCreate')?.addEventListener('click', this.createOperation.bind(this));
        DOMUtils.getById('buttonCanceled')?.addEventListener('click', this.redirectToParentPage.bind(this));

        this.init().then();
    }

    private async init(): Promise<void> {
        if (!this.typeName) return;
        const operationName: OperationName | undefined = ConfigUtils.getOperationName(this.typeName);
        if (!operationName) return;

        CommonUtils.showTitlePage(Page.createOperation, operationName);

        if (this.typeSelectElement && this.categorySelectElement) {
            this.typeSelectElement.value = this.typeName;
            await CommonUtils.showCategories(this.typeSelectElement, this.categorySelectElement);
            this.typeSelectElement.addEventListener('change', CommonUtils.showCategories.bind(this, this.typeSelectElement, this.categorySelectElement));
        }
    }

    private async createOperation(): Promise<void | null> {
        if (!this.typeName || !this.typeSelectElement || !this.categorySelectElement || !this.costItemInputElement
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

            const result: DefaultResponseType = await OperationsService.createOperation(data);

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