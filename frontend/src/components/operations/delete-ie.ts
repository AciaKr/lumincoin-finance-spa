import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-service";
import {OpenNewRouteType} from "../../types/route.type";
import {DefaultResponseType} from "../../types/response.type";

export class DeleteIE{
    private readonly openNewRoute: OpenNewRouteType;
    private readonly id: string | null | undefined;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            this.openNewRoute('/operations').then();
            return;
        }

        this.deleteOperation().then();
    }

    private async deleteOperation(): Promise<void | null> {
        if (!this.id) return;

        const result: DefaultResponseType = await OperationsService.deleteOperation(this.id);

        if (result.error) {
            if (result.response.error && result.response.message) {
                alert(result.response.message);
            }
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        return this.openNewRoute('/operations');
    }
}