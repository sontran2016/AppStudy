var template = require('../views/template-main');
var mongo_data = require('../model/mongo-data');

exports.get = function(req, res) {
 mongo_data.teamlist("D",function(err,teamlist){
 if(!err){
  var strTeam = "", i = 0;
  for (i = 0; i<teamlist.count;) {
   strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
   i = i+1;
  }
  strTeam = "<ul>" + strTeam + "</ul>"
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(
   template.build("Test web page on node.js","Hello there","<p>The teams in Group " + teamlist.GroupName + " for Euro 2012 are:</p>" + strTeam));
  res.end();
 }
 else{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(
   template.build("Oh dear","Database error","<p>Error details: " + err + "</p>"));
  res.end();

 }
});
 
}

