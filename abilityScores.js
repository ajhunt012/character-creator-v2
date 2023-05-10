function processStats(AddRemove, inType, NameEntity, inScoresA, dialogTxt, isSpecial, inAlsoHasMax, maxIsLimitToNow){
    let scoresA = inScoresA && isArray(inScoresA ? [].concat(inScoresA) : [];
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
        )
}