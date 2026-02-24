import {HttpUtils} from "../utils/http-utils";
import {DefaultResponseType} from "../types/response.type";
import {BodyRequestOperationType} from "../types/request.type";

export class OperationsService {

    public static async getOperations(query: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/operations?period=${query}`);

        if (result.error || !result.response) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
        }

        return result;
    }

    public static async getOperation(id: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/operations/${id}`);

        if (result.error || !result.response || (result.response && !result.response.id)) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при запросе операции. Обратитесь в поддержку';
        }

        return result;
    }

    public static async createOperation(data: BodyRequestOperationType): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/operations`, 'POST', true, data);

        if (result.error || !result.response || (result.response && !result.response.id)) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при создании операции. Обратитесь в поддержку';
        }

        return result;
    }

    public static async editOperation(data: BodyRequestOperationType, id: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/operations/${id}`, 'PUT', true, data);

        if (result.error || !result.response || (result.response && !result.response.id)) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при редактировании операции. Обратитесь в поддержку';
        }

        return result;
    }

    public static async deleteOperation(id: string): Promise<DefaultResponseType> {
        const result: DefaultResponseType = await HttpUtils.request(`/operations/${id}`, 'DELETE', true);

        if (result.error || !result.response || (result.response && (result.response.message !== "Removed successfully"))) {
            result.error = true;
            result.response.error = true;
            result.response.message = 'Возникла ошибка при удалении операции. Обратитесь в поддержку';
        }

        return result;
    }
}