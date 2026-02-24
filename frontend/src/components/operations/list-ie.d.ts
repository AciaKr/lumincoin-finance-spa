import { OpenNewRouteType } from "../../types/route.type";
import { OperationResponseType } from "../../types/response.type";
export declare class ListIE {
    private static openNewRoute;
    private readonly recordsElement;
    constructor(openNewRoute: OpenNewRouteType);
    private init;
    static getIE(e: Event | null): Promise<OperationResponseType[] | null | void>;
    private showRecords;
}
//# sourceMappingURL=list-ie.d.ts.map