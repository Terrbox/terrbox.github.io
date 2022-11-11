const AC = {
  "-1": { extreme: 18, high: 15, moderate: 14, low: 12 },
  0: { extreme: 19, high: 16, moderate: 15, low: 13 },
  1: { extreme: 19, high: 16, moderate: 15, low: 13 },
  2: { extreme: 21, high: 18, moderate: 17, low: 15 },
  3: { extreme: 22, high: 19, moderate: 18, low: 16 },
  4: { extreme: 24, high: 21, moderate: 20, low: 18 },
  5: { extreme: 25, high: 22, moderate: 21, low: 19 },
  6: { extreme: 27, high: 24, moderate: 23, low: 21 },
  7: { extreme: 28, high: 25, moderate: 24, low: 22 },
  8: { extreme: 30, high: 27, moderate: 26, low: 24 },
  9: { extreme: 31, high: 28, moderate: 27, low: 25 },
  10: { extreme: 33, high: 30, moderate: 29, low: 27 },
  11: { extreme: 34, high: 31, moderate: 30, low: 28 },
  12: { extreme: 36, high: 33, moderate: 32, low: 30 },
  13: { extreme: 37, high: 34, moderate: 33, low: 31 },
  14: { extreme: 39, high: 36, moderate: 35, low: 33 },
  15: { extreme: 40, high: 37, moderate: 36, low: 34 },
  16: { extreme: 42, high: 39, moderate: 38, low: 36 },
  17: { extreme: 43, high: 40, moderate: 39, low: 37 },
  18: { extreme: 45, high: 42, moderate: 41, low: 39 },
  19: { extreme: 46, high: 43, moderate: 42, low: 40 },
  20: { extreme: 48, high: 45, moderate: 44, low: 42 },
  21: { extreme: 49, high: 46, moderate: 45, low: 43 },
  22: { extreme: 51, high: 48, moderate: 47, low: 45 },
  23: { extreme: 52, high: 49, moderate: 48, low: 46 },
  24: { extreme: 54, high: 51, moderate: 50, low: 48 },
};

const abilityModifiers = {
  "-1": { extreme: "+5", high: "+3", moderate: "+2", low: "+0" },
  0: { extreme: "+5", high: "+3", moderate: "+2", low: "+0" },
  1: { extreme: "+5", high: "+4", moderate: "+3", low: "+1" },
  2: { extreme: "+5", high: "+4", moderate: "+3", low: "+1" },
  3: { extreme: "+5", high: "+4", moderate: "+3", low: "+1" },
  4: { extreme: "+6", high: "+5", moderate: "+3", low: "+2" },
  5: { extreme: "+6", high: "+5", moderate: "+4", low: "+2" },
  6: { extreme: "+7", high: "+5", moderate: "+4", low: "+2" },
  7: { extreme: "+7", high: "+6", moderate: "+4", low: "+2" },
  8: { extreme: "+7", high: "+6", moderate: "+4", low: "+3" },
  9: { extreme: "+7", high: "+6", moderate: "+4", low: "+3" },
  10: { extreme: "+8", high: "+7", moderate: "+5", low: "+3" },
  11: { extreme: "+8", high: "+7", moderate: "+5", low: "+3" },
  12: { extreme: "+8", high: "+7", moderate: "+5", low: "+4" },
  13: { extreme: "+9", high: "+8", moderate: "+5", low: "+4" },
  14: { extreme: "+9", high: "+8", moderate: "+5", low: "+4" },
  15: { extreme: "+9", high: "+8", moderate: "+6", low: "+4" },
  16: { extreme: "+10", high: "+9", moderate: "+6", low: "+5" },
  17: { extreme: "+10", high: "+9", moderate: "+6", low: "+5" },
  18: { extreme: "+10", high: "+9", moderate: "+6", low: "+5" },
  19: { extreme: "+11", high: "+10", moderate: "+6", low: "+5" },
  20: { extreme: "+11", high: "+10", moderate: "+7", low: "+6" },
  21: { extreme: "+11", high: "+10", moderate: "+7", low: "+6" },
  22: { extreme: "+11", high: "+10", moderate: "+8", low: "+6" },
  23: { extreme: "+11", high: "+10", moderate: "+8", low: "+6" },
  24: { extreme: "+13", high: "+12", moderate: "+9", low: "+7" },
};

