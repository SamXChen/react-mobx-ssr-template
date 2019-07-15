import { IApiGroup } from '../api';
import { OnHeaderReadyHook, OnOptionReadyHook, OnResHook } from './services/http';
declare class Adapter {
    constructor();
    private httpService;
    private apis;
    setApis(apis: IApiGroup): void;
    setHeaderHook(fn: OnHeaderReadyHook): void;
    setOptionHook(fn: OnOptionReadyHook): void;
    setResHook(fn: OnResHook): void;
    callAPI(actionName: string, params: object): Promise<{} | undefined>;
}
export default Adapter;
export { OnHeaderReadyHook, OnOptionReadyHook, OnResHook };
