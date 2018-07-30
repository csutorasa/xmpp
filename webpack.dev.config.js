const webpack = require('webpack');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

const compiler = webpack({
    entry: path.join(__dirname, 'src', 'server', 'index.ts'),
    target: 'node',
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', ".js", ".json"]
    },
    externals: nodeModules
});

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
