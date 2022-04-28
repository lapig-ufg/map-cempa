module.exports = function (app) {

    let Query = {};

    Query.defaultParams = {
        'lev': 'lev_1000',
        'variable': 'tempc'
    }

    Query.serie = function (params) {
        let {lev, variable, lat, lon, start, end} = params;

        lev = lev? lev : Query.defaultParams.lev;
        variable = variable? variable : Query.defaultParams.variable;

        const point = (lat && lon) ? "'SRID=4674;POINT("+lon+" "+lat+")'": ''
        const period = (start && end) ? " AND datetime BETWEEN '" + start+ "' AND '"+ end +"' ": '';

        let sql = "WITH nearest_point as (SELECT pt.gid \n" +
            "FROM points pt\n" +
            "WHERE ST_DWithin(pt.geom, "+point+"::geography, 4000)\n" +
            "ORDER BY pt.geom <-> "+point+"::geography ASC\n" +
            "LIMIT 1)\n" +
            "SELECT datetime, "+lev+" as value FROM "+variable+" t WHERE t.point_gid in (SELECT gid FROM nearest_point) "+ period +" ORDER BY datetime";

        let sql_point = "WITH nearest_point as (SELECT pt.gid, pt.lat, pt.lon \n" +
            "FROM points pt\n" +
            "WHERE ST_DWithin(pt.geom, "+point+"::geography, 4000)\n" +
            "ORDER BY pt.geom <-> "+point+"::geography ASC\n" +
            "LIMIT 1)\n"

        return [
            {
                source: 'lapig',
                id: 'serie',
                sql: sql,
                mantain: true
            },
            {
                source: 'lapig',
                id: 'point',
                sql: sql_point,
                mantain: true
            }
        ]
    }

    return Query;

}
