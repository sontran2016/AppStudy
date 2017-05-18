var template = require('../views/template-main');
var mongo_data = require('../model/mongoose-data');

exports.get = function(req, res) {
 var strGroup = "D";
 mongo_data.teamlist(strGroup,function(err,teamlist){
  if(!err){
   var strTeam = "", i = 0, teamCount = teamlist.length;
   for (i = 0; i<teamCount;) {
    strTeam = strTeam + "<li>" + teamlist[i].country + "</li>";
    i = i+1;
   }
   strTeam = "<ul>" + strTeam + "</ul>"
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write(
    template.build("Test web page on node.js","Hello there","<p>The teams in Group " + strGroup + " for Euro 2012 are:</p>" + strTeam));
   res.end();
  }
  else{
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write(
    template.build("Oh dear","Database error","<p>Error details: " + err + "</p>"));
   res.end();
  }
 });
};

