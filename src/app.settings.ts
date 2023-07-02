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

export const PineconeEnvKeys = {
	ApiKey              : "PINECONE_KEY",
	Environment         : "PINECONE_ENV",
	IndexName           : "PINECONE_INDEX",
	DefaultNumDimensions: "PINECONE_DEF_DIM"
}

export namespace Settings {
	export let API_KEY            = "";//getEnv(PineconeEnvKeys.ApiKey) || "959b544c-d5a8-482d-a624-d3ed42952e06";
	export let ENVIRONMENT        = "";//getEnv(PineconeEnvKeys.Environment) || "us-west4-gcp-free";
	export let INDEX              = "";//getEnv(PineconeEnvKeys.IndexName, "coldmind");
	export let DEFAULT_DIMENSIONS = "";//getEnv(PineconeEnvKeys.DefaultNumDimensions, 1536);
}
