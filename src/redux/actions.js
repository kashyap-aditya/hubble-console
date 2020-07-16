import * as ActionTypes from "./actionTypes";
import axios from "axios";

export function newAccount() {
	return {
		type: ActionTypes.NEW_ACCOUNT,
		payload: null,
	};
}

export function newSubscription() {
	return {
		type: ActionTypes.NEW_SUBSCRIPTION,
		payload: null,
	};
}

export function newInvoice() {
	return {
		type: ActionTypes.NEW_INVOICE,
		payload: null,
	};
}

export function newPlan() {
	return {
		type: ActionTypes.NEW_PLAN,
		payload: null,
	};
}

export function closeDialog() {
	return {
		type: ActionTypes.CLOSE_DIALOG,
		payload: null,
	};
}

export function showNotification(message, category) {
	return {
		type: ActionTypes.SHOW_NOTIFICATION,
		payload: {
			message,
			category,
		},
	};
}

export function closeNotification() {
	return {
		type: ActionTypes.CLOSE_NOTIFICATION,
		payload: null,
	};
}

// TODO: Error boundaries
export function createAccount(account) {
	return (dispatch) => {
		dispatch(showNotification("Saving account...", "LOADING"));
		return axios.post("/api/v1/accounts", account).then((response) => {
			// const newAccount = response.data;
			dispatch(
				showNotification("Successfully created an account", "SUCCESS")
			);
		});
	};
}