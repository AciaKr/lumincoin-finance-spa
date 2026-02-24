import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OpenNewRouteType} from "../../types/route.type";
import {OperationName} from "../../config/config";
import {DefaultResponseType} from "../../types/response.type";

export class DeleteCategory {
    private readonly openNewRoute: OpenNewRouteType;
    private readonly typeName: OperationName;
    private readonly id: string | null | undefined;

    constructor(openNewRoute: OpenNewRouteType, typeName: OperationName) {
        this.openNewRoute = openNewRoute;
        this.typeName = typeName;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            this.openNewRoute(`/${this.typeName}`).then();
            return;
        }

        this.deleteCategory().then();
    }

    private async deleteCategory(): Promise<void | null> {
        if (!this.id) return;

        const result: DefaultResponseType = await CategoriesService.deleteCategory(this.typeName, this.id);

        if (result.error) {
            if (result.response.error && result.response.message) {
                alert(result.response.message);
            }
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        return this.openNewRoute(`/${this.typeName}`);
    }
}