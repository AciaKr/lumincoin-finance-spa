import {OperationName} from "../../config/config";
import {AuthUtils} from "../../utils/auth-utils";
import {ToolbarUtils} from "../../utils/toolbar-utils";
import {CommonUtils} from "../../utils/common-utils";
import {OperationsService} from "../../services/operations-service";
import {OpenNewRouteType} from "../../types/route.type";
import {DefaultResponseType, OperationResponseType} from "../../types/response.type";
import {DOMUtils} from "../../utils/DOM-utils";

export class ListIE {
    private static openNewRoute: OpenNewRouteType;
    private readonly recordsElement: HTMLElement | null;

    constructor(openNewRoute: OpenNewRouteType) {
        ListIE.openNewRoute = openNewRoute;
        this.recordsElement = DOMUtils.getById('records');

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            ListIE.openNewRoute('/login').then();
            return;
        }

        DOMUtils.getById('toolbar-period')?.addEventListener('click', this.init.bind(this));

        const rangeElements = document.querySelectorAll('#range-date input') as NodeListOf<HTMLInputElement>;
        if (rangeElements && rangeElements.length > 0) {
            for (let rangeElement of rangeElements) {
                rangeElement.addEventListener('click', ToolbarUtils.showRangeDate);
                rangeElement.addEventListener('change', this.init.bind(this));
            }
        }

        this.init().then();
    }

    private async init(e: Event | null = null): Promise<void | null> {
        const operations: OperationResponseType[] | null | void = await ListIE.getIE(e);
        
        if (operations) {
            this.showRecords(operations);
            CommonUtils.updateModal(OperationName.default, '/operations/delete?id=');
        }
    }

    public static async getIE(e: Event | null): Promise<OperationResponseType[] | null | void> {
        const query: string = ToolbarUtils.getQuery(e);

        const result: DefaultResponseType = await OperationsService.getOperations(query);

        if (result.error) {
            if (result.response.error && result.response.message) {
                alert(result.response.message);
            }
            return result.redirect ? ListIE.openNewRoute(result.redirect) : null;
        }

        return result.response;
    }

    private showRecords(operations: OperationResponseType[]): void {
        if (!this.recordsElement) return;
        this.recordsElement.innerHTML = '';

        for (let i: number = 0; i < operations.length; i++) {
            const operation: OperationResponseType | undefined = operations[i];
            if (!operation) continue;

            const trElement: HTMLTableRowElement = DOMUtils.createElement('tr', HTMLTableRowElement);
            trElement.insertAdjacentHTML('afterbegin', `<th scope="row">${i + 1}</th>`);
            trElement.insertCell().innerHTML = '<span class="text-' +
                (operation.type === OperationName.expense ? 'danger' : 'success') + '">' +
                (operation.type === OperationName.expense ? 'расход' : 'доход') + '</span>';
            trElement.insertCell().innerText = operation.category ? operation.category.toLowerCase() : 'без категории';
            trElement.insertCell().innerText = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            }).format(operation.amount);
            trElement.insertCell().innerText = (new Date(operation.date)).toLocaleDateString('ru-RU');
            trElement.insertCell().innerText = operation.comment && operation.comment.toLowerCase();
            trElement.insertAdjacentHTML('beforeend', '<td class="item-tools">' +
                '<a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#modalDelete" data-bs-id="' + operation.id + '">' +
                '<i class="fas fa-trash-can"></i></a>' +
                '<a href="/operations/edit?id=' + operation.id + '"><i class="fas fa-pencil"></i></a>' +
                '</td>');

            this.recordsElement.appendChild(trElement);
        }
    }
}