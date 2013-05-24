/**
 * Created with JetBrains WebStorm.
 * User: nisheeth
 * Date: 20/05/13
 * Time: 15:02
 * To change this template use File | Settings | File Templates.
 */

ConsoleIO.namespace("ConsoleIO.App.Device.Panel");

ConsoleIO.App.Device.Panel = function PanelController(parent, model) {
    this.parent = parent;
    this.model = model;
    this.activeTab = null;

    this.view = new ConsoleIO.View.Device.Panel(this, this.model);
    this.console = new ConsoleIO.App.Device.Console(this, this.model);
    this.source = new ConsoleIO.App.Device.Source(this, this.model);
    this.preview = new ConsoleIO.App.Device.Preview(this, this.model);
    this.status = new ConsoleIO.App.Device.Status(this, this.model);
};

ConsoleIO.App.Device.Panel.prototype.render = function render(target) {
    this.view.render(target);
    this.status.render(this.view.tabs);
    this.source.render(this.view.tabs);
    this.preview.render(this.view.tabs);
    this.console.render(this.view.tabs);
};

ConsoleIO.App.Device.Panel.prototype.tabClick = function tabClick(tabId) {
    if (this.activeTab) {
        this[this.activeTab].activate(false);
    }
    this.activeTab = (tabId.split('-')[0]).toLowerCase();
    this[this.activeTab].activate(true);
};

ConsoleIO.App.Device.Panel.prototype.activate = function activate(state) {
    if (!state) {
        this.status.activate(state);
        this.source.activate(state);
        this.preview.activate(state);
        this.console.activate(state);
    } else if (this.activeTab) {
        this[this.activeTab].activate(state);
    }
};

ConsoleIO.App.Device.Panel.prototype.buttonClick = function buttonClick(tab, btnId, state) {
    var handled = false;

    switch (btnId) {
        case 'refresh':
            tab.refresh();
            handled = true;
            break;
        case 'wordwrap':
            tab.editor.setOption('lineWrapping', state);
            handled = true;
            break;
    }

    return handled;
};