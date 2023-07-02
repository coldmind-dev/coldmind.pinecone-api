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
 * @type ISparseValues
 *
 * @information
 * Sparse data refers to a type of data representation where
 * most of the elements in a vector are zero or close to zero.
 *
 * In the context of Pinecone, sparse data typically refers to high-dimensional
 * vectors that contain many zeros or negligible values.
 *
 * This often occurs when representing data that is inherently sparse,
 * such as text documents, user-item interactions, or categorical features.
 * Instead of explicitly storing and processing all the values in a vector,
 * sparse data representations store only the non-zero or significant values
 * along with their corresponding indices.
 *
 * Vector sparse data. Represented as a list of indices and a list of
 * corresponded values, which must be with the same length.
 *
 * @type {Array<number>} - The indices of the sparse data (must have same length as indices)
 * @type {Array<number>} - The corresponding values of the sparse data (must have same length as indices)
 */
export type TSparseValues = {
	indices: Array<number>;
	values: Array<number>;
}
