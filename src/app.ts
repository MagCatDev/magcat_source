export abstract class BaseEngineApp implements EngineApp {

    abstract search(options: SearchOptions): Promise<SearchResult>;

    abstract getMetadata(): Promise<Metadata>;

    async getSetting(key: string, fallback?: Record<string, any>): Promise<any> {
        const settings = await fjs.bridge_call({
            method: "getSettings",
        });

        const value = settings[key];
        if (typeof value != "undefined") {
            return value;
        }

        if (fallback && key in fallback) {
            return fallback[key];
        }

        const metadata = await this.getMetadata();
        return metadata.settings?.[key];
    }
}