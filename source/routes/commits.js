//Created by lyndon.li on 5/30/2016.
var express = require('express');
var request = require('request');
var router = express.Router();

/*handle the data to new format that group by author*/
function handleData(data){
    var res=[];
    var authors={};
    try {
        data.map(n => {
            if(!authors[n.commit.author.name])
            {
              res.push({'author': n.commit.author.name, commits: [{'Hash': n.sha}]});
              authors[n.commit.author.name] = true;
            }else{
              for (var i = 0; i < res.length; i++) {
                if (res[i].author === n.commit.author.name) {
                    res[i].commits.push({'Hash': n.sha});
                }
              }
            }
        });
    }catch (e){
        console.log("Something wrong in mapping the commits by author.Destials "+ e.message);
    }
    return res;
}
/* GET commits listing. */
router.get('/', function (req,res,next) {
    var options = {
        url: 'https://api.github.com/repos/v8/v8/commits',
        headers: {
            'User-Agent': 'request'
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var data = JSON.parse(body);
            }catch (e){
                console.log("There is a fualt when paresing the commits data.")
            }
            var dataByAuthor=handleData(data);
            //console.log(dataByAuthor);
            res.render('commits',{allCommits:dataByAuthor})

        }else{
            res.send("Sorry, something is wrong!");
            console.log("something is wrong when getting the data for Github.");
        }
    })
});
module.exports = router;