/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 1/2/17
 * Time: 4:06 PM
 * To change this template use File | Settings | File Templates.
 */
var thelist = function() {
    var objJson = {
        "GroupName": "D",
        "count": 4,
        "teams": [{
            "country": "England"
        }, {
            "country": "France"
        }, {
            "country": "Sweden"
        }, {
            "country": "Ukraine"
        }]
    };
    return objJson;
};
exports.teamlist = thelist();
