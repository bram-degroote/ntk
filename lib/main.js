import { renderOutput, renderMappingTable } from './utils.js';
import { runLegacyTranslation } from './legacy.js';
import { runModernTranslation } from './modern.js';

const urlParams = new URLSearchParams(window.location.search);

let translateTimeout = null;
let constituentCodeMode = "2019";

let textAreaSentence, textAreaCorrection, divOutput, divMappingTable;

function boot() {
    textAreaSentence = document.getElementById("sentence");
    textAreaCorrection = document.getElementById("correction");
    divOutput = document.getElementById("output");
    divMappingTable = document.getElementById("mapping-table");

    setTranslationFunctions();
}

function handleTranslation() {
    clearTimeout(translateTimeout);

    translateTimeout = window.setTimeout(() => {
        let outputData = [];
        const context = {
            textAreaSentence,
            textAreaCorrection,
            renderMapping: (words) => renderMappingTable(words, divMappingTable)
        };

        if (constituentCodeMode === "2019") {
            outputData = runModernTranslation(context);
        } else {
            outputData = runLegacyTranslation(context);
        }

        renderOutput(outputData, divOutput, constituentCodeMode);
    }, 20);
}

function setTranslationFunctions() {
    if (!urlParams.has("pre2019")) {
        constituentCodeMode = "2019";
    } else {
        constituentCodeMode = "pre2019";
    }

    textAreaCorrection.oninput = handleTranslation;
    textAreaSentence.oninput = handleTranslation;

    handleTranslation();
}

boot()