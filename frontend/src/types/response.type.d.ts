export type DefaultResponseType = {
    error: boolean;
    response: any;
    redirect?: string;
};
export type ErrorResponseType = {
    error: boolean;
    message: string;
};
export type RefreshResponseType = {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
};
export type LoginResponseType = {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: {
        name: string;
        lastName: string;
        id: number;
    };
};
export type SignupResponseType = {
    user: {
        id: string;
        email: string;
        name: string;
        lastName: string;
    };
};
export type CategoryResponseType = {
    id: number;
    title: string;
};
export type OperationResponseType = {
    id: number;
    type: string;
    amount: number;
    date: string;
    comment: string;
    category: string;
};
//# sourceMappingURL=response.type.d.ts.map