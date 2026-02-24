import {HttpUtils} from "../utils/http-utils";
import {DefaultResponseType} from "../types/response.type";
import {OperationName} from "../config/config";
import {BodyRequestCategoryType} from "../types/request.type";

export class CategoriesService {

    public static async getCategories(type: OperationName): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/categories/${type}`);

        if (result.error || !result.response) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при запросе категорий. Обратитесь в поддержку';
        }

        return result;
    }

    public static async getCategory(type: OperationName, id: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/categories/${type}/${id}`);

        if (result.error || !result.response || (result.response && (!result.response.id || !result.response.title))) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при запросе категории. Обратитесь в поддержку';
        }

        return result;
    }

    public static async createCategory(type: OperationName, data: BodyRequestCategoryType): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/categories/${type}`, 'POST', true, data);

        if (result.error || !result.response) {
            result.error = true;
            if (result.response && result.response.error && (result.response.message === "This record already exists")) {
                result.response.error = false;
                result.response.message = 'Указанное название категории уже существует';
            } else {
                result.response.error = true;
                result.response.message = 'Возникла ошибка при добавлении категории. Обратитесь в поддержку';
            }
        }

        return result;
    }

    public static async editCategory(type: OperationName, data: BodyRequestCategoryType, id: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/categories/${type}/${id}`, 'PUT', true, data);

        if (result.error || !result.response || (result.response && (!result.response.id || !result.response.title))) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при обновлении категории. Обратитесь в поддержку';
        }

        return result;
    }

    public static async deleteCategory(type: OperationName, id: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/categories/${type}/${id}`, 'DELETE', true);

        if (result.error || !result.response || (result.response && (result.response.message !== "Removed successfully"))) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при удалении категории. Обратитесь в поддержку';
        }

        return result;
    }
}