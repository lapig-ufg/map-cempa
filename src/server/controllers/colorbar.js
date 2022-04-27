const fs = require("fs");

module.exports = function (app) {
    let Controller = {}

    const config = app.config;

    Controller.colorbar = function (request, response) {

        const {layer} = request.params;

        if(fs.existsSync(config.colorbarDir)){
            const colobarFilePath = config.colorbarDir + layer
            if(fs.existsSync(colobarFilePath)){
                response.sendFile(colobarFilePath);
            } else {
                response.status(400).json({ msg: 'Colobar file not found' })
                response.end();
            }
        } else {
            response.status(400).json({ msg: 'Colobar directory not found' })
            response.end();
        }

    }

    return Controller;

}
