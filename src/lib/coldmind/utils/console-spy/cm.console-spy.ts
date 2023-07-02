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
import { IConsoleSpySimple } from "./console-spy.interface";
import { ICmConsoleSpy }     from "./console-spy.interface";
import { TConsoleMethod }    from "./cm.console-spy.type-group";

type TLogFunc = (...args: any[]) => void;
type TConsoleInst = { [key in TConsoleMethod]: TLogFunc };

export {
	TLogFunc,
	TConsoleInst
}

export class CmConsoleSpy implements ICmConsoleSpy {
		private _muted: boolean = false;

		private origFuncMap: Map<TConsoleMethod, TLogFunc>;
		public logMap: Map<TConsoleMethod, string[]>;

		constructor(private consoleObj: TConsoleInst, ...methods: TConsoleMethod[]) {
			this.origFuncMap = new Map<TConsoleMethod, TLogFunc>();
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

		public restore(method: TConsoleMethod = 'log'): void {
			this.consoleObj[ method ] = this.origFuncMap.get(method) ?? console.log;
		}

		public detachAll(): void {
			this.origFuncMap.forEach((func: TLogFunc, method: TConsoleMethod) => {
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

	export class CmConsoleSpySimple extends CmConsoleSpy implements IConsoleSpySimple {
		constructor(consoleObj: TConsoleInst, private method: TConsoleMethod) {
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
	 * @returns {ICmConsoleSpy} The console spy instance.
	 */
	export const createConsoleSpy = (consoleObj: any, ...methods: TConsoleMethod[]): ICmConsoleSpy => {
		return new CmConsoleSpy(consoleObj, ...methods);
	}

	export const createConsoleSpySimple = (consoleObj: any, method: TConsoleMethod = "log"): IConsoleSpySimple => {
		return new CmConsoleSpySimple(consoleObj, method);
	}

