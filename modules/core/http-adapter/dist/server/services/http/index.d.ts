import { IApi } from '../../../api';
declare type RequestOption = {
    headers: any;
    uri: string;
    method: 'GET' | 'POST' | 'UPDATE' | 'OPTION' | 'DELETE' | 'PUT';
    json: boolean;
    forever: boolean;
    timeout: number;
    data?: any;
    qs?: any;
    body?: any;
    form?: any;
};
declare type AppSign = {
    key: string;
    secret: string;
};
export declare type OnHeaderReadyHook = (option: any) => any;
export declare type OnOptionReadyHook = (option: RequestOption) => RequestOption;
export declare type OnResHook = (error: any, response: any, body: any) => {
    error: any;
    response: any;
    body: any;
};
declare class HttpService {
    constructor();
    /**
     * @description
     * 设置签名用的信息
     * @private
     * @type {AppSign}
     * @memberof HttpService
     */
    private appSign;
    private baseOptions;
    private onHeaderReady?;
    private onOptionReady?;
    private onRes?;
    setAppSign(appSign: AppSign): void;
    setHeaderReadyHook(fn: OnHeaderReadyHook): void;
    setOptionReadyHook(fn: OnOptionReadyHook): void;
    setResReadyHook(fn: OnResHook): void;
    /**
     * 生成签名，输出请求 option
     * @param options
     */
    protected makeSign(options: RequestOption): RequestOption;
    protected buildOption(actionName: string, apiDesc: IApi, params?: any): RequestOption;
    request(actionName: string, apiDesc: IApi, params?: any): Promise<{} | undefined>;
}
export default HttpService;
