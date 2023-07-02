export enum Severity {
	Low      = 'LOW',
	Medium   = 'MEDIUM',
	High     = 'HIGH',
	critical = 'SEVERE',
	Debug    = 'DEBUG',
	ALL      = 'ALL',
}

export enum CmLogColor {
	Cyan = '\x1b[36m',
	Green = '\x1b[32m',
	Yellow = '\x1b[33m',
	Red = '\x1b[31m',
	Reset = '\x1b[0m',
}

/**
 * Logger class with strict typings for logging at different levels.
 */
export class CmLogger {
	private reportingLevel: Severity;

	/**
	 * Constructs a new Logger instance with the specified reporting level.
	 * @param {Severity} reportingLevel - The logging level to be reported.
	 */
	constructor(reportingLevel: Severity) {
		this.reportingLevel = reportingLevel;
	}

	/**
	 * Logs a message at the specified log level.
	 * @param {Severity} logLevel - The log level.
	 * @param {string} message - The log message.
	 * @param {any[]} args - Additional arguments to be logged.
	 */
	public log(logLevel: Severity, message: string, ...args: any[]): void {
		this.logByLevel(logLevel, message, args);
	}

	/**
	 * Logs an informational message.
	 * @param {Severity} logLevel - The log level.
	 * @param {string} message - The log message.
	 * @param {any[]} args - Additional arguments to be logged.
	 */
	public info(logLevel: Severity, message: string, ...args: any[]): void {
		this.logByLevel(logLevel, message, args);
	}

	/**
	 * Logs a warning message.
	 * @param {Severity} logLevel - The log level.
	 * @param {string} message - The log message.
	 * @param {any[]} args - Additional arguments to be logged.
	 */
	public warn(logLevel: Severity, message: string, ...args: any[]): void {
		this.logByLevel(logLevel, message, args);
	}

	/**
	 * Logs an error message.
	 * @param {Severity} logLevel - The log level.
	 * @param {string} message - The log message.
	 * @param {any[]} args - Additional arguments to be logged.
	 */
	public err(logLevel: Severity, message: string, ...args: any[]): void {
		this.logByLevel(logLevel, message, args);
	}

	/**
	 * Logs a debug message.
	 * @param {Severity} logLevel - The log level.
	 * @param {string} message - The log message.
	 * @param {any[]} args - Additional arguments to be logged.
	 */
	public debug(logLevel: Severity, message: string, ...args: any[]): void {
		this.logByLevel(logLevel, message, args);
	}

	/**
	 * Logs a message at the specified log level.
	 * @param {Severity} logLevel - The log level.
	 * @param {string} message - The log message.
	 * @param {any[]} args - Additional arguments to be logged.
	 * @private
	 */
	private logByLevel(logLevel: Severity, message: string, args: any[]): void {
		if (
			this.reportingLevel === Severity.ALL ||
			this.reportingLevel === logLevel ||
			( logLevel === Severity.Debug && this.reportingLevel === Severity.High)
		) {
			const color = this.getColor(logLevel);
			console.log(`${color}[${logLevel}]${CmLogColor.Reset} ${message}`, ...args.map(arg => `${color}${arg}${CmLogColor.Reset}`));
		}
	}

	/**
	 * Gets the log color based on the log level.
	 * @param {Severity} logLevel - The log level.
	 * @returns {CmLogColor} The log color.
	 * @private
	 */
	private getColor(logLevel: Severity): CmLogColor {
		switch (logLevel) {
			case Severity.Low:
				return CmLogColor.Cyan;
			case Severity.Medium:
				return CmLogColor.Green;
			case Severity.High:
				return CmLogColor.Yellow;
			case Severity.critical:
				return CmLogColor.Red;
			case Severity.Debug:
				return CmLogColor.Cyan;
			default:
				return CmLogColor.Reset;
		}
	}
}
