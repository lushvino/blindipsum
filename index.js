var blindipsum = function(args) {

    var sentance_min  =  4;
    var sentance_max  =  15;
    var paragraph_min =  3;
    var paragraph_max =  7;
    var count         = args.count || 1;
    var convert_utf8  = args.utf8 || true;

    // Dictionary of Wine Terms and Filler words
    var dictionary    = require('./data/dictionary.js')

    // Generate Random Number
    var randomNumber = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
     };

    // Grab a random work from the dictionary
    var randomDictionaryWord = function(words) {
        return dictionary.words[randomNumber(0, dictionary.words.length - 1)];
    };


    // Generate a sentance
    var generateRandomSentence = function(words, min, max) {
        var sentence = '';
        var word_min = 0;
        var word_max = randomNumber(min, max)

        while (word_min < word_max) {
            sentence += ' ' + randomDictionaryWord(words);
            word_min +=  1;
        }

        if (sentence.length) {
            sentence = sentence.slice(1);
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        }

        return sentence;

    };

    // Generate a paragraph
    var generateRandomParagraph = function(words, min, max, sentence_min, sentence_max) {
        var paragraph = '';
        var para_min = 0;
        var para_max = randomNumber(min,max);

        while (para_min < para_max) {
            paragraph += '. ' + generateRandomSentence(words, sentence_min, sentence_max);
            para_min  +=  1;
        }

        if (paragraph.length) {
            paragraph = paragraph.slice(2);
            paragraph += '.';
        }

        return paragraph;
    };


    var iter = 0
    var min = 0;
    var max = count;
    var string = '';
    var prefix = '';
    var suffix = "\r\n";

    if (args.html) {
      prefix = '<p>';
      suffix = '</p>';
    }

    if (args.json ) {
        suffix = '';
        prefix = '';
    }

    while (min < max) {

        if (args.w || args.word) {
            string += ' ' + randomDictionaryWord(dictionary.words);
        }

        if (args.s || args.sentence) {
            string += '. ' + generateRandomSentence(dictionary.words, sentance_min, sentance_max);
        }

        if (args.p || args.paragraph) {
            string += prefix + generateRandomParagraph(dictionary.words, paragraph_min, paragraph_max, sentance_min, sentance_max) + suffix;
        }
        min += 1;
    }

    if (string.length) {
        var pos = 0;

        if (string.indexOf('. ') === 0) {
          pos = 2;
        } else if (string.indexOf('.') === 0 || string.indexOf(' ') === 0) {
          pos = 1;
        }

        string = string.slice(pos);

        if (args.s || args.sentence) {
          string = string + '.';
        }
    }

    if (convert_utf8) {
        string = new Buffer(string).toString('utf-8');
    }

    if (args.json  ) {
        string = { vinoipsum: string };
    }


    return string;

};

module.exports = blindipsum