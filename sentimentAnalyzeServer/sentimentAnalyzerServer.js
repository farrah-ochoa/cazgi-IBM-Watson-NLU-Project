const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); 

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-02-18',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
         'url': req.query.url,
            'features': {
                'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
                },
                'keywords': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
                },
            },
    }

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        let keywords = analysisResults.result.keywords[0];
        return res.send(keywords.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });

    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
         'url': req.query.url,
            'features': {
                'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
                },
                'keywords': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
                },
            },
    }
    
    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        let keywords = analysisResults.result.keywords[0];
        return res.send({"label": keywords.sentiment.label});
    })
    .catch(err => {
        console.log('error:', err);
    });

    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
         'text': req.query.text,
            'features': {
                'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
                }, 
                'keywords': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
                },
            },
    }
     
    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        let keywords = analysisResults.result.keywords[0];
        return res.send(keywords.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
   // return res.send({"happy":"10","sad":"90"});
});


app.get("/text/sentiment", (req,res) => {
    const analyzeParams = { 
         'text': req.query.text,
            'features': {
                'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
                },
                'keywords': {  
                'emotion': false, 
                'sentiment': true,
                'limit': 2, 
                },
            }, 
    }
    
    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        let keywords = analysisResults.result.keywords[0];
        return res.send({"label": keywords.sentiment.label});
    }) 
    .catch(err => {
        console.log('error:', err);
    });
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