const perception = {
  "-1": {
    extreme: "+9",
    high: "+8",
    moderate: "+5",
    low: "+2",
    terrible: "+0",
  },
  0: { extreme: "+10", high: "+9", moderate: "+6", low: "+3", terrible: "+1" },
  1: { extreme: "+11", high: "+10", moderate: "+7", low: "+4", terrible: "+2" },
  2: { extreme: "+12", high: "+11", moderate: "+8", low: "+5", terrible: "+3" },
  3: { extreme: "+14", high: "+12", moderate: "+9", low: "+6", terrible: "+4" },
  4: {
    extreme: "+15",
    high: "+14",
    moderate: "+11",
    low: "+8",
    terrible: "+6",
  },
  5: {
    extreme: "+17",
    high: "+15",
    moderate: "+12",
    low: "+9",
    terrible: "+7",
  },
  6: {
    extreme: "+18",
    high: "+17",
    moderate: "+14",
    low: "+11",
    terrible: "+8",
  },
  7: {
    extreme: "+20",
    high: "+18",
    moderate: "+15",
    low: "+12",
    terrible: "+10",
  },
  8: {
    extreme: "+21",
    high: "+19",
    moderate: "+16",
    low: "+13",
    terrible: "+11",
  },
  9: {
    extreme: "+23",
    high: "+21",
    moderate: "+18",
    low: "+15",
    terrible: "+12",
  },
  10: {
    extreme: "+24",
    high: "+22",
    moderate: "+19",
    low: "+16",
    terrible: "+14",
  },
  11: {
    extreme: "+26",
    high: "+24",
    moderate: "+21",
    low: "+18",
    terrible: "+15",
  },
  12: {
    extreme: "+27",
    high: "+25",
    moderate: "+22",
    low: "+19",
    terrible: "+16",
  },
  13: {
    extreme: "+29",
    high: "+26",
    moderate: "+23",
    low: "+20",
    terrible: "+18",
  },
  14: {
    extreme: "+30",
    high: "+28",
    moderate: "+25",
    low: "+22",
    terrible: "+19",
  },
  15: {
    extreme: "+32",
    high: "+29",
    moderate: "+26",
    low: "+23",
    terrible: "+20",
  },
  16: {
    extreme: "+33",
    high: "+30",
    moderate: "+28",
    low: "+25",
    terrible: "+22",
  },
  17: {
    extreme: "+35",
    high: "+32",
    moderate: "+29",
    low: "+26",
    terrible: "+23",
  },
  18: {
    extreme: "+36",
    high: "+33",
    moderate: "+30",
    low: "+27",
    terrible: "+24",
  },
  19: {
    extreme: "+38",
    high: "+35",
    moderate: "+32",
    low: "+29",
    terrible: "+26",
  },
  20: {
    extreme: "+39",
    high: "+36",
    moderate: "+33",
    low: "+30",
    terrible: "+27",
  },
  21: {
    extreme: "+41",
    high: "+38",
    moderate: "+35",
    low: "+32",
    terrible: "+28",
  },
  22: {
    extreme: "+43",
    high: "+39",
    moderate: "+36",
    low: "+33",
    terrible: "+30",
  },
  23: {
    extreme: "+44",
    high: "+40",
    moderate: "+37",
    low: "+34",
    terrible: "+31",
  },
  24: {
    extreme: "+46",
    high: "+42",
    moderate: "+38",
    low: "+36",
    terrible: "+32",
  },
};

