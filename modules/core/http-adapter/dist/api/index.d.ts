export interface IApi {
    url: string;
    method: 'GET' | 'POST' | 'OPTION' | 'UPDATE' | 'DELETE' | 'PUT';
    jsonBody: boolean;
    auth?: boolean;
    options?: object;
}
export interface IApiGroup {
    [actionName: string]: IApi;
}
