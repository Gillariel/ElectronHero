// Non strum note are automatic when other than previous.
// if it is forced as a strummed one :
//    the two note are trigger (forced + normal)
//    Same when noteOff
const NOTE_NUMBER = {
    GREEN_NORMAL: 96,
    RED_NORMAL: 97,
    YELLOW_NORMAL: 98,
    BLUE_NORMAL: 99,
    ORANGE_NORMAL: 100,

    GREEN_FORCED: 101,
    RED_FORCED: 102,
    YELLOW_FORCED: 103,
    BLUE_FORCED: 104,
    ORANGE_FORCED: 105,

    STAR_POWER: 116,
}

const TYPE = {
    TAP_NOTE: "sysEx",
    START_NOTE: "noteOn",
    END_NOTE: "noteOff",
    FILE_END: "endOfTrack"
}

// Check the next noteOn to know what type of color it is!
const TAP_NOTE_DATA = {
    DELTA: "deltaTime",
    TYPE: "type",
    DATA: {
        FIRST: 0,
        SECOND: 1,
        THIRD: 2,
        FORTH: 3,
        FIFTH: 4,
        SIXTH: 5,

        // Evaluate at 1 for activation, 0 for release
        SEVENTH: 6,
        EIGHT: 7,
    }
}

