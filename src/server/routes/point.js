module.exports = function (app) {
    const point = app.controllers.point;
    const dataInjector = app.middleware.dataInjector
    app.get('/service/point/serie', dataInjector, point.serie);
}
