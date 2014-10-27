//keep the status of webpages up to date

export class DataChecker implements base.Service {
    interval: number;
    bridge: base.Bridge;

    start(services:base.Services) {
        this.bridge = services.bridge;
        services.bridge.sendUpdates();
    }

    stop() {
        clearInterval(this.interval);
    }

}