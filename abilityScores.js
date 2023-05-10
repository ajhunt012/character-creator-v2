//Creating a function to set ability scores.

function processStats(AddRemove, inType, NameEntity, inScoresA, dialogTxt, isSpecial, inAlsoHasMax, maxIsLimitToNow){
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
    if (!curStat && type ==="background") {
        ASaddColumn("Backgr-\nound", true);
        i = CurrentStats.cols.length - 1;
        curStat = CurrentStats.cols[i];
    } else if (!curStat) {
        return;
    }
    let  imprTxtArr = [], saveMaximumsLimited;
    //this will allow the changes to be set to the total variable//
    for (let s = 0; s < scoresA.length; s++){
        if (AddRemove && maxIsLimitToNow && alsoHasMax && scoresA[s] && alsoHasMax[s]) {
            //doesnt let it go above the maximum listed
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
        if (type ==="race") curStat.scores[s] = 0;
        if (!scoresA[s]) continue;
        if (AddRemove && !dialogTxt && s <7 ) {
            let theScoreName = s < 6 ? AbilityScores.names[s] : What("HoSRememberState");
            let theScore = type == "override" ? theScoreName+ " is " + scoresA[s]
                :type === "maximum" ? theScoreName + " maximum is " + scoresA[s]
                    : (scoresA[s] > 0 ? "+" : "") +scoresA[s] + " " + theScoreName;
            imprTxtArr.push(theScore);
        }
        if (isSpecial) {
            if (AddRemove) {
                CurrentStats[isSpecial]
            }
        }

    }





}