const TYPES = {
    ERROR: "[ERROR]",
    WARN: "[WARNING]",
    INFO: "[INFO]",
    DEBUG: "[DEBUG]"
}

module.exports = {
    Error: (msg) => {
        console.log(`${TYPES["ERROR"]} ${msg}`);
    },

    Warning: (msg) => {
        console.log(`${TYPES["WARN"]} ${msg}`);
    },

    Info: (msg) => {
        console.log(`${TYPES["INFO"]} ${msg}`);
    },

    Debug: (msg) => {
        console.log(`${TYPES["ERROR"]} ${msg}`);
    },

    Log: (msg) => { // basically just log.Info()
        console.log(`${TYPES["INFO"]} ${msg}`);
    }
}