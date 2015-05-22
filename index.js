'use strict';

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

function BlindIpsum(opts) {
    var defaults = {
        count: 1,              // Number of "units" to generate
        utf8: true,            // Force UTF-8
        sentence: {
            min: 4,            // Minimum words in a sentence
            max: 15            // Maximum words in a sentence
        },
        paragraph: {
            min: 3,            // Minimum words in a paragraph
            max: 7             // Maximum words in a paragraph
        },
        prefix: '',            // output prefix, ex: for html set to '<p>'
        suffix: '\r\n',        // output prefix, ex: for html set to '</p>'
        format: 'plain',       // format of output. Valid are 'plain', 'html', 'json'
        unit: 'paragraph',     // Type: Vaid are 'paragraph', 'sentence', 'word'
        commas: true           // Include some commans in sentences
    };

    this.options = extend( {}, defaults, opts);
}

BlindIpsum.prototype.setDictionary = function(dictionary) {
    this.dictionary = dictionary;
};

BlindIpsum.prototype.generate = function(options) {
    var self = this;

    this.options = extend({}, this.options, options);

    // Sentance Unit helper
    var isSentance = function() {
        return self.options.unit === 's' || self.options.unit === 'sentence';
    };

    // Generate Random Number
    var randomNumber = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
     };

    // Grab a random work from the dictionary
    var randomDictionaryWord = function(words) {
        return self.dictionary.words[randomNumber(0, self.dictionary.words.length - 1)];
    };

    // Generate a sentence
    var generateRandomSentence = function(words, min, max) {
        var sentence = '';
        var word_min = 0;
        var word_max = randomNumber(min, max);
        var include_commas = self.options.commas && word_max >= 7 && ( randomNumber(0,2) > 0);

        while (word_min < word_max) {
            sentence += ' ' + randomDictionaryWord(words);
            if ( (word_min >= 3) && (word_min !== ( word_max - 1) ) && include_commas ) {
                if ( randomNumber(0,1) == 1 ) {
                    sentence += ',';
                    include_commas = false;
                }
            }
            word_min += 1;
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


    var iter = 0;
    var min = 0;
    var max = this.options.count;
    var string = '';
    var prefix = this.options.prefix;
    var suffix = this.options.suffix;

    if (this.options.format == 'html') {
      prefix = '<p>';
      suffix = '</p>';
    }

    if (this.options.format == 'json') {
        suffix = '';
        prefix = '';
    }

    while (min < max) {

        if (this.options.unit === 'w' || this.options.unit === 'word') {
            string += ' ' + randomDictionaryWord(this.dictionary.words);
        }

        if ( isSentance() ) {
            string += '. ' + generateRandomSentence(this.dictionary.words,
                                                    this.options.sentence.min,
                                                    this.options.sentence.max);
        }

        if (this.options.unit === 'p' || this.options.unit === 'paragraph') {
            string += prefix + generateRandomParagraph(this.dictionary.words,
                                                       this.options.paragraph.min,
                                                       this.options.paragraph.max,
                                                       this.options.sentence.min,
                                                       this.options.sentence.max) + suffix;
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

        if ( isSentance() ){
          string = string + '.';
        }
    }

    if (this.options.utf8) {
        string = new Buffer(string).toString('utf-8');
    }

    if (this.options.format === 'json'  ) {
        string = { ipsum: string };
    }

    return string;

};

module.exports = function(opts) {
    return new BlindIpsum(opts);
};
