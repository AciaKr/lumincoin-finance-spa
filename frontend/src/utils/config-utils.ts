import {OperationName} from "../config/config";

export class ConfigUtils {

    public static getOperationName(value: string): OperationName | undefined {
        const typeValue: string = value;
        return Object.values(OperationName).includes(typeValue as OperationName)
            ? (typeValue as OperationName)
            : undefined;
    }
}