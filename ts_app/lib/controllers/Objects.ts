
module controllers {
    export class Objects {
        objects:controllers.Objects;

        constructor(svc:base.Services) {
            this.objects= new controllers.Objects(svc);
        }

        getById(id:string):models.Object {
            var localStorage = window.localStorage;
            var value = null;

            var jsonValue = localStorage.getItem(id);
            if(!jsonValue || jsonValue === "undefined") {
                value = null;
            } else {
                value = JSON.parse(jsonValue);
            }

            return value;
        }

        addNewObject(id:string, title:string, url:string):void {
            var newObject = {
                'id': id,
                'title': title,
                'url': url};
            localStorage.setItem(id, JSON.stringify(newObject));
        }
    }
}