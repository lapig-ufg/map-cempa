
module.exports = function(app) {
    let Controller = {}

    Controller.serie = function(request, response) {
        const serie = request.queryResult['serie'];
        const point = request.queryResult['point'];

        if(Array.isArray(serie)){
            response.status(200).json({ data: serie, point: point });
            response.end();
        }else{
            response.status(400).json({ message: "Something is wrong!" });
            response.end();
        }
    }

    return Controller;
}
