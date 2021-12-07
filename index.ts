require('dotenv').config();
import express from 'express';
import fs from 'fs';
let app = express();
const fileUpload = require('express-fileupload');

let staticPages = {
    'index': fs.readFileSync('./public/index.html', 'utf-8')
}

app.use(require('body-parser').urlencoded({ extended: false, limit: '10mb' }));
app.use(fileUpload({ debug: false }));

app.get('/', (req, res) => {
    res.send(staticPages.index);
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if (req.body.key !== process.env.KEY) {
        return res.status(500).send('Key does not match.')
    }

    let send = "";

    (Array.isArray(req.files.f) ? req.files.f : [req.files.f]).forEach(file => {
        file.mv('./img/' + file.name, (err) => {
            if (err) return res.status(500).send(err);;
            
        });
        send += `<a href="http://${req.hostname}/${file.name}">${file.name}</a><br>`;
    });

    
    res.send(send);


});

app.get('/:request', (req, res) => {
    res.send(`
    <meta property="og:title" content="${req.params.request}">
    <meta property="og:type" content="website">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="image_src" content="/direct/${req.params.request}">
    <meta name="theme-color" content="#4287f5">
    <meta property="og:image" content="/direct/${req.params.request}">
    <meta property="twitter:image" content="/direct/${req.params.request}">
    <meta property='og:image:url' content='/direct/${req.params.request}'/>

    <script> window.location = "/direct/${req.params.request}" </script>
    <noscript> <a href="/direct/${req.params.request}">view</a> </noscript>
    `);
});

app.get('/direct/:request', (req, res) => {
    
    console.log(`./img/${req.params.request}`);
    res.sendFile( require('path').join(process.cwd(), 'img/' + req.params.request ));
});

app.listen(8535);