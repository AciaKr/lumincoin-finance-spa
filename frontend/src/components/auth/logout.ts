import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {OpenNewRouteType} from "../../types/route.type";

export class Logout {
    private readonly openNewRoute: OpenNewRouteType;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {
        await AuthService.logOut();
        await this.openNewRoute('/login');
    }
}