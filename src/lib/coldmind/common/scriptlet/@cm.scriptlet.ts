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

import { CmError }   from "@lib/coldmind/common/cm.error";
import { ErrorCode } from "@core/error-codes.enum";
import { EnvVarMap }         from "@lib/coldmind";
import { IEnvVars }          from "@lib/coldmind";
import { TEnvVars }          from "@lib/coldmind";
import { IEnvVarMap }        from "@lib/coldmind/types/env-file.type";
import { updateEnv }         from "@lib/coldmind/utils/env-file.utils";
import { AsyncFunc }         from "mocha";
import { IScriptletOptions } from "./cm.scriptlet.interface";
import { getEnv }            from "@lib/coldmind/utils/env-file.utils";
import { loadEnvFile }       from "@lib/coldmind/utils/env-file.utils";

/**
 * @type TCmScriptlet
 * @description Represents the Scriptlet type
 */
export type TCmScriptlet = { new(...args: any[]): {} };

/**
 * Checks if a given object contains an async function with the specified name.
 * @param {Object} obj - The object to check.
 * @param {string} functionName - The name of the function to look for.
 * @returns {boolean} - Returns true if the object contains an async function with the specified name, false otherwise.
 */
export function hasAsyncFunction(obj: any, functionName: any) {
	return typeof obj[ functionName ] === 'function' && obj[ functionName ].constructor.name === 'AsyncFunction';
}

export type CmAsyncFunc<R = any> = () => Promise<void>;

/**
 * @decorator CmScriptlet
 * @description This decorator automatically executes a class constructor and validates specified environment variables.
 * @param {IScriptletOptions} options @link IScriptletOptions
 * @throws {Error} If any of the specified environment variables are not set.
 *
 * @example
 *
 * ```typescript
 * @CmScriptlet({
 *   autoRun: true,
 *   ctorParams: []
 * }, ["DB_HOST", "DB_USER", "DB_PASSWORD"])
 * class MyApp {
 *   // The rest of your class implementation
 * }
 * ```
 */
export const CmScriptlet = <T extends TCmScriptlet>(
	options?: IScriptletOptions
): any => {
	options = options ?? {
		name   : "ColdmindApp",
		autoRun: { enabled: false, ctorParams: [] },
		envVars: []
	};

	/**
	 * @function readEnvVars
	 * @description Reads the specified environment variables and depending on
	 * the throws setting it will throws an error if any of them are not set.
	 */
	function readEnvVars(): IEnvVarMap {
		const result = new EnvVarMap();

		const envFile: TEnvVars = updateEnv();
		console.log("envFile ::", envFile, " ::OPT-VAR ::", options?.envVars);

		for (const varName of options?.envVars ?? []) {
			try {
				const varValue = getEnv(varName, undefined, false);
				result.set(varName, varValue);
				console.log(`Environment variable "${ varName }" has value "${ varValue }"`);
			}
			catch (error) {
				console.log(`ERROR :: Required Environment variable "${ varName }" is not set`);
				process.exit(-33);
			}
		}

		return result;
	}

	return function(constructor: T) {
		const envVars = readEnvVars();
		setupGlobalErrorHandler(constructor);

		if (options?.autoRun?.enabled) {
			try {
				const ctorParams = Array.isArray(options.autoRun.ctorParams)
								   ? options.autoRun.ctorParams
								   : [];

				const instance   = new constructor(...ctorParams);

				// Log stylish init message with bold name
				console.log(`\nInitializing \x1b[1m${ options.name }\x1b[0m v${ options.version || '' }`);
				if (options.description) {
					console.log(options.description);
				}

				function hasAsyncFunction2(obj: any, functionName: any) {
					console.log("hasAsyncFunction ::", obj, functionName);
					console.log("obj.hasOwnProperty(functionName) ::", obj.hasOwnProperty(functionName));
					console.log("typeof obj[ functionName ] === 'function' ::", typeof obj[ functionName ] === 'function');
					console.log("obj[ functionName ].constructor.name ::", obj[ functionName ].constructor.name);

					return typeof obj[ functionName ] === 'function' && obj[ functionName ].constructor.name === 'AsyncFunction';
				}

				const onInitFunc = "onInit";

				if (hasAsyncFunction2(instance, onInitFunc)) {
					console.log("***** HAVE onInit");
					let iFunc: CmAsyncFunc = instance[onInitFunc];

					const initArgs = {
						envVars: envVars
					};

					iFunc.call(instance, initArgs).then(res => {
						console.log("***** onInit DONE ::", res);
					}).catch(err => {
						console.log("***** onInit ERR ::", err);
					});
				}

				console.log('\nInitialized:', instance);
			}
			catch (error) {
				console.error(`Error occurred during scriptlet execution: ${ error }`);
			}
		}
	};
}

/**
 * Check if a function with the given name exists on the provided object.
 * @param {object} obj - The object to check for the function.
 * @param {string} functionName - The name of the function to check.
 * @returns {boolean} - `true` if the function exists, `false` otherwise.
 */
function functionExists(obj: any, functionName: string): boolean {
	return typeof obj[ functionName ] === 'function';
}

/**
 *
 * @param {App} instance
 */
const setupEventTriggers = <App extends Record<string, any>>(instance: App) => {
	if (functionExists(instance, "onInit")) {
		instance.prototype.onInit();
	}

	if (typeof instance.prototype?.onStart === 'function') {
		instance.prototype.onStart();
	}

	if (typeof instance.prototype?.onStop === 'function') {
		instance.prototype.onStop();
	}
}

const setupGlobalErrorHandler = <App extends Record<string, any>>(instance: App) => {
	process.on('uncaughtException', (error: Error) => {
		if (typeof instance.prototype?.globalError === 'function') {
			instance.prototype.globalError(
				new CmError(ErrorCode.UncaughtException, `Uncaught Exception: ${ error }`)
			);
		}
	});

	process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
		if (typeof instance.prototype?.globalError === 'function') {
			instance.prototype.globalError(
				new CmError(ErrorCode.UnhandledPromiseRejection, `Unhandled Promise Rejection: ${ reason }`)
			);
		}
	});

	/*
	 if (typeof instance['globalError'] === 'function') {
	 // Set the global error handler to the 'globalError' function of the instance
	 process.on('uncaughtException', (error: Error) => {
	 instance['globalError'](error);
	 });
	 }
	 */
}