const skills = {
  "-1": { extreme: "+8", high: "+5", moderate: "+4", low: "+2" },
  0: { extreme: "+9", high: "+6", moderate: "+5", low: "+3" },
  1: { extreme: "+10", high: "+7", moderate: "+6", low: "+4" },
  2: { extreme: "+11", high: "+8", moderate: "+7", low: "+5" },
  3: { extreme: "+13", high: "+10", moderate: "+9", low: "+6" },
  4: { extreme: "+15", high: "+12", moderate: "+10", low: "+7" },
  5: { extreme: "+16", high: "+13", moderate: "+12", low: "+9" },
  6: { extreme: "+18", high: "+15", moderate: "+13", low: "+10" },
  7: { extreme: "+20", high: "+17", moderate: "+15", low: "+12" },
  8: { extreme: "+21", high: "+18", moderate: "+16", low: "+13" },
  9: { extreme: "+23", high: "+20", moderate: "+18", low: "+14" },
  10: { extreme: "+25", high: "+22", moderate: "+19", low: "+16" },
  11: { extreme: "+26", high: "+23", moderate: "+21", low: "+17" },
  12: { extreme: "+28", high: "+25", moderate: "+22", low: "+19" },
  13: { extreme: "+30", high: "+27", moderate: "+24", low: "+20" },
  14: { extreme: "+31", high: "+28", moderate: "+25", low: "+22" },
  15: { extreme: "+33", high: "+30", moderate: "+27", low: "+23" },
  16: { extreme: "+35", high: "+32", moderate: "+28", low: "+25" },
  17: { extreme: "+36", high: "+33", moderate: "+30", low: "+26" },
  18: { extreme: "+38", high: "+35", moderate: "+31", low: "+28" },
  19: { extreme: "+40", high: "+37", moderate: "+33", low: "+29" },
  20: { extreme: "+41", high: "+38", moderate: "+34", low: "+30" },
  21: { extreme: "+43", high: "+40", moderate: "+36", low: "+31" },
  22: { extreme: "+45", high: "+42", moderate: "+37", low: "+33" },
  23: { extreme: "+46", high: "+43", moderate: "+38", low: "+34" },
  24: { extreme: "+48", high: "+45", moderate: "+40", low: "+36" },
};

const savingThrows = {
  "-1": {
    extreme: "+9",
    high: "+8",
    moderate: "+5",
    low: "+2",
    terrible: "+0",
  },
  0: { extreme: "+10", high: "+9", moderate: "+6", low: "+3", terrible: "+1" },
  1: { extreme: "+11", high: "+10", moderate: "+7", low: "+4", terrible: "+2" },
  2: { extreme: "+12", high: "+11", moderate: "+8", low: "+5", terrible: "+3" },
  3: { extreme: "+14", high: "+12", moderate: "+9", low: "+6", terrible: "+4" },
  4: {
    extreme: "+15",
    high: "+14",
    moderate: "+11",
    low: "+8",
    terrible: "+6",
  },
  5: {
    extreme: "+17",
    high: "+15",
    moderate: "+12",
    low: "+9",
    terrible: "+7",
  },
  6: {
    extreme: "+18",
    high: "+17",
    moderate: "+14",
    low: "+11",
    terrible: "+8",
  },
  7: {
    extreme: "+20",
    high: "+18",
    moderate: "+15",
    low: "+12",
    terrible: "+10",
  },
  8: {
    extreme: "+21",
    high: "+19",
    moderate: "+16",
    low: "+13",
    terrible: "+11",
  },
  9: {
    extreme: "+23",
    high: "+21",
    moderate: "+18",
    low: "+15",
    terrible: "+12",
  },
  10: {
    extreme: "+24",
    high: "+22",
    moderate: "+19",
    low: "+16",
    terrible: "+14",
  },
  11: {
    extreme: "+26",
    high: "+24",
    moderate: "+21",
    low: "+18",
    terrible: "+15",
  },
  12: {
    extreme: "+27",
    high: "+25",
    moderate: "+22",
    low: "+19",
    terrible: "+16",
  },
  13: {
    extreme: "+29",
    high: "+26",
    moderate: "+23",
    low: "+20",
    terrible: "+18",
  },
  14: {
    extreme: "+30",
    high: "+28",
    moderate: "+25",
    low: "+22",
    terrible: "+19",
  },
  15: {
    extreme: "+32",
    high: "+29",
    moderate: "+26",
    low: "+23",
    terrible: "+20",
  },
  16: {
    extreme: "+33",
    high: "+30",
    moderate: "+28",
    low: "+25",
    terrible: "+22",
  },
  17: {
    extreme: "+35",
    high: "+32",
    moderate: "+29",
    low: "+26",
    terrible: "+23",
  },
  18: {
    extreme: "+36",
    high: "+33",
    moderate: "+30",
    low: "+27",
    terrible: "+24",
  },
  19: {
    extreme: "+38",
    high: "+35",
    moderate: "+32",
    low: "+29",
    terrible: "+26",
  },
  20: {
    extreme: "+39",
    high: "+36",
    moderate: "+33",
    low: "+30",
    terrible: "+27",
  },
  21: {
    extreme: "+41",
    high: "+38",
    moderate: "+35",
    low: "+32",
    terrible: "+28",
  },
  22: {
    extreme: "+43",
    high: "+39",
    moderate: "+36",
    low: "+33",
    terrible: "+30",
  },
  23: {
    extreme: "+44",
    high: "+40",
    moderate: "+37",
    low: "+34",
    terrible: "+31",
  },
  24: {
    extreme: "+46",
    high: "+42",
    moderate: "+38",
    low: "+36",
    terrible: "+32",
  },
};

