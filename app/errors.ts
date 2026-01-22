export class TimeoutError extends Error {
	constructor(message = "Timeout") {
		super(message);
		this.name = "TimeoutError";
	}
}

export class CancelledError extends Error {
	constructor(message = "Cancelled by user") {
		super(message);
		this.name = "CancelledError";
	}
}
