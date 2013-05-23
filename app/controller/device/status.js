/**
 * Created with IntelliJ IDEA.
 * User: nisheeth
 * Date: 20/05/13
 * Time: 19:28
 * To change this template use File | Settings | File Templates.
 */

ConsoleIO.namespace("ConsoleIO.App.Device.Status");

ConsoleIO.App.Device.Status = function StatusController(parent, model) {
    this.parent = parent;
    this.model = model;

    this.view = new ConsoleIO.View.Device.Status(this, {
        name: "Status",
        guid: this.model.guid,
        toolbar: [
            { id: 'refresh', type: 'button', text: 'Refresh', imgEnabled: 'refresh.gif', tooltip: 'Refresh' }
        ]
    });

    ConsoleIO.Service.Socket.on('device:status:' + this.model.guid, this.add, this);
};

ConsoleIO.App.Device.Status.prototype.render = function render(target) {
    this.view.render(target);
};

ConsoleIO.App.Device.Status.prototype.activate = function activate(state) {
    console.log('activate', this.model.guid, state);
    if(state){
        this.refresh();
    }
};

ConsoleIO.App.Device.Status.prototype.add = function add(data) {
    ConsoleIO.forEachProperty(data, function(value, property){
        var name = '';
        switch(property){
            case 'cookie':
                name = 'document.cookie = ';
                break;
            case 'connectionMode':
                name = 'Socket.connectionMode = ';
                break;
        }

        this.view.add(name + value);
    }, this);
};

ConsoleIO.App.Device.Status.prototype.refresh = function refresh() {
    this.view.clear();
    ConsoleIO.Service.Socket.emit('deviceStatus', this.model.guid);
};

ConsoleIO.App.Device.Status.prototype.buttonClick = function buttonClick(btnId, state) {
    console.log('buttonClick', btnId);
    switch (btnId) {
        case 'refresh':
            this.refresh();
            break;
    }
};