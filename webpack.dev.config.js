const webpack = require('webpack');
const child_process = require('child_process');
const config = require('./webpack.config')

config.mode = 'development';
const compiler = webpack(config);

let serverProcessPromise = Promise.resolve();
let serverProcess = null;

compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
}, (err, stats) => {
    if (err) {
        console.err(err)
    } else {
        console.log(stats.toString({ colors: true }));
        if (!stats.hasErrors()) {
            if (serverProcess) {
                console.log('Stopping server...');
                serverProcess.kill();
            }
            serverProcessPromise = serverProcessPromise.then(() => {
                return new Promise((resolve, reject) => {
                    console.log('Starting server...');
                    serverProcess = child_process.fork("dist/server.js");
                    serverProcess.on('exit', () => {
                        console.log('Server stopped');
                        serverProcess = null;
                        resolve();
                    });
                });
            }, err => console.err(err));
        }
    }
});
