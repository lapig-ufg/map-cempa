
module.exports = function(app) {
    let Controller = {}

    Controller.serie = function(request, response) {
        const serie = request.queryResult['serie'];
        if(Array.isArray(serie)){
            response.status(200).json({ data: serie });
            response.end();
        }else{
            response.status(400).json({ message: "Something is wrong!" });
            response.end();
        }
    }

    return Controller;
}