const HP = {
  "-1": { extreme: "9", moderate: "8-7", low: "6-5" },
  0: { extreme: "20-17", moderate: "16-14", low: "13-11" },
  1: { extreme: "26-24", moderate: "21-19", low: "16-14" },
  2: { extreme: "40-36", moderate: "32-28", low: "25-21" },
  3: { extreme: "59-53", moderate: "48-42", low: "37-31" },
  4: { extreme: "78-72", moderate: "63-57", low: "48-42" },
  5: { extreme: "97-91", moderate: "78-72", low: "59-53" },
  6: { extreme: "123-115", moderate: "99-91", low: "75-67" },
  7: { extreme: "148-140", moderate: "119-111", low: "90-82" },
  8: { extreme: "173-165", moderate: "139-131", low: "105-97" },
  9: { extreme: "198-190", moderate: "159-151", low: "120-112" },
  10: { extreme: "223-215", moderate: "179-171", low: "135-127" },
  11: { extreme: "248-240", moderate: "199-191", low: "150-142" },
  12: { extreme: "273-265", moderate: "219-211", low: "165-157" },
  13: { extreme: "298-290", moderate: "239-231", low: "180-172" },
  14: { extreme: "323-315", moderate: "259-251", low: "195-187" },
  15: { extreme: "348-340", moderate: "279-271", low: "210-202" },
  16: { extreme: "373-365", moderate: "299-291", low: "225-217" },
  17: { extreme: "398-390", moderate: "319-311", low: "240-232" },
  18: { extreme: "423-415", moderate: "339-331", low: "255-247" },
  19: { extreme: "448-440", moderate: "359-351", low: "270-262" },
  20: { extreme: "473-465", moderate: "379-371", low: "285-277" },
  21: { extreme: "505-495", moderate: "405-395", low: "305-295" },
  22: { extreme: "544-532", moderate: "436-424", low: "329-317" },
  23: { extreme: "581-569", moderate: "466-454", low: "351-339" },
  24: { extreme: "633-617", moderate: "508-492", low: "383-367" },
};

