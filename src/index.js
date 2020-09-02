const { createWindow } = require('./main')
const { app, BrowserWindow } = require('electron')


if (process.env.NODE_ENV !== 'production'){
require('electron-reload')(__dirname, {

})
}
require('./database.js')

app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);
