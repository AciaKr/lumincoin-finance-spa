import config, {OperationName, Page} from "../config/config";
import {CategoriesService} from "../services/categories-service";
import {CategoryResponseType, DefaultResponseType} from "../types/response.type";
import {ConfigUtils} from "./config-utils";
import {DOMUtils} from "./DOM-utils";

export class CommonUtils {

    public static showTitlePage(page: Page, type: OperationName): void {
        const titlePage: HTMLElement | null = DOMUtils.getById('title-page');
        if (!titlePage) return;

        switch (type) {
            case OperationName[OperationName.income]:
                titlePage.innerText = config.titlePage[page].income;
                break;
            case OperationName[OperationName.expense]:
                titlePage.innerText = config.titlePage[page].expense;
                break;
            default:
                titlePage.innerText = config.titlePage[page].default;
                break;
        }
    }

    public static async showCategories(typeElement: HTMLSelectElement, categoryElement: HTMLSelectElement): Promise<void> {
        if (!typeElement.value && !categoryElement) return;
        categoryElement.innerHTML = '';

        const operationName: OperationName | undefined = ConfigUtils.getOperationName(typeElement.value);
        if (!operationName) return;

        const result: DefaultResponseType = await CategoriesService.getCategories(operationName);
        if (result.error) {
            alert(result.response.message);
            return;
        }

        const categoriesList: CategoryResponseType[] = result.response;

        const optgroupElement: HTMLOptGroupElement = DOMUtils.createElement('optgroup', HTMLOptGroupElement, {
            label: 'Категория',
            innerHTML: '<option hidden selected>Категория...</option>'
        });
        categoryElement.appendChild(optgroupElement);

        for (let i: number = 0; i < categoriesList.length; i++) {
            const category: CategoryResponseType | undefined = categoriesList[i];
            if (!category) continue;

            const optionElement: HTMLOptionElement = DOMUtils.createElement('option', HTMLOptionElement, {
                value: category.title,
                innerText: category.title
            });
            optionElement.setAttribute('data-categoryId', category.id.toString());
            optgroupElement.appendChild(optionElement);
        }
    }

    public static updateModal(type: OperationName, url: string): void {
        DOMUtils.getById('modalDelete')?.addEventListener('show.bs.modal', (event: Event): void => {
            const targetLink: EventTarget | null = (event as FocusEvent).relatedTarget;
            const itemId: string | null = (targetLink as HTMLElement)?.getAttribute('data-bs-id');
            const modalText: HTMLElement | null = DOMUtils.getById('modalText');
            if (!modalText || !itemId) return;

            switch (type) {
                case OperationName[OperationName.income]:
                    modalText.innerText = 'Вы действительно хотите удалить категорию? Связанные доходы останутся без категории.'
                    break;
                case OperationName[OperationName.expense]:
                    modalText.innerText = 'Вы действительно хотите удалить категорию? Связанные расходы останутся без категории.'
                    break;
                default:
                    modalText.innerText = 'Вы действительно хотите удалить операцию?';
                    break;
            }

            DOMUtils.getById('modalDeleteButton')?.setAttribute('href', `${url}${itemId}`);
        })
    }
}