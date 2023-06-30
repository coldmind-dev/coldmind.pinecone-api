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

import { ICmCliParam }      from "@decorators/@cm.scriptlet";
import { CmScriptlet }      from "@decorators/@cm.scriptlet";
import { CmPineconeClient } from "./cm.pinecone.client";

@CmScriptlet(
	{
		name       : 'Coldmind Pinecone App',
		version    : '1.0.0',
		description: 'A sample app - demonstrating some of the libraries features',
		autoRun    : {
			enabled   : true,
			ctorParams: []
		},
		cliParams  : {
			params: [
				{
					name       : 'create',
					alias      : 'c',
					description: 'Create a new project',
					action     : undefined
				}
			]
		}
	})
export class CmPineconeApp {
	client?: CmPineconeClient = undefined;

	constructor() {
		console.log("Hello Hey");
		this.client = new CmPineconeClient();
		this.client.refreshIndexList()
	}

	onInit(cliParams?: ICmCliParam[]) {
		console.log("onInit :: cliParams ::", cliParams);
	}

	async run(): Promise<void> {}
}


