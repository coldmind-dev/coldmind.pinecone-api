/**
 *  Coldmind - Pinecone API Client
 *
 *  This file is part of the Coldmind - Pinecone API Client project, an
 *  integration solution for the Pinecone database.
 *  @repository https://github.com/coldmind-dev/coldmind.pinecone-api.git
 *
 *  @author Patrik Forsberg
 *  @contact patrik.forsberg@coldmind.com
 *  @date 2023-06-30
 *
 *  Copyright (c) 2023 Coldmind AB
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  The software is provided "as is", without warranty of any kind, express or implied,
 *  including but not limited to the warranties of merchantability, fitness for a
 *  particular purpose and noninfringement. In no event shall the authors or copyright
 *  holders be liable for any claim, damages or other liability, whether in an action of
 *  contract, tort or otherwise, arising from, out of or in connection with the software
 *  or the use or other dealings in the software.
 */

/**
 * @fileOverview Custom Console Spy
 * @description This file provides a custom console spy utility for capturing console output for different types of console methods.
 */

type TLogMethod = (...args: any[]) => void;

type TConsoleObj  = any;

/**
 * The supported console methods.
 */
type TConsoleMethod = 'log' | 'info' | 'error' | 'warn' | 'debug' | 'trace';

/**
 * The console spy instance.
 */
interface IConsoleSpy {
	/**
	 * The captured output for different console methods.
	 */
	logMap: Map<TConsoleMethod, string[]>;
	/**
	 * The console log method used for spying.
	 */
	log: TLogMethod;
	/**
	 * Checks if the console log includes a specific text.
	 * @param {string} text - The text to search for.
	 * @param {TConsoleMethod} [method='other'] - The console method to check.
	 * @returns {boolean} - True if the text is found, false otherwise.
	 */
	didLog: (text: string, method?: TConsoleMethod) => boolean;
	/**
	 * Detaches the spy from the specified console method.
	 * @param {TConsoleMethod} [method='other'] - The console method to detach.
	 * @returns {void}
	 */
	detach: (method?: TConsoleMethod) => void;
	/**
	 * Detaches the spy from all console methods.
	 * @returns {void}
	 */
	detachAll: () => void;
}

interface IConsoleSpySimple {
	data: string[];
	setMute: (value?: boolean) => void;
	restore: () => void;
	didLog: (text: string) => boolean;
}

export class ConsoleSpy implements IConsoleSpy {
	private _muted: boolean = false;

	private origFuncMap: Map<TConsoleMethod, TLogMethod>;
	public logMap: Map<TConsoleMethod, string[]>;

	constructor(private consoleObj: TConsoleObj, ...methods: TConsoleMethod[]) {
		this.origFuncMap = new Map<TConsoleMethod, TLogMethod>();
		this.logMap      = new Map<TConsoleMethod, string[]>();

		methods.forEach((method: TConsoleMethod) => {
			this.origFuncMap.set(method, consoleObj[ method ]);

			consoleObj[ method ] = (...args: any[]) => {
				this.log(method, ...args);
			}

			this.logMap.set(method, []);
		});
	}

	/**
	 * Sets the mute state of the spy.
	 * @param {boolean} value
	 */
	public setMute(value: boolean = false): void {
		this._muted = value;
	}

	public detach(method: TConsoleMethod = 'log'): void {
		this.consoleObj[ method ] = this.origFuncMap.get(method) ?? console.log;
	}

	public detachAll(): void {
		this.origFuncMap.forEach((func: TLogMethod, method: TConsoleMethod) => {
			this.consoleObj[ method ] = func;
		});
	}

	public didLog(text: string, method: TConsoleMethod = 'log'): boolean {
		const logs = this.logMap.get(method) ?? [];
		return logs.includes(text);
	}

	public log(method: TConsoleMethod, ...args: any[]): void {
		if (this.logMap.has(method)) {
			const logList = this.logMap.get(method)!;
			logList.push(...args.map((arg) => JSON.stringify(arg)));
		}

		const func = this.origFuncMap.get(method);

		if (func && !this._muted) {
			console.debug('Spying on:', method, 'with args:', args);
			func(...args);
		}
	}
}

export class ConsoleSpySimple extends ConsoleSpy implements IConsoleSpySimple {
	constructor(consoleObj: TConsoleObj, private method: TConsoleMethod) {
		super(consoleObj, method);
	}

	public get data(): string[] {
		return this.logMap.get(this.method) ?? [];
	}

	public restore(): void {
		super.detachAll()
	}

	public didLog(text: string): boolean {
		return super.didLog(text, this.method);
	}
}

/**
 * Factory function to create a console spy.
 * @param {any} consoleObj - The console object to spy on.
 * @param {TConsoleMethod[]} methods - The console methods to spy on.
 * @returns {IConsoleSpy} The console spy instance.
 */
export const createConsoleSpy = (consoleObj: any, ...methods: TConsoleMethod[]): IConsoleSpy => {
	return new ConsoleSpy(consoleObj, ...methods);
}

export const createConsoleSimpleSpy = (consoleObj: any, method: TConsoleMethod = "log"): IConsoleSpySimple => {
	return new ConsoleSpySimple(consoleObj, method);
}
