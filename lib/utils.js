export const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');

export const alphabetPosition = text => 
  text.split('').map(x => alphabet.indexOf(x));

export const alphabetPositionUnique = x => alphabet.indexOf(x);

export const constituentCodes = {
    "pre2019": {
        "10": "Onderwerp", "11": "Eigenlijk onderwerp", "12": "Voorlopig onderwerp", "13": "Herhalend onderwerp", "14": "Loos onderwerp", "15": "Plaatsonderwerp",
        "21": "Werkwoordelijk gezegde", "22": "Persoonsvorm van het werkwoordelijk gezegde", "23": "Werkwoordelijke rest van het werkwoordelijk gezegde", "24": "Niet-werkwoordelijk deel van het werkwoordelijk gezegde", "25": "Naamwoordelijk gezegde", "26": "Persoonsvorm van het naamwoordelijk gezegde", "27": "Niet-werkwoordelijk deel van het naamwoordelijk gezegde", "28": "Werkwoordelijke rest van het naamwoordelijk gezegde",
        "30": "Lijdend voorwerp", "31": "Eigenlijk lijdend voorwerp", "32": "Voorlopig lijdend voorwerp", "33": "Herhalend lijdend voorwerp", "35": "Oorzakelijk voorwerp", "36": "Eigenlijk oorzakelijk voorwerp", "37": "Voorlopig oorzakelijk voorwerp", "38": "Herhalend oorzakelijk voorwerp",
        "40": "Meewerkend voorwerp", "41": "Eigenlijk meewerkend voorwerp", "42": "Voorlopig oorzakelijk voorwerp", "43": "Herhalend oorzakelijk voorwerp",
        "50": "Voorzetselvoorwerp", "51": "Eigenlijk voorzetselvoorwerp", "52": "Voorlopig voorzetselvoorwerp", "53": "Herhalend voorzetselvoorwerp",
        "61": "Voorwerp van plaats", "62": "Voorwerp van richting", "63": "Voorwerp van maat", "64": "Voorwerp van wijze", "65": "Voorwerp van tijd/duur", "68": "Voorwerp van bron", "69": "Bepaling van de handelende persoon",
        "70": "Bijwoordelijke bepaling (van modaliteit, ontkenning, middel, gevolg, vergelijking, beperking, verhouding)", "71": "Bijwoordelijke bepaling van plaats", "72": "Bijwoordelijke bepaling van richting", "73": "Bijwoordelijke bepaling van maat", "74": "Bijwoordelijke bepaling van wijze", "75": "Bijwoordelijke bepaling van tijd/duur", "76": "Bijwoordelijke bepaling van oorzaak/reden", "77": "Bijwoordelijke bepaling van doel", "78": "Bijwoordelijke bepaling van voorwaarde", "79": "Bijwoordelijke bepaling van toegeving",
        "80": "Predicatieve bepaling", "81": "Predicatief complement", "90": "Bijvoeglijke bepaling"
    }, 
    "2019": {
        "20": "PV", "21": "niet‐finiet werkwoordelijk deel", "21+": "niet‐finiet werkwoordelijk deel (voorlopig/herhalend)", "22": "niet‐werkwoordelijk deel", "22+": "niet‐werkwoordelijk deel (voorlopig/herhalend)", "23": "naamwoordelijk gezegde",
        "10": "onderwerp", "10+": "subjectscomplement / onderwerp (voorlopig/herhalend)",
        "30": "lijdend voorwerp", "30+": "objectscomplement / lijdend voorwerp (voorlopig/herhalend)",
        "40": "meewerkend voorwerp", "40+": "meewerkend voorwerp (voorlopig/herhalend)",
        "50": "voorzetselvoorwerp", "50+": "voorzetselvoorwerp (voorlopig/herhalend)",
        "61": "plaatsvoorwerp", "61+": "plaatsvoorwerp (voorlopig/herhalend)", "62": "richtingsvoorwerp", "62+": "richtingsvoorwerp (voorlopig/herhalend)", "63": "maatvoorwerp", "63+": "maatvoorwerp (voorlopig/herhalend)", "64": "voorwerp van wijze", "64+": "voorwerp van wijze (voorlopig/herhalend)", "65": "voorwerp van duur", "65+": "voorwerp van duur (voorlopig/herhalend)",
        "70": "bwb. (restcategorie)", "70+": "bwb. (restcategorie) (voorlopig/herhalend)", "71": "bwb. van plaats", "71+": "bwb. van plaats (voorlopig/herhalend)", "72": "bwb. van richting/pad", "72+": "bwb. van richting/pad (voorlopig/herhalend)", "73": "bwb. van maat/graad/hoeveelheid", "73+": "bwb. van maat/graad/hoeveelheid (voorlopig/herhalend)", "74": "bwb. van wijze", "74+": "bwb. van wijze (voorlopig/herhalend)", "75": "bwb. van tijd/duur", "75+": "bwb. van tijd/duur (voorlopig/herhalend)",
        "90": "bijvoeglijke bepaling", "90+": "bijvoeglijke bepaling (voorlopig/herhalend)", "91": "interne bijwoordelijke bepaling"
    }
};