const strikeAttackBonus = {
  "-1": { extreme: "+10", high: "+8", moderate: "+6", low: "+4" },
  0: { extreme: "+10", high: "+8", moderate: "+6", low: "+4" },
  1: { extreme: "+11", high: "+9", moderate: "+7", low: "+5" },
  2: { extreme: "+13", high: "+11", moderate: "+9", low: "+7" },
  3: { extreme: "+14", high: "+12", moderate: "+10", low: "+8" },
  4: { extreme: "+16", high: "+14", moderate: "+12", low: "+9" },
  5: { extreme: "+17", high: "+15", moderate: "+13", low: "+11" },
  6: { extreme: "+19", high: "+17", moderate: "+15", low: "+12" },
  7: { extreme: "+20", high: "+18", moderate: "+16", low: "+13" },
  8: { extreme: "+22", high: "+20", moderate: "+18", low: "+15" },
  9: { extreme: "+23", high: "+21", moderate: "+19", low: "+16" },
  10: { extreme: "+25", high: "+23", moderate: "+21", low: "+17" },
  11: { extreme: "+27", high: "+24", moderate: "+22", low: "+19" },
  12: { extreme: "+28", high: "+26", moderate: "+24", low: "+20" },
  13: { extreme: "+29", high: "+27", moderate: "+25", low: "+21" },
  14: { extreme: "+31", high: "+29", moderate: "+27", low: "+23" },
  15: { extreme: "+32", high: "+30", moderate: "+28", low: "+24" },
  16: { extreme: "+34", high: "+32", moderate: "+30", low: "+25" },
  17: { extreme: "+35", high: "+33", moderate: "+31", low: "+27" },
  18: { extreme: "+37", high: "+35", moderate: "+33", low: "+28" },
  19: { extreme: "+38", high: "+36", moderate: "+34", low: "+29" },
  20: { extreme: "+40", high: "+38", moderate: "+36", low: "+31" },
  21: { extreme: "+41", high: "+39", moderate: "+37", low: "+32" },
  22: { extreme: "+43", high: "+41", moderate: "+39", low: "+33" },
  23: { extreme: "+44", high: "+42", moderate: "+40", low: "+35" },
  24: { extreme: "+46", high: "+44", moderate: "+42", low: "+36" },
};

const strikeDamage = {
  "-1": {
    extreme: "1d6+1 (4)",
    high: "1d4+1 (3)",
    moderate: "1d4 (3)",
    low: "1d4 (2)",
  },
  0: {
    extreme: "1d6+3 (6)",
    high: "1d6+2 (5)",
    moderate: "1d4+2 (4)",
    low: "1d4+1 (3)",
  },
  1: {
    extreme: "1d8+4 (8)",
    high: "1d6+3 (6)",
    moderate: "1d6+2 (5)",
    low: "1d4+2 (4)",
  },
  2: {
    extreme: "1d12+4 (11)",
    high: "1d10+4 (9)",
    moderate: "1d8+4 (8)",
    low: "1d6+3 (6)",
  },
  3: {
    extreme: "1d12+8 (15)",
    high: "1d10+6 (12)",
    moderate: "1d8+6 (10)",
    low: "1d6+5 (8)",
  },
  4: {
    extreme: "2d10+7 (18)",
    high: "2d8+5 (14)",
    moderate: "2d6+5 (12)",
    low: "2d4+4 (9)",
  },
  5: {
    extreme: "2d12+7 (20)",
    high: "2d8+7 (16)",
    moderate: "2d6+6 (13)",
    low: "2d4+6 (11)",
  },
  6: {
    extreme: "2d12+10 (23)",
    high: "2d8+9 (18)",
    moderate: "2d6+8 (15)",
    low: "2d4+7 (12)",
  },
  7: {
    extreme: "2d12+12 (25)",
    high: "2d10+9 (20)",
    moderate: "2d8+8 (17)",
    low: "2d6+6 (13)",
  },
  8: {
    extreme: "2d12+15 (28)",
    high: "2d10+11 (22)",
    moderate: "2d8+9 (18)",
    low: "2d6+8 (15)",
  },
  9: {
    extreme: "2d12+17 (30)",
    high: "2d10+13 (24)",
    moderate: "2d8+11 (20)",
    low: "2d6+9 (16)",
  },
  10: {
    extreme: "2d12+20 (33)",
    high: "2d12+13 (26)",
    moderate: "2d10+11 (22)",
    low: "2d6+10 (17)",
  },
  11: {
    extreme: "2d12+22 (35)",
    high: "2d12+15 (28)",
    moderate: "2d10+12 (23)",
    low: "2d8+10 (19)",
  },
  12: {
    extreme: "3d12+19 (38)",
    high: "3d10+14 (30)",
    moderate: "3d8+12 (25)",
    low: "3d6+10 (20)",
  },
  13: {
    extreme: "3d12+21 (40)",
    high: "3d10+16 (32)",
    moderate: "3d8+14 (27)",
    low: "3d6+11 (21)",
  },
  14: {
    extreme: "3d12+24 (43)",
    high: "3d10+18 (34)",
    moderate: "3d8+15 (28)",
    low: "3d6+13 (23)",
  },
  15: {
    extreme: "3d12+26 (45)",
    high: "3d12+17 (36)",
    moderate: "3d10+14 (30)",
    low: "3d6+14 (24)",
  },
  16: {
    extreme: "3d12+29 (48)",
    high: "3d12+18 (37)",
    moderate: "3d10+15 (31)",
    low: "3d6+15 (25)",
  },
  17: {
    extreme: "3d12+31 (50)",
    high: "3d12+19 (38)",
    moderate: "3d10+16 (32)",
    low: "3d6+16 (26)",
  },
  18: {
    extreme: "3d12+34 (53)",
    high: "3d12+20 (40)",
    moderate: "3d10+17 (33)",
    low: "3d6+17 (27)",
  },
  19: {
    extreme: "4d12+29 (55)",
    high: "4d10+20 (42)",
    moderate: "4d8+17 (35)",
    low: "4d6+14 (28)",
  },
  20: {
    extreme: "4d12+32 (58)",
    high: "4d10+22 (44)",
    moderate: "4d8+19 (37)",
    low: "4d6+15 (29)",
  },
  21: {
    extreme: "4d12+34 (60)",
    high: "4d10+24 (46)",
    moderate: "4d8+20 (38)",
    low: "4d6+17 (31)",
  },
  22: {
    extreme: "4d12+37 (63)",
    high: "4d10+26 (48)",
    moderate: "4d8+22 (40)",
    low: "4d6+18 (32)",
  },
  23: {
    extreme: "4d12+39 (65)",
    high: "4d12+24 (50)",
    moderate: "4d10+20 (42)",
    low: "4d6+19 (33)",
  },
  24: {
    extreme: "4d12+42 (68)",
    high: "4d12+26 (52)",
    moderate: "4d10+22 (44)",
    low: "4d6+21 (35)",
  },
};

