const WebSocket = require('ws');

const ws = new WebSocket.Server({port: 8971});
const path = require('path');
const url = require('url');
const {app, BrowserWindow} = require('electron');

let win;

let settings;

ws.on('connection', (client) => {
    console.log('connect user');
    client.on('message', message => {
        const messageFile = JSON.parse(message);
        const type = messageFile.type;
        const content = messageFile.content;
        switch (type) {
            case "setting": {
                settings = content;
                break;
            }
            case "getSetting": {
                client.send(JSON.stringify(settings));
                break;
            }
        }
    });
    client.on('close',() => {
        client.close();
    });
});
function createWindow() {
    win = new BrowserWindow(
        {
            width:1280,
            height:720,
            minHeight:800,
            minWidth:720,
            show: false,
            webPreferences: {
                nodeIntegration:true
            }
        }
    );

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

   //win.webContents.openDevTools();
    win.setMenu(null);
    win.once('ready-to-show', () => {
        win.show();
    });
    win.on('close', () => {
        win = null;
    });
}
app.on('ready', createWindow);

console.log('App is runned');

app.on('window-all-closed', () => {
    app.quit();
})