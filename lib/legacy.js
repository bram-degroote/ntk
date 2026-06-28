import { alphabetPosition, comparator, fillInEmpty } from './utils.js';

export function runLegacyTranslation(context) {
    const output = [];
    const sentence = context.textAreaSentence.value;
    const words = sentence.split(" ");
    
    context.renderMapping(words);

    const correction = context.textAreaCorrection.value;
    const codelevels = correction.split("\n");

    for (let i = 0; i < codelevels.length; i++) {
        const codes = codelevels[i].split(" ");
        output[i] = [];
        let previousIndex = -1;

        for (let j = 0; j < codes.length; j++) {
            const regex = /([a-z+]{1,})([0-9]+)/gi;
            const matches = regex.exec(codes[j].toLowerCase());

            if (matches) {
                const letters = matches[1].split("+");

                for (let l = 0; l < letters.length; l++) {
                    const positions = alphabetPosition(letters[l]);
                    let constituent = "";
                    let newPreviousIndex = null;

                    if (positions.length === 1) {
                        constituent = words[positions[0]];
                        newPreviousIndex = positions[0];
                    } else {
                        for (let k = positions[0]; k <= positions[1]; k++) {
                            constituent += words[k] + " ";
                        }
                        newPreviousIndex = positions[1];
                    }

                    output[i].push([constituent, matches[2], positions[0], newPreviousIndex]);
                    previousIndex = newPreviousIndex;
                }
            }
        }
        output[i].sort(comparator);
        output[i] = fillInEmpty(output[i], words);
    }
    return output;
}