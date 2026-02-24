import { DefaultResponseType } from "../types/response.type";
import { OperationName } from "../config/config";
import { BodyRequestCategoryType } from "../types/request.type";
export declare class CategoriesService {
    static getCategories(type: OperationName): Promise<DefaultResponseType>;
    static getCategory(type: OperationName, id: string): Promise<DefaultResponseType>;
    static createCategory(type: OperationName, data: BodyRequestCategoryType): Promise<DefaultResponseType>;
    static editCategory(type: OperationName, data: BodyRequestCategoryType, id: string): Promise<DefaultResponseType>;
    static deleteCategory(type: OperationName, id: string): Promise<DefaultResponseType>;
}
//# sourceMappingURL=categories-service.d.ts.map