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

import { CmError }     from "@core/cm.error";
import { IMetadata }   from "@core/cm.http-client.types";
import { CmErrorCode } from "@core/cm.pinecone.error.type";
import { getEnv }      from "../utils/cm.environment.utils";

export type TCmScriptlet = { new(...args: any[]): {} } //& any;

/**
 * Checks if a given object contains an async function with the specified name.
 * @param {Object} obj - The object to check.
 * @param {string} functionName - The name of the function to look for.
 * @returns {boolean} - Returns true if the object contains an async function with the specified name, false otherwise.
 */
function hasAsyncFunction(obj: any, functionName: any) {
	return obj.hasOwnProperty(functionName) && typeof obj[functionName] === 'function' && obj[functionName].constructor.name === 'AsyncFunction';
}


/**
 * @interface IScriptletOptions
 * @description Represents the options for the scriptlet decorator.
 * @property {string} name - The name of the scriptlet.
 * @property {string} [version] - The version of the scriptlet.
 * @property {string} [description] - The description of the scriptlet.
 * @property {Object} [autoRun] - Specifies whether the scriptlet should be automatically executed upon instantiation.
 * @property {boolean} autoRun.enabled - Indicates if the scriptlet should be automatically executed.
 * @property {any[]} autoRun.ctorParams - Additional parameters to pass to the constructor if autoRun is enabled.
 * @property {string[]} [envVars] - The names of the environment variables to check.
 */
export interface IScriptletOptions {
	name: string;
	version?: string;
	description?: string;
	autoRun?: { enabled: boolean; ctorParams?: Record<string, any> };
	cliParams?: {
		params: ICmCliParam[],
		skipHelp?: boolean
	},
	envVars?: string[];
}

/**
 * Interface for CLI parameter.
 * @typedef {Object} ICliParam
 * @property {string} name - The name of the parameter.
 * @property {string} alias - The alias of the parameter.
 * @property {string} description - The description of the parameter.
 * @property {Function} action - The action to be performed when the parameter is matched.
 */
export interface ICmCliParam {
	name: string;
	alias?: string;
	description?: string;
	defaultValue?: any;
	action?: (value: any) => Promise<boolean | void>;
}

/**
 * @decorator AutoRunWithEnvValidation
 * @description This decorator automatically executes a class constructor and validates specified environment variables.
 * @param {IScriptletOptions} options @link IScriptletOptions
 * @throws {Error} If any of the specified environment variables are not set.
 *
 * @example
 *
 * ```typescript
 * @AutoRunWithEnvValidation({
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
		name   : 'CmPineconeApp',
		autoRun: { enabled: false, ctorParams: [] },
		envVars: []
	};

	for (const varName of options?.envVars ?? []) {
		const varValue = getEnv(varName, undefined, true);
		console.log(`Environment variable "${ varName }" has value "${ varValue }"`);
	}

	return function(constructor: T) {
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

				if (hasAsyncFunction(constructor, "onInit")) {
					( async () => {
						await (constructor as any)[ "onInit" ]();
					} );
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
	return typeof obj[functionName] === 'function';
}

/**
 *
 * @param {App} instance
 */
const setupEventTriggers = <App extends Record<string, any>> (instance: App) => {
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

const setupGlobalErrorHandler =<App extends Record<string, any>> (instance: App) => {
	process.on('uncaughtException', (error: Error) => {
		if (typeof instance.prototype?.globalError === 'function') {
			instance.prototype.globalError(
				new CmError(CmErrorCode.UncaughtException, `Uncaught Exception: ${ error }`)
			);
		}
	});

	process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
		if (typeof instance.prototype?.globalError === 'function') {
			instance.prototype.globalError(
				new CmError(CmErrorCode.UnhandledPromiseRejection, `Unhandled Promise Rejection: ${reason}`)
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
