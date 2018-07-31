const webpack = require('webpack');
const child_process = require('child_process');
const config = require('./webpack.config')

config.mode = 'production';
const compiler = webpack(config);

compiler.run((err, stats) => {
    if (err) {
        console.err(err)
    } else {
        console.log(stats.toString({ colors: true }));
        if(stats.hasErrors()) {
            process.exit(1);
        }
    }
});
