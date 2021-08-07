const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(morgan('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.listen(80, () => {
    console.log('Server running');
});

app.get('/tutorial/*/e*', (req, res) => {
    var md_content = '';
    try{
        md_content = fs.readFileSync(
            __dirname + '\\views\\tutorials\\' + req.url.split('/')[2] + '\\' + req.url.split('/')[3] + '.md',
            {
                encoding: 'utf8'
            }
        );
    }catch{}
    md_content = md_content.replaceAll(/\`/g, '\\\`');
    fs.readdir(__dirname + '\\views\\tutorials\\' + req.url.split('/')[2] + '\\', (err, files) => {
        var episode_count = files.length;
        var tutorial_episodes = [];
        for(var i = 0; i < episode_count; i++){
            tutorial_episodes[i] = fs.readFileSync(
                __dirname + '\\views\\tutorials\\' + req.url.split('/')[2].toLowerCase() + '\\e' + (i+1) + '.md',
                {
                    encoding: 'utf8'
                }
            ).split('\n')[0].substr(2);
        }

        res.render('tutorial.ejs', {
            md_content: md_content,
            language: req.url.split('/')[2].toUpperCase(),
            tutorial_episodes: tutorial_episodes
        });
    });
});