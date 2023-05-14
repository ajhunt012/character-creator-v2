//Creating a function to set ability scores.

function processStats(AddRemove, inType, NameEntity, inScoresA, dialogTxt, isSpecial, inAlsoHasMax, maxIsLimitToNow) {
    let scoresA = inScoresA && isArray(inScoresA) ? [].concat(inScoresA) : [];
    let alsoHasMax = inAlsoHasMax && isArray(inAlsoHasMax) ? [].concat(inAlsoHasMax) : false;
    initiateCurrentStats();
    if (isSpecial && !CurrentStats[isSpecial])
        return;
    inType = GetFeatureType(inType);
    let type = isSpecial ? isSpecial.replace(/s$/, '') : inType;
    let dialogTxt = dialogTxt ? dialogTxt.replace(/^([ \n])*.*: |;$/g, '') : "";
    let curStat = false;
    for (let i = 1; i < CurrentStats.cols.length; i++) {
        if (CurrentStats.cols[i].type === type) {
            curStat = CurrentStats.cols[i];
            break;
        }
    }
    if (!curStat && type === "background") {
        ASaddColumn("Backgr-\nound", true);
        i = CurrentStats.cols.length - 1;
        curStat = CurrentStats.cols[i];
    } else if (!curStat) {
        return;
    }
    let imprTxtArr = [], saveMaximumsLimited;
    //this will allow the changes to be set to the total variable//
    for (let s = 0; s < scoresA.length; s++) {
        if (AddRemove && maxIsLimitToNow && alsoHasMax && scoresA[s] && alsoHasMax[s]) {
            //don't let it go above the maximum listed
            /* Only add the bonus up to the maximum listed, or less if possible
			e.g. the text reads "score increases by 2, to a maximum of 22", thus:
				- if the score is now 18 or less, add 2 but add no maximum
				- if the score is now 19, add 2, and set the max to 21
				- if the score is now 20 or more, add 2 and set the max to 22 (no change)
			Save this addition to an object and use that object to remove the addition when the time comes.
			*/

            let iCurScore = Number(What(AbilityScores.abbreviations[s]));
            if (iCurScore + scoresA[s] < alsoHasMax[s]) {
                alsoHasMax[s] = iCurScore + scoresA[s] > 20 ? iCurScore + scoresA[s] : 0;
                savesMaximumLimited = "save";
            }
        } else if (s === 0 && !AddRemove && maxIsLimitToNow && alsoHasMax && CurrentStats.maximumsLimited && CurrentStats.maximumsLimited[NameEntity]) {
            alsoHasMax = [].concat(CurrentStats.maximumsLimited[NameEntity]);
            saveMaximumsLimited = "remove";
        }
        if (type === "race") curStat.scores[s] = 0;
        if (!scoresA[s]) continue;
        if (AddRemove && !dialogTxt && s < 7) {
            let theScoreName = s < 6 ? AbilityScores.names[s] : What("HoSRememberState");
            let theScore = type == "override" ? theScoreName + " is " + scoresA[s]
                : type === "maximum" ? theScoreName + " maximum is " + scoresA[s]
                    : (scoresA[s] > 0 ? "+" : "") + scoresA[s] + " " + theScoreName;
            imprTxtArr.push(theScore);
        }
        if (isSpecial) {
            if (AddRemove) {
                CurrentStats[isSpecial][s][NameEntity] = scoresA[s];
            } else {
                delete CurrentStats[isSpecial][s][NameEntity];
            }
            //------------------------------------This is setting the highest value for override
            curStat.scores[s] = 0;
            let aMods = [];
            for (let a in CurrentStats[isSpecial][s]) {
                let thisStat = CurrentStats[isSpecial][s][a];
                if (isNaN(thisStat.substring(0, 1)) && !isNaN(thisStat.substring(1))) {
                    aMods.push(thisStat);
                } else if (!isNaN(thisStat) && thisStat > curStat.scores[s]) {
                    curStat.scores[s] = Number(thisStat);
                }
            }
            if (type === "maximum" && !curStat.scores[s]) curStat.scores[s] = 20;
            if (aMods.length) curStat.scores[s] = processModifiers(curStat.scores[s], aMods);
        } else {
            if (AddRemove) {
                curStat.scores[s] += scoresA[s];
            } else if (type !== "race") {
                curStat.scores[s] -= scoresA[s];
            }
        }
    }
    if (saveMaximumsLimited === "save") {
        if (!CurrentStats.maximumsLimited) CurrentStats.maximumsLimited = {};
        CurrentStats.maximumsLimited[NameEntity] = alsoHasMax;
    } else if (saveMaximumsLimited === "remove") {
        delete CurrentStats.maximumsLimited[NameEntity];
    }
//------------------------------------------------------------set up a flag if there is no maximum set

    if (alsoHasMax && alsoHasMax.reduce(function (acc, val) {
        return acc + val;
    }, 0) === 0) alsoHasMax = false;
//    sets description text.
    if (AddRemove) {
        let useDialogTxt = dialogTxt ? dialogTxt : formatLineList("", imprTxtArr);
        //adds dialog if it doesnt exist yet.
        if (!CurrentStats.txts[inType][NameEntity] || CurrentStats.txts[inType][NameEntity].indexOf(useDialogTxt) === -1) {
            CurrentStats.txts[inType][NameEntity] = (!dialogTxt && CurrentStats.txts[inType][NameEntity] ? CurrentStats.txts[inType][NameEntity] + "; " : "") + useDialogTxt;
        } else if (!dialogTxt && !alsoHasMax && CurrentStats.txts[inType][NameEntity].indexOf(useDialogTxt) !== -1) {
            // If the entry already exists and contains the exact text that we are about to add, which isn't predetermined, skip it entirely
            CurrentStats = eval(What("CurrentStats.Stringified"));
            return;
        }
    } else {
        delete CurrentStats.txts[inType][NameEntity];
        if (type === "background" && !ObjLength(CurrentStats.txt.background) && Number(curStat.scores.join("")) === 0) {
            CurrentStats.cols.splice(i, 1);
        }
    }
// Store the ability score change for changing the max limit and the score at the same time
    if (alsoHasMax) {
        CurrentStats.maximumsLimited[NameEntity] = scoresA;
    } else {
        delete CurrentStats.maximumsLimited[NameEntity];
    }
    processStats(AddRemove, inType, NameEntity, alsoHasMax, dialogTxt, "maximums", false);
}

