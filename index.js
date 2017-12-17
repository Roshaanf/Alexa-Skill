let express = require('express'),
  bodyParser = require('body-parser'),
  app = express();
let alexaVerifier = require('alexa-verifier');

app.use(bodyParser.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
  }
}));

function requestVerifier(req, res, next) {
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        res.status(401).json({ message: 'Verification Failure', error: err });
      } else {
        next();
      }
    }
  );
}


let hotels=["pearl continental", "sheraton","harris biryani wala"]
app.post('/forecast', requestVerifier, function (req, res) {
  console.log("yesyesyes")
  if (req.body.request.type === 'LaunchRequest') {

    res.send({
      "version": "1.0",
      "response": {
        "shouldEndSession": false,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Hey! here is your hotel manager</speak>"
        }
      }
    });
  }

  else if (req.body.request.type === 'SessionEndedRequest') {
    res.send({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Hey! Looking forward to serve you again </speak>"
        }
      }
    });
  }
  else if (req.body.request.type === 'IntentRequest') {

    if (req.body.request.intent.name === 'BookHotel') {

      // if (!req.body.request.intent.slots.Hotels ||
      //   !req.body.request.intent.slots.Hotels.value) {
      //   // Handle this error by producing a response like:
      //   // "Hmm, what day do you want to know the forecast for?"
      // }
      // let day = new Date(req.body.request.intent.slots.Day.value);

      // Do your business logic to get weather data here!
      // Then send a JSON response...
      var bookedHotel=hotels.indexOf((req.body.request.intent.slots.Hotels.value).toLowerCase());
      res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": false,
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>Congratulations your room in "+hotels[bookedHotel]+" has been booked!</speak>"
          }
        }
      });
    }
  
   else if (req.body.request.intent.name === 'AMAZON.HelpIntent') {


      res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": false,
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>You can book"+hotels+" </speak>"
          }
        }
      });
    }
   else if (req.body.request.intent.name === 'OK') {


      res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": true,
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>Thankyou for using our service, hope you will contact us soon again</speak>"
          }
        }
      });
    }
    else{
      res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": true,
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>Sorry something went wrong</speak>"
          }
        }
      });
    }
  }
  });
app.listen(process.env.PORT || 5000);