function processStats(AddRemove, inType, NameEntity, inScoresA, dialogTxt, isSpecial, inAlsoHasMax, maxIsLimitToNow){
    let scoresA = inScoresA && isArray(inScoresA ? [].concat(inScoresA) : [];
    let alsoHasMax = inAlsoHasMax && isArray(inAlsoHasMax) ? [].concat(inAlsoHasMax) : false;
    initiateCurrentStats();
    if (isSpecial && !CurrentStats[isSpecial])
        return;
        )
}