const spells = {
  "-1": {
    extremeDC: 19,
    ////extremeSpellAtk: "+11",
    highDC: 16,
    ////highSpellAtk: "+8",
    moderateDC: 13,
    ////moderateSpellAtk: "+5",
  },
  0: {
    extremeDC: 19,
    //extremeSpellAtk: "+11",
    highDC: 16,
    //highSpellAtk: "+8",
    moderateDC: 13,
    //moderateSpellAtk: "+5",
  },
  1: {
    extremeDC: 20,
    //extremeSpellAtk: "+12",
    highDC: 17,
    //highSpellAtk: "+9",
    moderateDC: 14,
    //moderateSpellAtk: "+6",
  },
  2: {
    extremeDC: 22,
    //extremeSpellAtk: "+14",
    highDC: 18,
    //highSpellAtk: "+10",
    moderateDC: 15,
    //moderateSpellAtk: "+7",
  },
  3: {
    extremeDC: 23,
    //extremeSpellAtk: "+15",
    highDC: 20,
    //highSpellAtk: "+12",
    moderateDC: 17,
    //moderateSpellAtk: "+9",
  },
  4: {
    extremeDC: 25,
    //extremeSpellAtk: "+17",
    highDC: 21,
    //highSpellAtk: "+13",
    moderateDC: 18,
    //moderateSpellAtk: "+10",
  },
  5: {
    extremeDC: 26,
    //extremeSpellAtk: "+18",
    highDC: 22,
    //highSpellAtk: "+14",
    moderateDC: 19,
    //moderateSpellAtk: "+11",
  },
  6: {
    extremeDC: 27,
    //extremeSpellAtk: "+19",
    highDC: 24,
    //highSpellAtk: "+16",
    moderateDC: 21,
    //moderateSpellAtk: "+13",
  },
  7: {
    extremeDC: 29,
    //extremeSpellAtk: "+21",
    highDC: 25,
    //highSpellAtk: "+17",
    moderateDC: 22,
    //moderateSpellAtk: "+14",
  },
  8: {
    extremeDC: 30,
    //extremeSpellAtk: "+22",
    highDC: 26,
    //highSpellAtk: "+18",
    moderateDC: 23,
    //moderateSpellAtk: "+15",
  },
  9: {
    extremeDC: 32,
    //extremeSpellAtk: "+24",
    highDC: 28,
    //highSpellAtk: "+20",
    moderateDC: 25,
    //moderateSpellAtk: "+17",
  },
  10: {
    extremeDC: 33,
    //extremeSpellAtk: "+25",
    highDC: 29,
    //highSpellAtk: "+21",
    moderateDC: 26,
    //moderateSpellAtk: "+18",
  },
  11: {
    extremeDC: 34,
    //extremeSpellAtk: "+26",
    highDC: 30,
    //highSpellAtk: "+22",
    moderateDC: 27,
    //moderateSpellAtk: "+19",
  },
  12: {
    extremeDC: 36,
    //extremeSpellAtk: "+28",
    highDC: 32,
    //highSpellAtk: "+24",
    moderateDC: 29,
    //moderateSpellAtk: "+21",
  },
  13: {
    extremeDC: 37,
    //extremeSpellAtk: "+29",
    highDC: 33,
    //highSpellAtk: "+25",
    moderateDC: 30,
    //moderateSpellAtk: "+22",
  },
  14: {
    extremeDC: 39,
    //extremeSpellAtk: "+31",
    highDC: 34,
    //highSpellAtk: "+26",
    moderateDC: 31,
    //moderateSpellAtk: "+23",
  },
  15: {
    extremeDC: 40,
    //extremeSpellAtk: "+32",
    highDC: 36,
    //highSpellAtk: "+28",
    moderateDC: 33,
    //moderateSpellAtk: "+25",
  },
  16: {
    extremeDC: 41,
    //extremeSpellAtk: "+33",
    highDC: 37,
    //highSpellAtk: "+29",
    moderateDC: 34,
    //moderateSpellAtk: "+26",
  },
  17: {
    extremeDC: 43,
    //extremeSpellAtk: "+35",
    highDC: 38,
    //highSpellAtk: "+30",
    moderateDC: 35,
    //moderateSpellAtk: "+27",
  },
  18: {
    extremeDC: 44,
    //extremeSpellAtk: "+36",
    highDC: 40,
    //highSpellAtk: "+32",
    moderateDC: 37,
    //moderateSpellAtk: "+29",
  },
  19: {
    extremeDC: 46,
    //extremeSpellAtk: "+38",
    highDC: 41,
    //highSpellAtk: "+33",
    moderateDC: 38,
    //moderateSpellAtk: "+30",
  },
  20: {
    extremeDC: 47,
    //extremeSpellAtk: "+39",
    highDC: 42,
    //highSpellAtk: "+34",
    moderateDC: 39,
    //moderateSpellAtk: "+31",
  },
  21: {
    extremeDC: 48,
    //extremeSpellAtk: "+40",
    highDC: 44,
    //highSpellAtk: "+36",
    moderateDC: 41,
    //moderateSpellAtk: "+33",
  },
  22: {
    extremeDC: 50,
    //extremeSpellAtk: "+42",
    highDC: 45,
    //highSpellAtk: "+37",
    moderateDC: 42,
    //moderateSpellAtk: "+34",
  },
  23: {
    extremeDC: 51,
    //extremeSpellAtk: "+43",
    highDC: 46,
    //highSpellAtk: "+38",
    moderateDC: 43,
    //moderateSpellAtk: "+35",
  },
  24: {
    extremeDC: 52,
    //extremeSpellAtk: "+44",
    highDC: 48,
    //highSpellAtk: "+40",
    moderateDC: 45,
    //moderateSpellAtk: "+37",
  },
};

