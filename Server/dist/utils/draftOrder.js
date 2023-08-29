"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLinearDraftOrder = exports.generateSnakeDraftOrder = void 0;
function generateSnakeDraftOrder(teamCount, teamSize) {
    let draftOrder = [];
    const forwardDirection = [...Array(teamCount)].map((_, index) => 1 + index);
    const reverseDirection = [...forwardDirection].reverse();
    for (let i = 0; i < teamSize; i++) {
        if (i % 2 == 0) {
            draftOrder = draftOrder.concat(forwardDirection);
        }
        else {
            draftOrder = draftOrder.concat(reverseDirection);
        }
    }
    return draftOrder.slice(0, teamCount * teamSize);
}
exports.generateSnakeDraftOrder = generateSnakeDraftOrder;
function generateLinearDraftOrder(teamCount, teamSize) {
    let draftOrder = [];
    const roundOrder = [...Array(teamCount)].map((_, index) => 1 + index);
    for (let i = 0; i < teamSize; i++) {
        draftOrder = draftOrder.concat(roundOrder);
    }
    return draftOrder;
}
exports.generateLinearDraftOrder = generateLinearDraftOrder;