export function comparator(a, b) {
    if (a[2] < b[2]) return -1;
    if (a[2] > b[2]) return 1;
    return 0;
}

export function fillInEmpty(outputRow, words) {
    let realPreviousIndex = -1;
    const constituentsCopy = JSON.parse(JSON.stringify(outputRow));

    for (let p = 0; p < constituentsCopy.length; p++) {
        const fillBottom = realPreviousIndex + 1;
        const fillTop = constituentsCopy[p][2];

        if (fillBottom != fillTop) {
            let fillerConstituent = "";
            for (let k = fillBottom; k < fillTop; k++) {
                fillerConstituent += words[k] + " ";
            }
            outputRow.push([fillerConstituent, "x", fillBottom, fillTop]);
        }
        realPreviousIndex = constituentsCopy[p][3];
    }
    outputRow.sort(comparator);
    return outputRow;
}

export function createConstituent(words, constituentFunction, mode) {
    const constituentDiv = document.createElement("div");
    constituentDiv.className = "constituent";
    constituentDiv.innerHTML = words;

    if (mode !== "2019" && typeof constituentCodes[mode]?.[constituentFunction] !== "undefined") {
        constituentDiv.title = constituentCodes[mode][constituentFunction];
    }

    const functionDiv = document.createElement("div");
    functionDiv.className = "function";
    functionDiv.innerHTML = constituentFunction;

    constituentDiv.appendChild(functionDiv);

    if (constituentFunction === "x") {
        constituentDiv.style.visibility = "hidden";
    }

    return constituentDiv;
}

export function renderOutput(outputData, divOutput, mode) {
    divOutput.innerHTML = "";

    for (const row of outputData) {
        const levelDiv = document.createElement("div");
        levelDiv.className = "level";

        for (const item of row) {
            const node = createConstituent(item[0], item[1], mode);
            levelDiv.innerHTML += " " + node.outerHTML;
        }
        divOutput.appendChild(levelDiv);
    }
}

export function renderMappingTable(words, divMappingTable) {
    if (!divMappingTable) return;
    divMappingTable.innerHTML = "";

    words.forEach((word, index) => {
        if (!word.trim()) return;

        const baseLetter = alphabet[index % 26];
        const primes = "'".repeat(Math.floor(index / 26));
        const letterKey = (baseLetter + primes).toUpperCase();

        const badge = document.createElement("span");
        badge.className = "badge bg-secondary text-white p-2 d-inline-block";
        badge.innerHTML = `<span class="text-warning fw-bold">${letterKey}</span>: ${word}`;
        
        divMappingTable.appendChild(badge);
    });
}