const areaDamage = {
  "-1": { unlimited: "1d4 (2)", limited: "1d6 (4)" },
  0: { unlimited: "1d6 (4)", limited: "1d10 (6)" },
  1: { unlimited: "2d4 (5)", limited: "2d6 (7)" },
  2: { unlimited: "2d6 (7)", limited: "3d6 (11)" },
  3: { unlimited: "2d8 (9)", limited: "4d6 (14)" },
  4: { unlimited: "3d6 (11)", limited: "5d6 (18)" },
  5: { unlimited: "2d10 (12)", limited: "6d6 (21)" },
  6: { unlimited: "4d6 (14)", limited: "7d6 (25)" },
  7: { unlimited: "4d6 (15)", limited: "8d6 (28)" },
  8: { unlimited: "5d6 (17)", limited: "9d6 (32)" },
  9: { unlimited: "5d6 (18)", limited: "10d6 (35)" },
  10: { unlimited: "6d6 (20)", limited: "11d6 (39)" },
  11: { unlimited: "6d6 (21)", limited: "12d6 (42)" },
  12: { unlimited: "5d8 (23)", limited: "13d6 (46)" },
  13: { unlimited: "7d6 (24)", limited: "14d6 (49)" },
  14: { unlimited: "4d12 (26)", limited: "15d6 (53)" },
  15: { unlimited: "6d8 (27)", limited: "16d6 (56)" },
  16: { unlimited: "8d6 (28)", limited: "17d6 (60)" },
  17: { unlimited: "8d6 (29)", limited: "18d6 (63)" },
  18: { unlimited: "9d6 (30)", limited: "19d6 (67)" },
  19: { unlimited: "7d8 (32)", limited: "20d6 (70)" },
  20: { unlimited: "6d10 (33)", limited: "21d6 (74)" },
  21: { unlimited: "10d6 (35)", limited: "22d6 (77)" },
  22: { unlimited: "8d8 (36)", limited: "23d6 (81)" },
  23: { unlimited: "11d6 (38)", limited: "24d6 (84)" },
  24: { unlimited: "11d6 (39)", limited: "25d6 (88)" },
};

