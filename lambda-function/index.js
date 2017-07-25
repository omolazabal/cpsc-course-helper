'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).
var courses = require('./courses');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'CourseIntent': function () {
        var courseSlot = this.event.request.intent.slots.Item;
        var courseName;
        if (courseSlot && courseSlot.value) {
            courseName = courseSlot.value.toLowerCase();
        }

        var courses = this.t("COURSES");
        var courseInfo = courses[courseName];
        var cardTitle = this.t("DISPLAY_CARD_MSG", courseInfo);

        if (courseInfo) {
            this.attributes['speechOutput'] = courseInfo;
            this.attributes['repromptSpeech'] = this.t("DISPLAY_CARD_TITLE", courseName);
            this.emit(':tellWithCard', courseInfo, this.attributes['repromptSpeech'], cardTitle, courseInfo);
        } else {
            var speechOutput = this.t("COURSE_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("COURSE_NOT_FOUND_REPROMPT");
            if (courseName) {
                speechOutput += this.t("COURSE_NOT_FOUND_WITH_ITEM_NAME", courseName);
            } else {
                speechOutput += this.t("COURSE_NOT_FOUND_WITHOUT_ITEM_NAME");
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var languageStrings = {
    "en": {
        "translation": {
            "COURSES": courses.COURSE_EN_US,
            "SKILL_NAME": "Computer Science Course Helper",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what class will teach me programming? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "Course Information for %s",
            "DISPLAY_CARD_MSG": "%s",
            "HELP_MESSAGE": "You can ask questions such as, what class will teach me about artificial intelligence, or, you can say, exit to exit the skill ... Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, what class will teach me about game development, or you can say, exit to exit the skill ... Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "COURSE_NOT_FOUND_MESSAGE": "I\'m sorry, Fullerton does not currently provide a course for ",
            "COURSE_NOT_FOUND_WITH_ITEM_NAME": "%s. ",
            "COURSE_NOT_FOUND_WITHOUT_ITEM_NAME": "that, or I misunderstood you. ",
            "COURSE_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            "COURSES" : courses.COURSE_EN_US,
            "SKILL_NAME": "Computer Science Course Helper"
        }
    }
};
