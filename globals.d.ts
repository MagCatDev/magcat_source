declare global {
    type Filter = import("./zodSchemas").Filter;
    type Metadata = import("./zodSchemas").Metadata;
    type SearchOptions = import("./zodSchemas").SearchOptions;
    type Item = import("./zodSchemas").Item;
    type SearchResult = import("./zodSchemas").SearchResult;
    type BridgeRequest = import("./zodSchemas").BridgeRequest;

    interface EngineApp {
        filters?: Filter[]

        login?: () => Promise<void>;
        logout?: () => Promise<void>;

        getMetadata: () => Promise<Metadata>;

        getSetting: (key: string, fallback?: Record<string, any>) => Promise<any>;

        search: (options: SearchOptions) => Promise<SearchResult>;
    }

    declare const fjs: {
        bridge_call: (request: BridgeRequest) => Promise<any>;
    };
}

export {};