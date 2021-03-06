// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const { Deno: Deno1  } = globalThis;
const noColor = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code1) {
    return enabled ? `${code1.open}${str.replace(code1.regexp, code1.open)}${code1.close}` : str;
}
function bold(str) {
    return run(str, code([
        1
    ], 22));
}
function white(str) {
    return run(str, code([
        37
    ], 39));
}
function bgGreen(str) {
    return run(str, code([
        42
    ], 49));
}
function bgYellow(str) {
    return run(str, code([
        43
    ], 49));
}
function bgBrightBlack(str) {
    return run(str, code([
        100
    ], 49));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const colorMethods = {
    green: bgGreen,
    yellow: bgYellow,
    gray: bgBrightBlack
};
function colorLetter(color, letter) {
    const bg = colorMethods[color];
    const colorizedLetter = bg(bold(` ${white(letter)} `));
    return ` ${colorizedLetter} `;
}
const writePokemonFile = (pokemon1)=>{
    const encoder = new TextEncoder();
    const bytes = encoder.encode(pokemon1);
    return Deno.writeFile("./solution.txt", bytes);
};
const isArceusMode = Boolean(Deno.env.get('ARCEUS_MODE'));
const previousGuesses = [];
const randomId = Math.ceil(Math.random() * (850 - 1));
const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`).then((res)=>res.json()
).then((response)=>response.name.toUpperCase()
);
if (isArceusMode) {
    await writePokemonFile(pokemon);
}
let globalResults = "";
function askWord() {
    const response = prompt("The Pokemon is...");
    if (response == null) {
        return {
            error: "­ƒÆ¼ You must provide a possible pokemon name"
        };
    } else if (response.length !== pokemon.length) {
        return {
            error: "­ƒôÅ The pokemon name must be " + pokemon.length + " characters long"
        };
    } else if (previousGuesses.includes(response.toUpperCase())) {
        return {
            error: "­ƒôï You already tried this pokemon name!"
        };
    } else if (!/^[a-zA-Z]+$/.test(response)) {
        return {
            error: "­ƒôï The pokemon name must contain only letters"
        };
    }
    return {
        response: response.toUpperCase()
    };
}
function print(guess) {
    console.clear();
    let results = "";
    const letters = [
        ...guess
    ];
    letters.forEach((letter, index)=>{
        if (letter === pokemon[index]) {
            results += colorLetter("green", letter);
        } else if (pokemon.includes(letter)) {
            results += colorLetter("yellow", letter);
        } else {
            results += colorLetter("gray", letter);
        }
    });
    globalResults += `${results} \n\n`;
    console.log(globalResults);
}
function start(tries) {
    if (tries >= 6) {
        console.log("­ƒÆÑ You lost!");
        console.log("­ƒÆÑ The pokemon was " + pokemon);
        return;
    }
    let guess = "";
    while(guess === ""){
        const { error , response  } = askWord();
        if (error) {
            console.error(error);
            continue;
        }
        if (response) guess = response;
    }
    if (guess === pokemon) {
        print(guess);
        console.log("­ƒÄë You won!");
        return;
    } else {
        print(guess);
        console.log("");
        tries++;
        start(tries);
    }
}
let timesPlayed = +(localStorage.getItem("times_played") || 0);
timesPlayed++;
localStorage.setItem("times_played", timesPlayed.toString());
console.log("­ƒÄ« Let's play a game! Guess the Pokemon Name");
console.log(`­ƒÆí Hint: It has ${pokemon.length} characters... Good luck!`);
console.log(`­ƒöÑ You have played ${timesPlayed} times`);
start(0);

