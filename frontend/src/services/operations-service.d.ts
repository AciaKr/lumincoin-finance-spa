import { DefaultResponseType } from "../types/response.type";
import { BodyRequestOperationType } from "../types/request.type";
export declare class OperationsService {
    static getOperations(query: string): Promise<DefaultResponseType>;
    static getOperation(id: string): Promise<DefaultResponseType>;
    static createOperation(data: BodyRequestOperationType): Promise<DefaultResponseType>;
    static editOperation(data: BodyRequestOperationType, id: string): Promise<DefaultResponseType>;
    static deleteOperation(id: string): Promise<DefaultResponseType>;
}
//# sourceMappingURL=operations-service.d.ts.map