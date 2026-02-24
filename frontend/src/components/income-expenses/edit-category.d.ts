import { OpenNewRouteType } from "../../types/route.type";
import { OperationName } from "../../config/config";
export declare class EditCategory {
    private readonly openNewRoute;
    private readonly typeName;
    private readonly id;
    private readonly validations;
    private readonly nameCategoryElement;
    private currentCategory;
    constructor(openNewRoute: OpenNewRouteType, typeName: OperationName);
    private init;
    private saveCategory;
    private redirectToParentPage;
}
//# sourceMappingURL=edit-category.d.ts.map