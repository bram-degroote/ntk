import { alphabetPositionUnique, comparator, fillInEmpty } from './utils.js';

export function runModernTranslation(context) {
    const output = [];
    let sentence = context.textAreaSentence.value;
    sentence = sentence.replace(/\s\s+/g, " ");

    const words = sentence.split(" ");
    context.renderMapping(words);

    let correction = context.textAreaCorrection.value;
    correction = correction
        .replace(/[^\S\r\n][^\S\r\n]+/g, " ")
        .replace(/’/g, "'")
        .replace(/[”"]/g, "''");
        
    const codeLevels = correction.split("\n");

    for (let level = 0; level < codeLevels.length; level++) {
        const codes = codeLevels[level].match(/([a-z']{1,}[0-9+]+)/gi);
        output[level] = [];

        if (!codes) continue;

        let previousIndex = -1;

        for (const currentToken of codes) {
            const regex = /([a-z']{1,})([0-9+]+)/gi;
            const matches = regex.exec(currentToken.toLowerCase());

            if (matches) {
                const letters = matches[1];
                const constituentFunctionCode = matches[2];

                const letterSplitRegex = /([a-z][']*)([a-z][']*)?/gi;
                const letterMatches = letterSplitRegex.exec(letters);

                if (letterMatches === null) continue;

                const activeLetterClusters = letterMatches
                    .slice(1)
                    .filter(cluster => cluster !== undefined);
                
                let beginPosition = -1;
                let endPosition = -1;

                for (let letterIndex = 0; letterIndex < activeLetterClusters.length; letterIndex++) {
                    const cluster = activeLetterClusters[letterIndex];
                    const letter = cluster.slice(0, 1);
                    const position = alphabetPositionUnique(letter) + (26 * (cluster.length - 1));

                    if (letterIndex === 0) {
                        beginPosition = position;
                    }
                    endPosition = position;
                }

                let constituent = "";
                for (let pos = beginPosition; pos <= endPosition; pos++) {
                    constituent += words[pos] + " ";
                }

                output[level].push([constituent, constituentFunctionCode, beginPosition, endPosition]);
            } else {
                console.log("Error for code " + currentToken);
            }
        }
        output[level].sort(comparator);
        output[level] = fillInEmpty(output[level], words);
    }
    return output;
}