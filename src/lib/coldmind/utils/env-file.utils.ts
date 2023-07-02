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

import * as fs          from "fs";
import path             from "path";
import { getFilePath }  from "./file-path.util";
import { readFileSync } from 'fs';
import { TEnvVars, }    from "../index";

/**
 * Reads the contents of a file as a string.
 * @param filePath - The path to the file. If not provided, the current working directory is used.
 * @returns A promise that resolves with the file contents as a string.
 * @throws If the file does not exist or there's an error reading the file.
 */
function readFileAsString(filePath?: string): string {
	const resolvedFilePath = filePath ? path.resolve(filePath) : process.cwd();

	// Check if the file exists
	if (!fs.existsSync(resolvedFilePath)) {
		throw new Error(`File does not exist: ${resolvedFilePath}`);
	}

	return readFileSync(resolvedFilePath, 'utf8');
}

/**
 * @function
 * Reads the contents of a .env file, updates `process.env`,
 * and returns the key-value pairs as an object.
 *
 * @param fileName
 * @param {string} filePath - The path to the .env file.
 * @returns {Record<string, string>} An object containing the parsed key-value pairs.
 */
export function loadEnvFile(fileName?: string, filePath?: string): TEnvVars {
	fileName = getFilePath(fileName, filePath, ".env");

	console.log("loadEnvFile :: fileName ::", fileName);

	const envData = new Map<string, string>();

	try {
		//const fileContents = readFileSync(filePath, 'utf8').toString();
		const fileContents = readFileAsString(fileName);
		console.log("loadEnvFile :: fileContents ::", fileContents);
		const lines        = fileContents.split('\n');

		for (const line of lines) {
			const trimmedLine = line.trim();

			if (trimmedLine && !trimmedLine.startsWith('#')) {
				const [ key, value ] = trimmedLine.split('=');
				const trimmedKey     = key.trim();
				const trimmedValue   = value.trim();

				envData.set(trimmedKey, trimmedValue);
			}
		}
	}
	catch (error) {
		console.error(`Error reading .env file: ${ error }`);
	}

	return envData;
}

export function updateEnv(): TEnvVars | undefined {
	let envData: any; //TEnvVars | undefined;
	try {
		envData = loadEnvFile();
		console.log("updateEnv ::", envData);

		for (const [ key, value ] of envData) {
			console.log(`-----> updateEnv :: ${ key } = ${ value }`);
			process.env[ key ] = value;
		}
	}
	catch (ex) {
		console.log("ERROR :: updateEnv ::", ex);
	}

	return envData;
}

/**
 * @function getEnv
 * @description Retrieves the value of an environment variable.
 * If the environment variable is not set and no default value is specified,
 * an error is optionally thrown.
 *
 * @param {string} key - The name of the environment variable.
 * @param {string} [defaultValue] - The default value to return if the environment variable is not set.
 * @param {boolean} [throws] - Specifies whether an error should be thrown if the environment variable is not set.
 * @returns {string} The value of the environment variable, or the default value if not set and throws is false.
 * @throws {Error} If the environment variable is not set and throws is true.
 */
export function getEnv(key: string, defaultValue?: any, throws: boolean = true): string | undefined {
	let value: any = process.env[ key ] ?? defaultValue;

	value = value ? JSON.stringify(value) : value;

	if (typeof value === "string" && value.trim().length) {
		return value;
	}

	if (throws) {
		throw new Error(`Environment variable ${ key } is not set.`);
	}

	return defaultValue;
}
