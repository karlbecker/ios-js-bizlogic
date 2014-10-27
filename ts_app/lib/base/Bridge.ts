
module controllers {
    //this will be populated by controller classes
}
module services {
    //this will be populated by service classes
}

module base {
    export interface Service {
        start(services:Services);
        stop();
    }
    
    export class Services {
        private all:Service[] = [];
        bridge:Bridge;
        
        constructor(bridge:Bridge) {
            this.bridge = bridge;
        }
        
        public start():void {
            this.all = [];
            Object.keys(services).forEach(serviceName => {
                var ServiceType = services[serviceName];
                var service:Service = new ServiceType();
                this.all.push(service);
            });
            this.all.forEach(service => {
                service.start(this);
            });

        }
        public stop():void {
            this.all.forEach(service => {
                service.stop()
            });
            this.all = [];
        }
        
        public restart():void {
            this.stop();
            this.start();
            this.bridge.setResultsShouldUpdate();
        }
        
        public get(ServiceType):any {
            var service:Service = null;
            this.all.forEach(s => {
                if(!service && s instanceof ServiceType) {
                    service = s;
                }
            });
            return service;
        }
    }

    export interface BridgeCallback extends utils.UrlContentFetcher {
        executionResult(executionId:string, argumentsJson:string):void;
        executionError(executionId:string, errorJson):void;
        updateAllResults();
        getSomeDataSentFromTheNativeAppCode():string;
        bridgeInitialized();
    }
    
    export class Updateable<T> {
        value:T;
        constructor(value:T) {
            this.value = value;
        }
        
        static of<T>(value:T):Updateable<T> {
            return new Updateable<T>(value)
        }
    }



    export class Bridge {
        services:Services;
        callback:BridgeCallback;
        resultsShouldUpdate:boolean;
        
        constructor(callback:BridgeCallback) {
            this.callback = callback;
            new utils.UserInfo().someDataSentFromTheNativeAppCode = callback.getSomeDataSentFromTheNativeAppCode();
            this.services = new Services(this);
        }
        
        static version():string {
            return window['BRIDGE_VERSION'] || "UNKNOWN"
        }
        
        start():void {
            this.services.start();
            this.callback.bridgeInitialized();
        }
        
        exec(executionId, className, methodName, argsJson):void {
           var args = JSON.parse(argsJson);
           this.execImmediate(className, methodName, args, (err, result) => {
               if(err) {
                   this.callback.executionError(executionId, JSON.stringify(err));
               } else {
                   this.callback.executionResult(executionId, JSON.stringify(result));
               }
           })
        }
        
        execImmediate(className, methodName, args, callback):void {
            try {
                var ClassToCreate = controllers[className];
                
                if(!ClassToCreate) {
                    callback({code: 'JSException', message: 'unknown controller class: ' + className});
                    return;
                }
                var object = new ClassToCreate(this.services),
                    method = object[methodName];
                if(!method) {
                    callback({code: 'JSException', message: 'unknown method: ' + className + '.' + methodName});
                    return;
                }
                var result = method.apply(object, args);
                //allow the return value to be either a simple value or a promise.
                Q.when(result).then(function(result) {callback(null, result)}).catch(function(error) {callback(error)});
                this.sendUpdates();
            } catch(err) {
                callback({code: 'JSException', message: 'An error occurred while executing JavaScript method' + className + "." + methodName + ': ' + err.message + "\nstack: \n" + JSON.stringify(err.stack)})
            }
            
        }

        setResultsShouldUpdate() {
            this.resultsShouldUpdate = true;
        }
        
        sendUpdates() {
            if(this.resultsShouldUpdate) {
                this.resultsShouldUpdate = false;
                this.callback.updateAllResults()
            }
        }
    }
}