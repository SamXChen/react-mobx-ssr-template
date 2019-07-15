import '../../utils/fetch-polyfill';
declare class Adapter {
    private urlPrefix;
    setPrefix(prefix: string): void;
    callAPI(actionName: string, params?: object): Promise<any>;
}
export default Adapter;
