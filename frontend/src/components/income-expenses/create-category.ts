import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {CategoriesService} from "../../services/categories-service";
import {DefaultResponseType} from "../../types/response.type";
import {BodyRequestCategoryType} from "../../types/request.type";
import {OpenNewRouteType} from "../../types/route.type";
import {OperationName, Page} from "../../config/config";
import {ValidationType} from "../../types/validation.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class CreateCategory {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly typeName: OperationName;
    private readonly validations: ValidationType[] | undefined;
    private readonly nameCategoryElement: HTMLInputElement | null | undefined;
    private readonly errorNameCategoryElement: HTMLElement | null | undefined;

    constructor(openNewRoute: OpenNewRouteType, typeName: OperationName) {
        this.openNewRoute = openNewRoute;
        this.typeName = typeName;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.nameCategoryElement = DOMUtils.getById('nameCategory',HTMLInputElement);
        this.errorNameCategoryElement = DOMUtils.getById('nameCategory-error');
        if (!this.nameCategoryElement) {
            this.redirectToParentPage();
            return;
        }

        this.validations = [
            {element: this.nameCategoryElement}
        ];

        this.init();
    }

    private init(): void {
        CommonUtils.showTitlePage(Page.createCategory, this.typeName);

        DOMUtils.getById('buttonCategoryCreate')?.addEventListener('click', this.createCategory.bind(this));
        DOMUtils.getById('buttonCategoryCanceled')?.addEventListener('click', this.redirectToParentPage.bind(this));
    }

    private async createCategory(): Promise<void | null> {
        if (!this.nameCategoryElement || !this.errorNameCategoryElement) return;
        this.errorNameCategoryElement.innerText = 'Введите название категории';

        if (this.validations && ValidationUtils.validateForm(this.validations)) {
            const data: BodyRequestCategoryType = {
                title: this.nameCategoryElement.value,
            };

            const result: DefaultResponseType = await CategoriesService.createCategory(this.typeName, data);

            if (result.error) {
                if (result.response.error && result.response.message) {
                    alert(result.response.message);
                } else if (!result.response.error) {
                    this.errorNameCategoryElement.innerText = result.response.message;
                    this.nameCategoryElement.classList.add('is-invalid');
                }
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }

            this.redirectToParentPage();
        }
    }

    private redirectToParentPage(): void {
        this.openNewRoute(`/${this.typeName}`).then();
    }
}