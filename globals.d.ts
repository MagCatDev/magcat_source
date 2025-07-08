declare global {
    type Filter = import("./types/schema").Filter;
    type Metadata = import("./types/schema").Metadata;
    type SearchOptions = import("./types/schema").SearchOptions;
    type Item = import("./types/schema").Item;
    type SearchResult = import("./types/schema").SearchResult;
    type BridgeRequest = import("./types/schema").BridgeRequest;

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