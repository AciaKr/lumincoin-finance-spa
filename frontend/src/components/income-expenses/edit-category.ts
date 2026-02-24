import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CommonUtils} from "../../utils/common-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {CategoriesService} from "../../services/categories-service";
import {BodyRequestCategoryType} from "../../types/request.type";
import {OpenNewRouteType} from "../../types/route.type";
import {OperationName, Page} from "../../config/config";
import {ValidationType} from "../../types/validation.type";
import {CategoryResponseType, DefaultResponseType} from "../../types/response.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class EditCategory {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly typeName: OperationName;
    private readonly id: string | null | undefined;
    private readonly validations: ValidationType[] | undefined;
    private readonly nameCategoryElement: HTMLInputElement | null | undefined;
    private currentCategory: CategoryResponseType | null = null;

    constructor(openNewRoute: OpenNewRouteType, typeName: OperationName) {
        this.openNewRoute = openNewRoute;
        this.typeName = typeName;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.id = UrlUtils.getUrlParam('id');
        this.nameCategoryElement = DOMUtils.getById('nameCategory', HTMLInputElement);
        if (!this.id || !this.nameCategoryElement) {
            this.redirectToParentPage();
            return;
        }

        this.validations = [
            {element: this.nameCategoryElement}
        ];

        this.init().then();
    }

    private async init(): Promise<void | null> {
        if (!this.id) return;

        CommonUtils.showTitlePage(Page.editCategory, this.typeName);

        const result: DefaultResponseType = await CategoriesService.getCategory(this.typeName, this.id);

        if (result.error) {
            if (result.response.error && result.response.message) {
                alert(result.response.message);
            }
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        this.currentCategory = result.response;
        if (this.currentCategory && this.nameCategoryElement) {
            this.nameCategoryElement.value = this.currentCategory.title;
        }

        DOMUtils.getById('buttonCategorySave')?.addEventListener('click', this.saveCategory.bind(this));
        DOMUtils.getById('buttonCategoryCanceled')?.addEventListener('click', this.redirectToParentPage.bind(this));
    }

    private async saveCategory(): Promise<void | null> {
        if (!this.id || !this.nameCategoryElement) return;

        if (this.validations && ValidationUtils.validateForm(this.validations)) {
            if (this.currentCategory && (this.nameCategoryElement.value.trim() !== this.currentCategory.title)) {
                const data: BodyRequestCategoryType = {
                    title: this.nameCategoryElement.value,
                };

                const result: DefaultResponseType = await CategoriesService.editCategory(this.typeName, data, this.id);

                if (result.error) {
                    if (result.response.error && result.response.message) {
                        alert(result.response.message);
                    }
                    return result.redirect ? this.openNewRoute(result.redirect) : null;
                }
            }

            this.redirectToParentPage();
        }
    }

    private redirectToParentPage(): void {
        this.openNewRoute(`/${this.typeName}`).then();
    }
}