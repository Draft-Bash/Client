"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const draftOrder_1 = require("../utils/draftOrder");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../db");
const sendVerificationEmail = require("../utils/nodeMailer/sendVerificationEmail");
class DraftsModel {
    getDraftMembers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const draftId = req.query.draftId;
            const draftUserData = yield db.query(`SELECT U.user_id, draft_id, user_name
            FROM draft_user AS DU
            INNER JOIN users AS U
            ON DU.user_id = U.user_id
            WHERE DU.draft_id = $1`, [Number(draftId)]);
            const draftBotsData = yield db.query(`SELECT DISTINCT bot_number
            FROM draft_order
            WHERE draft_id = $1 AND bot_number IS NOT NULL
            ORDER BY bot_number`, [Number(draftId)]);
            const draftUsers = draftUserData.rows;
            const draftBots = draftBotsData.rows.map((obj) => obj.bot_number);
            const draftMembers = { "draftUsers": draftUsers, "draftBots": draftBots };
            return draftMembers;
        });
    }
    getDraft(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const draftId = parseInt(req.params.id);
            const draft = yield db.query(`
        SELECT * 
        FROM draft 
        WHERE draft_id = $1`, [
                draftId
            ]);
            return draft.rows[0];
        });
    }
    getUserDrafts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.query.user_id;
            const userDrafts = yield db.query(`
        SELECT U.user_id, D.draft_id, draft_type, user_name, team_count,
        scheduled_by_user_id, draft_type, scoring_type, pick_time_seconds
        FROM draft_user AS DU
        INNER JOIN draft AS D ON DU.draft_id = D.draft_id
        INNER JOIN users AS U ON DU.user_id = U.user_id
        WHERE DU.user_id = $1;`, [
                userId
            ]);
            return userDrafts.rows;
        });
    }
    createMockDraft(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { draft_type, scoring_type, pick_time_seconds, team_count, pointguard_slots, shootingguard_slots, guard_slots, smallforward_slots, powerforward_slots, forward_slots, center_slots, utility_slots, bench_slots, scheduled_by_user_id, draft_position } = req.body;
            const teamSize = pointguard_slots + shootingguard_slots
                + guard_slots + smallforward_slots + powerforward_slots
                + forward_slots + center_slots + utility_slots + bench_slots;
            const createdDraft = yield db.query(`INSERT INTO draft (draft_type, scoring_type, pick_time_seconds, 
                team_count, pointguard_slots, shootingguard_slots, guard_slots, 
                smallforward_slots, powerforward_slots, forward_slots,
                center_slots, utility_slots, bench_slots, scheduled_by_user_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING draft_id`, [
                draft_type, scoring_type, pick_time_seconds, team_count, pointguard_slots,
                shootingguard_slots, guard_slots, smallforward_slots, powerforward_slots,
                forward_slots, center_slots, utility_slots, bench_slots, scheduled_by_user_id
            ]);
            let draftOrder = [];
            if (draft_type == "snake") {
                draftOrder = (0, draftOrder_1.generateSnakeDraftOrder)(team_count, teamSize);
            }
            else if (draft_type == "linear") {
                draftOrder = (0, draftOrder_1.generateLinearDraftOrder)(team_count, teamSize);
            }
            console.log(draftOrder);
            let pickNumber = 1;
            for (const order of draftOrder) {
                console.log(order);
                if (order == draft_position) {
                    yield db.query(`INSERT INTO draft_order (user_id, draft_id, pick_number)
                VALUES ($1, $2, $3)`, [
                        scheduled_by_user_id, createdDraft.rows[0].draft_id, pickNumber
                    ]);
                }
                else {
                    yield db.query(`INSERT INTO draft_order (bot_number, draft_id, pick_number)
                VALUES ($1, $2, $3)`, [
                        order, createdDraft.rows[0].draft_id, pickNumber
                    ]);
                }
                pickNumber += 1;
            }
            yield db.query(`INSERT INTO draft_user (user_id, draft_id)
            VALUES ($1, $2)`, [
                scheduled_by_user_id, createdDraft.rows[0].draft_id
            ]);
            return createdDraft.rows[0].draft_id;
        });
    }
}
module.exports = new DraftsModel();
