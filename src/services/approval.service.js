import { APPROVAL_STATUS, DECLINE_REASONS } from '../constants/options';
import { ApiError, request } from './mockClient';
import { findUserById, listUsersByApproval, toPublicUser, updateUserById } from './userStore';

/**
 * Admin review of woman-in-tech signups.
 *
 * Every mutation writes through `userStore`, which means the change lands in
 * `localStorage["aruna:users"]` and therefore fires a `storage` event in every
 * *other* open tab — that is what lets a waiting member be moved off the
 * awaiting-approval screen without refreshing. See `useApprovalWatch`.
 */

/** Newest signups first, so a growing queue stays predictable. */
const byNewestSignup = (a, b) => new Date(b.signupAt ?? 0) - new Date(a.signupAt ?? 0);

const reviewRecord = (user) => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role,
	photoDataUrl: user.photoDataUrl,
	approvalStatus: user.approvalStatus,
	signupAt: user.signupAt ?? user.createdAt,
	decisionAt: user.decisionAt,
	decisionBy: user.decisionBy,
	declineReason: user.declineReason,
	resubmittedAt: user.resubmittedAt,
});

export const approvalService = {
	/** All accounts awaiting a decision. */
	listPending: () =>
		request(() =>
			listUsersByApproval(APPROVAL_STATUS.PENDING).sort(byNewestSignup).map(reviewRecord),
		),

	/** Everything already decided, for the admin's history tabs. */
	listDecided: () =>
		request(() =>
			listUsersByApproval(APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.DECLINED)
				.sort(byNewestSignup)
				.map(reviewRecord),
		),

	stats: () =>
		request(() => ({
			pending: listUsersByApproval(APPROVAL_STATUS.PENDING).length,
			approved: listUsersByApproval(APPROVAL_STATUS.APPROVED).length,
			declined: listUsersByApproval(APPROVAL_STATUS.DECLINED).length,
		}), { delay: 120 }),

	approve: (userId, adminId) =>
		request(() => {
			const user = findUserById(userId);
			if (!user) throw new ApiError('That account no longer exists.', { status: 404 });

			const updated = updateUserById(userId, {
				approvalStatus: APPROVAL_STATUS.APPROVED,
				decisionAt: new Date().toISOString(),
				decisionBy: adminId,
				declineReason: undefined,
			});

			return reviewRecord(updated);
		}),

	decline: (userId, adminId, reasonValue) =>
		request(() => {
			const user = findUserById(userId);
			if (!user) throw new ApiError('That account no longer exists.', { status: 404 });

			const reason =
				DECLINE_REASONS.find((item) => item.value === reasonValue) ?? DECLINE_REASONS[0];

			const updated = updateUserById(userId, {
				approvalStatus: APPROVAL_STATUS.DECLINED,
				decisionAt: new Date().toISOString(),
				decisionBy: adminId,
				declineReason: { value: reason.value, label: reason.label, message: reason.message },
			});

			return reviewRecord(updated);
		}),

	/**
	 * Decline is reversible: a declined member may retake their photo once and
	 * go back into the queue. See the README for why this is not final.
	 */
	resubmit: (userId, photoDataUrl) =>
		request(() => {
			const user = findUserById(userId);
			if (!user) throw new ApiError('That account no longer exists.', { status: 404 });

			if (user.approvalStatus !== APPROVAL_STATUS.DECLINED) {
				throw new ApiError('This account is not awaiting a resubmission.', { status: 409 });
			}

			if (!photoDataUrl) {
				throw new ApiError('Capture a new photo before resubmitting.', { status: 422 });
			}

			const updated = updateUserById(userId, {
				approvalStatus: APPROVAL_STATUS.PENDING,
				photoDataUrl,
				resubmittedAt: new Date().toISOString(),
				decisionAt: undefined,
				decisionBy: undefined,
				declineReason: undefined,
			});

			return toPublicUser(updated);
		}),
};
