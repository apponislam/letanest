// Frontend error types

export type TErrorSource = {
    path: string | number;
    message: string;
};

export type TApiErrorResponse = {
    statusCode: number;
    message: string;
    errorSources?: TErrorSource[];
};

// Normalized error for UI
export type TClientError = {
    fieldErrors?: Record<string, string>;
    generalMessage: string;
};
