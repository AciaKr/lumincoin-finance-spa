import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {CategoriesService} from "../../services/categories-service";
import {OpenNewRouteType} from "../../types/route.type";
import {OperationName, Page} from "../../config/config";
import {CategoryResponseType, DefaultResponseType} from "../../types/response.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class ListCategories {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly typeName: OperationName;

    constructor(openNewRoute: OpenNewRouteType, typeName: OperationName) {
        this.openNewRoute = openNewRoute;
        this.typeName = typeName;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.init().then();
    }

    private async init(): Promise<void> {
        CommonUtils.showTitlePage(Page.listCategories, this.typeName);

        await this.getCategoriesList();
        this.showElementCreateCategory();
    }

    private async getCategoriesList(): Promise<void | null> {
        const result: DefaultResponseType = await CategoriesService.getCategories(this.typeName);

        if (result.error) {
            if (result.response.error && result.response.message) {
                alert(result.response.message);
            }
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        this.showCategories(result.response);
        CommonUtils.updateModal(this.typeName, `/${this.typeName}/delete-category?id=`);
    }

    private createCardBodyElement(): HTMLDivElement {
        const divElement: HTMLDivElement = DOMUtils.createElement('div', HTMLDivElement, {
            className: 'col-xl-4 col-md-6 col-sm-12'
        });

        const cardElement: HTMLDivElement = DOMUtils.createElement('div', HTMLDivElement, {
            className: 'card'
        });

        const cardBodyElement: HTMLDivElement = DOMUtils.createElement('div', HTMLDivElement, {
            className: 'card-body'
        });

        cardElement.appendChild(cardBodyElement);
        divElement.appendChild(cardElement);

        DOMUtils.getById('categoriesList')?.appendChild(divElement);

        return cardBodyElement;
    }

    private showCategories(categoriesList: CategoryResponseType[]): void {
        for (let i: number = 0; i < categoriesList.length; i++) {
            const category: CategoryResponseType | undefined = categoriesList[i];
            if (!category) continue;

            const cardTitleElement: HTMLHeadingElement = DOMUtils.createElement('h5', HTMLHeadingElement, {
                className: 'card-title',
                innerText: category.title,
            });

            const cardActionElement: HTMLDivElement = DOMUtils.createElement('div', HTMLDivElement, {
                className: 'd-flex align-items-center gap-2',
                innerHTML: '<a href="/' + this.typeName + '/edit-category?id=' + category.id + '" class="btn btn-primary">Редактировать</a>' +
                    '<a href="javascript:void(0)" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelete" data-bs-id="' + category.id + '"  id="modalCategory">Удалить</a>'
            });

            const cardBodyElement: HTMLDivElement = this.createCardBodyElement();
            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(cardActionElement);
        }
    }

    private showElementCreateCategory(): void {
        this.createCardBodyElement().innerHTML = '<a href="/' + this.typeName + '/create-category" class="card-add">+</a>';
    }
}