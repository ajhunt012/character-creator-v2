const classes = {
    barbarian: {
        hitPoints: 12,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"
        ],
        saves: ["Strength", "Constitution"]
    },
    bard: {
        hitPoints: 8,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History",
            "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception",
            "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
        ],
        saves: ["Dexterity", "Charisma"]
    },
    cleric: {
        hitPoints: 8,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "History", "Insight", "Medicine", "Persuasion", "Religion"
        ],
        saves: ["Wisdom", "Charisma"]
    },
    druid: {
        hitPoints: 8,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception",
            "Religion", "Survival"
        ],
        saves: ["Intelligence", "Wisdom"]
    },
    fighter: {
        hitPoints: 10,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation",
            "Perception", "Survival"
        ],
        saves: ["Strength", "Constitution"]
    },
    monk: {
        hitPoints: 8,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"
        ],
        saves: ["Strength", "Dexterity"]
    },
    paladin: {
        hitPoints: 10,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"
        ],
        saves: ["Wisdom", "Charisma"]
    },
    ranger: {
        hitPoints: 10,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception",
            "Stealth", "Survival"
        ],
        saves: ["Strength",
            "Dexterity"]
    },
    rogue: {
        hitPoints: 8,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation",
            "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"
        ],
        saves: ["Dexterity", "Intelligence"]
    },
    sorcerer: {
        hitPoints: 6,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"
        ],
        saves: ["Constitution", "Charisma"]
    },
    warlock: {
        hitPoints: 8,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature",
            "Religion"
        ],
        saves: ["Wisdom", "Charisma"]
    },
    wizard: {
        hitPoints: 6,
        hitPointModifier: function(constitution) {
            return constitution < 14 ? 2 : 3;
        },
        skills: [
            "Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"
        ],
        saves: ["Intelligence", "Wisdom"]
    }
};

var raceModifiers = {
    dragonborn: {
        strength: 2,
        charisma: 1
    },
    dwarf: {
        constitution: 2,
        wisdom: 1
    },
    elf: {
        dexterity: 2,
        intelligence: 1
    },
    gnome: {
        intelligence: 2,
        charisma: 1
    },
    halfElf: {
        charisma: 2,
        any: 1
    },
    halfOrc: {
        strength: 2,
        constitution: 1
    },
    halfling: {
        dexterity: 2,
        charisma: 1
    },
    human: {
        any: 1,
        any: 1
    },
    tiefling: {
        intelligence: 1,
        charisma: 2
    }
};

function calculateModifiers(stats) {
    var modifiers = {};
    Object.keys(stats).forEach(function(stat) {
        modifiers[stat] = Math.floor((stats[stat] - 10) / 2);
    });
    return modifiers;
}

function calculateRaceModifiers(race, stats) {
    var modifiers = calculateModifiers(stats);
    Object.keys(raceModifiers[race]).forEach(function(stat) {
        if (stat === "any") {
            Object.keys(stats).forEach(function(s) {
                if (stats[s] === 18) {
                    return;
                }
                stats[s] += raceModifiers[race][stat];
                modifiers = calculateModifiers(stats);
            });
        } else {
            stats[stat] += raceModifiers[race][stat];
            modifiers = calculateModifiers(stats);
        }
    });
    return {
        stats: stats,
        modifiers: modifiers
    };
}

function calculateClassModifiers(cls, stats) {
    var modifiers = calculateRaceModifiers(stats.race, stats).modifiers;
    var hitPoints = classes[cls].hitPoints + classes[cls].hitPointModifier(stats.constitution);
    var saves = classes[cls].saves;
    var skills = classes[cls].skills;
    return {
        hitPoints: hitPoints,
        saves: saves,
        skills: skills,
        modifiers: modifiers
    };
}

function createCharacter(stats, race, cls) {
    return {
        stats: stats,
        race: race,
        class: cls,
        hitPoints: calculateClassModifiers(cls, stats).hitPoints,
        saves: calculateClassModifiers(cls, stats).saves,
        skills: calculateClassModifiers(cls, stats).skills,
        modifiers: calculateClassModifiers(cls, stats).modifiers
    };
}
