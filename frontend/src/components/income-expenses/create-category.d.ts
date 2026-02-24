import { OpenNewRouteType } from "../../types/route.type";
import { OperationName } from "../../config/config";
export declare class CreateCategory {
    private readonly openNewRoute;
    private readonly typeName;
    private readonly validations;
    private readonly nameCategoryElement;
    private readonly errorNameCategoryElement;
    constructor(openNewRoute: OpenNewRouteType, typeName: OperationName);
    private init;
    private createCategory;
    private redirectToParentPage;
}
//# sourceMappingURL=create-category.d.ts.map