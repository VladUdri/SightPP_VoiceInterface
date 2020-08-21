import React, {Component} from "react";
import { Button} from 'react-bootstrap';

export default class ObjectAddition extends Component {

    constructor(props) {
        super(props);
        this.state = {
            preClickTime: null,
            postClickTime: null
        };

        //binding
        this.recogniseSpeech = this.recogniseSpeech.bind(this);
        this.speakTexts = this.speakTexts.bind(this);
        this.setObjects = this.setObjects.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    recogniseSpeech(){
        var speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription('089ccb86c773418db9cf38d11833f5a0', 'westus');
        speechConfig.speechRecognitionLanguage = "en-US";
        var audioConfig  = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        var recogniser = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recogniser.recognizeOnceAsync( result => {
            console.log(result.text);
            console.log(typeof (result.text));
            if (result.text != undefined) {
                this.speakTexts(`Your preference is ${result.text}. This will be applied to your obstacle avoidance service.`);
                var c = result.text.toLowerCase();
                c = c.replace(/[^a-z]/gi, ' ');
                var o = c.split(' ');
                var objects = [];
                o.forEach(item => {
                    if (item != "") {
                        objects.push(item);
                    }
                })
                if (objects != []) {
                    console.log(objects);
                    this.props.setExtraObject(objects);
                }else {
                    this.speakTexts('you gave us an invalid answer. please try this button again in a quieter environment');
                }
            }else {
                this.speakTexts('we don\'t receive your answer.please try this button again');
            }
        },err => {
            console.log(err);
        });
    }

    speakTexts(texts) {
        var synth = window.speechSynthesis;
        var voices = synth.getVoices();//get language lists

        var utterThis = new SpeechSynthesisUtterance(texts); // text content
        utterThis.voice = voices[2]; // choose the language type(en-GB)
        utterThis.pitch = 2;// pitch
        utterThis.rate = 1.5;// speed

        synth.speak(utterThis); //speak
    }


    setObjects() {
        this.speakTexts('Hello, in this system, you can mark the objects you preferred by speaking... Now, please say the names of your preferred objects. after three d sound. d d d');
        setTimeout(this.recogniseSpeech, 11500);
    }


    handleClick () {
        if (this.state.preClickTime == null) {
            console.log("first click");
            var d = new Date();
            this.state.preClickTime = d.getTime();
            this.speakTexts("This button can let you set the preferred objects which you would like to know first. If you want to use this function, please click it again immediately..");
        }else{
            console.log("second click");
            var d = new Date();
            this.state.postClickTime = d.getTime();
            if(this.state.postClickTime - this.state.preClickTime > 15000) {
                this.state.preClickTime = null;
                this.state.postClickTime = null;
            }else {
                this.setObjects();
                this.state.preClickTime = null;
                this.state.postClickTime = null;
            }
        }
    }




    render() {
        return (
            <div>
                <Button  variant="primary" size="lg" block onClick={this.handleClick}>
                    Mark Preferred Objects
                </Button>
            </div>
        );
    }
}