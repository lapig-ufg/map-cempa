module.exports = function(app) {
    const layerController = app.controllers.layer;
    app.get('/service/layer/:id', layerController.layer);
}
