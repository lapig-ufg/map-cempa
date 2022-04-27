const fs = require("fs");

module.exports = function (app) {
    let Controller = {}

    const config = app.config;

    Controller.layer = function (request, response) {

        const {id} = request.params;

        if(fs.existsSync(config.colorbarDir)){
            const colobarFilePath = config.colorbarDir + id
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

    return Controller;

}
