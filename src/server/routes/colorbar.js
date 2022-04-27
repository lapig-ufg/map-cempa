module.exports = function(app) {
    const colorbarController = app.controllers.colorbar;
    app.get('/service/colorbar/:layer', colorbarController.colorbar);
}
