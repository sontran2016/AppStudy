/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 1/2/17
 * Time: 4:04 PM
 * To change this template use File | Settings | File Templates.
 */
var template = require('../views/template-main');
var test_data = require('../model/test-data');
exports.get = function(req, res) {
    var teamlist = test_data.teamlist;
    var strTeam = "";//, i = 0;
    for (var i = 0; i < teamlist.count;i++) {
        strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
        //i = i + 1;
    }
    strTeam = "<ul>" + strTeam + "</ul>";
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(template.build("Test web page on node.js", "Hello there", "<p>The teams in Group " + teamlist.GroupName + " for Euro 2012 are:</p>" + strTeam));
    res.end();
};
