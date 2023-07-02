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


import { ICmCliParam } from "@lib/coldmind/common/cli/parser/cm.cli-param.interface";

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
	autoRun?: { enabled: boolean; ctorParams?: any[] | undefined },
	cliParams?: {
		params: ICmCliParam[],
		skipHelp?: boolean
	},
	envVars?: string[];
}
