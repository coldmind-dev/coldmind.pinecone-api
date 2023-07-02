/**
 *  Coldmind - Pinecone API Client
 *
 *  This file is part of the Coldmind - Pinecone API Client project, an
 *  integration solution for the Pinecone database.
 *  @repository https://github.com/coldmind-dev/coldmind.pinecone-api.git
 *
 *  @author Patrik Forsberg
 *  @contact patrik.forsberg@coldmind.com
 *  @date 2023-07-01
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

import { existsSync }  from "fs";
import path            from "path";
import { Environment } from "../cm.environment";
import { Severity }    from "./logger.util";

/**
 * Helper method to determine the filePath based on different scenarios.
 * @param {string} [filePath] - The optional path to the .env file.
 * @param {string} [defPath] - The default path to use if filePath does not specify a path. Defaults to process.cwd().
 * @param {string} [defFilename] - The default filename to use if filePath does not specify a filename.
 * @param {boolean} [mustExist] - Indicates whether the file must exist. Defaults to false.
 * @returns {string} The resolved filePath.
 */
export function getFilePath(
	filePath?: string,
	defPath?: string,
	defFilename?: string,
	mustExist?: boolean
): string {
	defPath = defPath ?? process.cwd();
	defFilename = defFilename ?? "NO_FILENAME_SPECIFIED";

	if (!filePath) {
		// If filePath is not provided, set it to defPath + defFilename
		console.log("aaaa");
		filePath = path.join(defPath, defFilename);
	} else if (!path.dirname(filePath)) {
		// If only filename is specified, set the path to defPath
		console.log("bbb");
		filePath = path.resolve(process.cwd(), filePath);
	}

	console.log("* AAAA ************************ :: getFilePath :: filePath ::", filePath);

	if (mustExist && !existsSync(filePath)) {
		throw new Error(`File does not exist: ${filePath}`);
	}

	console.log("***************************** :: getFilePath :: filePath ::", path.resolve(defPath, filePath));

	return filePath;
}

export function fileExists(filePath: string, severity?: Severity): boolean {
	let fileExists = false;
	try {
		fileExists = existsSync(filePath)
	} catch (err) {
		Environment.log.err(Severity.critical, err);
	}
	return fileExists;
}
