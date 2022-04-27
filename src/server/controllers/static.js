const fs = require("fs");

module.exports = function (app) {
    let Controller = {}

    const config = app.config;

    Controller.layer = function (request, response) {

        const {layer} = request.params;
        console.log(config.staticDir)
        if(fs.existsSync(config.staticDir)){
            const colobarFilePath = config.staticDir + 'png_20220418/' + layer
            console.log(colobarFilePath)
            if(fs.existsSync(colobarFilePath)){
                response.sendFile(colobarFilePath);
            } else {
                response.status(400).json({ msg: 'Layer file not found' })
                response.end();
            }
        } else {
            response.status(400).json({ msg: 'Layer directory not found' })
            response.end();
        }

    }
    Controller.bar = function (request, response) {

        const {bar} = request.params;

        if(fs.existsSync(config.staticDir)){
            const colobarFilePath = config.staticDir + 'barra_cores_20220418/' +  bar
            if(fs.existsSync(colobarFilePath)){
                response.sendFile(colobarFilePath);
            } else {
                response.status(400).json({ msg: 'Bar file not found' })
                response.end();
            }
        } else {
            response.status(400).json({ msg: 'Bar directory not found' })
            response.end();
        }

    }

    return Controller;

}
