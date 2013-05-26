/**
 * Created with IntelliJ IDEA.
 * User: nisheeth
 * Date: 19/05/13
 * Time: 13:32
 * To change this template use File | Settings | File Templates.
 */

ConsoleIO.namespace("ConsoleIO.App.Device.Console");

ConsoleIO.App.Device.Console = function ConsoleController(parent, model) {
    this.parent = parent;
    this.model = model;
    this.active = true;
    this.paused = false;
    this.store = {
        added: [],
        queue: []
    };
    this.view = new ConsoleIO.View.Device.Console(this, {
        name: "Console",
        guid: this.model.guid,
        toolbar: [
            ConsoleIO.Model.DHTMLX.ToolBarItem.Reload,
            ConsoleIO.Model.DHTMLX.ToolBarItem.PlayPause,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Separator,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Clear,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Export,
            ConsoleIO.Model.DHTMLX.ToolBarItem.PageSize,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Separator,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Info,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Log,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Warn,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Debug,
            ConsoleIO.Model.DHTMLX.ToolBarItem.Error
        ]
    });

    ConsoleIO.Service.Socket.on('device:console:' + this.model.guid, this.add, this);
};

ConsoleIO.App.Device.Console.prototype.render = function render(target) {
    this.view.render(target);
};

ConsoleIO.App.Device.Console.prototype.activate = function activate(state) {
    this.active = state;
    this.addBatch();
};

ConsoleIO.App.Device.Console.prototype.add = function add(data) {
    if (this.active && !this.paused) {
        this.store.added.push(data);
        this.view.add(data);
    } else {
        this.store.queue.push(data);
    }
};

ConsoleIO.App.Device.Console.prototype.addBatch = function addBatch() {
    if (this.active && !this.paused) {
        this.view.addBatch(this.store.queue);
        this.store.added = this.store.added.concat(this.store.queue);
        this.store.queue = [];
    }
};

ConsoleIO.App.Device.Console.prototype.buttonClick = function buttonClick(btnId, state) {
    if (!this.parent.buttonClick(this, btnId, state)) {
        console.log('buttonClick', btnId);

        if (btnId.indexOf('pagesize-') === 0) {
            ConsoleIO.Settings.pageSize.active = btnId.split("-")[1];
            this.view.clear();
            this.view.addBatch(this.store.added);
        } else {
            switch (btnId) {
                case 'playPause':
                    this.paused = state;
                    this.addBatch();
                    break;
                case 'clear':
                    this.view.clear();
                    break;

                case 'export':
                    ConsoleIO.Service.Socket.emit('exportHTML', {
                        guid: this.model.guid,
                        name: this.model.name,
                        content: this.view.getHTML()
                    });
                    break;
                case 'info':
                case 'log':
                case 'warn':
                case 'debug':
                case 'error':
                    break;
            }
        }
    }
};