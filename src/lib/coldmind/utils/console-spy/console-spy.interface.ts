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

import { TLogFunc }       from "./cm.console-spy";
import { TConsoleMethod } from "./cm.console-spy.type-group";

/**
 * The console spy instance.
 */
export interface ICmConsoleSpy {
	/**
	 * The captured output for different console methods.
	 */
	logMap: Map<TConsoleMethod, string[]>;
	/**
	 * The console log method used for spying.
	 */
	log: TLogFunc;
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
	restore: (method?: TConsoleMethod) => void;
	/**
	 * Detaches the spy from all console methods.
	 * @returns {void}
	 */
	detachAll: () => void;
}

export interface IConsoleSpySimple {
	data: string[];
	setMute: (value?: boolean) => void;
	restore: () => void;
	didLog: (text: string) => boolean;
}
