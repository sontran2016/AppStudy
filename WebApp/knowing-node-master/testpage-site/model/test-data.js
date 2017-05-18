
var objJson;
var thelist = function () {
    objJson = {"GroupName":"D","count":4,"teams":[{"country":"England"}, {"country":"France"}, {"country":"Sweden"}, {"country":"Ukraine"}]};
    return objJson;
};
exports.teamlist = objJson;

exports.setTeamList = function (data) {
    objJson = data;
    return true;
};

