module.exports = function(app) {
    const staticController = app.controllers.static;
    app.get('/service/static/layer/:layer', staticController.layer);
    app.get('/service/static/bar/:bar', staticController.bar);
}
