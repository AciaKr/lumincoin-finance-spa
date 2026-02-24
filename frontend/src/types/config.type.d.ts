import { OperationName, Page } from "../config/config";
type Config = {
    host: string | undefined;
    api: string | undefined;
    titlePage: TitlePage;
};
type TitlePage = {
    [p in Page]: TitleText;
};
type TitleText = {
    [operation in OperationName]: string;
};
export default Config;
//# sourceMappingURL=config.type.d.ts.map