else
{
    SetStringifieds("stats");
    CurrentUpdates.types.push("stats" + inType);
}
}

// this function initiates the global variable if it hasn't been initiated yet.

function initiateCurrentStats(forceIt) {
    if (!forceIt) for (let entry in CurrentStats) return; // do nothing if the variable already exists
    CurrentStats = {
        "cols" : [{
            type : 'base',
            name : "Score Base",
            scores : [8,8,8,8,8,8,8]
        }, {
            type : 'race',
            name : "Racial Bonus",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'feats',
            name : "Feat Bonus",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'classes',
            name : "Class Bonus",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'levels',
            name : "Level Bonus",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'magic',
            name : "Magic Bonus",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'items',
            name : "Magic Items*",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'override',
            name : "Magical Override",
            scores : [0,0,0,0,0,0,0]
        }, {
            type : 'maximum',
            name : "Max Total**",
            scores : [20,20,20,20,20,20,20]
        }],
        "txts" : {
            "classes" : {},
            "race" : {},
            "feats" : {},
            "items" : {},
            "magic" : {},
            "background" : {}
        },
        "overrides" : [{},{},{},{},{},{},{}],
        "maximums" :  [{},{},{},{},{},{},{}],
        "maximumsLinked" : {},
        "maximumsLimited" : {}
    }
    SetStringifieds("stats");
}

//this function rounds numbers and returns it in a string (no decimals).
function ASround(input) {
    input = parseFloat(input.replace(",", "."));
    return isNaN(input) ? "0" : Math.round(input).toFixed(0);
}

//function calculates the point buy values of stats
function ASCalcPointBuy(theScore) {
    theScore = parseFloat(theScore.replace(",", "."));
    if (isNaN(theScore) || theScore <= 8) {
        let toReturn = 0;
    } else {
        let toReturn = theScore - 8;
        if (theScore > 13) toReturn += theScore - 13;
    }
    return toReturn.toFixed(0);
}