const diceValues = {
  4: 2.5,
  6: 3.5,
  8: 4.5,
  10: 5.5,
  12: 6.5,
};

function getEquivalentValueWithLevel(
  table,
  originalLevel,
  originalValue,
  newLevel
) {
  console.log(originalValue);
  const originalImmutedValue = originalValue;
  var originalTable = table[originalLevel];
  var difference = 0;
  var selectedKey = false;
  var dice = false;

  if (typeof originalValue === "string" && originalValue.includes("d")) {
    let value = 0;
    dice = true;
    var originalDice = originalValue.split("d");
    var originalDiceTwo = originalDice[1];
    var originalDiceThree = false;

    if (originalDiceTwo.includes("+") || originalDiceTwo.includes("-")) {
      if (originalDiceTwo.includes("+"))
        originalDiceTwo = originalDiceTwo.split("+");
      else originalDiceTwo = originalDiceTwo.split("-");

      originalDiceThree = originalDiceTwo[1];
      originalDiceTwo = originalDiceTwo[0];
    }

    value =
      parseFloat(originalDice[0]) *
      parseFloat(diceValues[parseInt(originalDice[1])]);

    if (originalDiceThree) {
      value += parseInt(originalDiceThree);
    }

    originalValue = value;
  }

  Object.keys(originalTable).forEach((k) => {
    const row = originalTable[k];
    var numericValue = row;

    if (typeof row === "string") {
      if (row.indexOf("-") > -1) {
        numericValue = numericValue.split("-");
        numericValue = parseInt(
          (parseInt(numericValue[0]) + parseInt(numericValue[1])) / 2
        );
      } else if (row.indexOf("(") > -1) {
        numericValue = numericValue.split("(");
        numericValue = parseInt(numericValue[1].replace(")", ""));
      } else {
        numericValue = parseInt(numericValue);
      }
    }

    if (numericValue === originalValue) {
      selectedKey = k;
      difference = "encountered";
    }

    let diff;

    if (originalValue > numericValue)
      diff = Math.abs(originalValue - numericValue);
    else diff = Math.abs(numericValue - originalValue);

    if (
      difference !== "encountered" &&
      (diff < difference || difference === 0)
    ) {
      difference = diff;
      selectedKey = k;
    }
  });
  console.log("mutted: " + originalValue);
  console.log("result: " + table[newLevel][selectedKey]);
  if (
    selectedKey &&
    (difference < 5 || difference === "encountered" || dice === false)
  ) {
    return table[newLevel][selectedKey];
  } else return originalImmutedValue.toString();
}

export {
  AC,
  abilityModifiers,
  perception,
  skills,
  savingThrows,
  HP,
  strikeAttackBonus,
  strikeDamage,
  spells,
  areaDamage,
  getEquivalentValueWithLevel,
};
