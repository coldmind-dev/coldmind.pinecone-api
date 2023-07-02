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

/**
 * Converts seconds to milliseconds.
 * @param {number} seconds - The value in seconds.
 * @returns {number} The equivalent value in milliseconds.
 */
function secToMs(seconds: number): number {
	return seconds * 1000;
}

/**
 * Converts minutes to milliseconds.
 * @param {number} minutes - The value in minutes.
 * @returns {number} The equivalent value in milliseconds.
 */
function minToMs(minutes: number): number {
	return minutes * 60 * 1000;
}

/**
 * Converts hours to milliseconds.
 * @param {number} hours - The value in hours.
 * @returns {number} The equivalent value in milliseconds.
 */
function hoursToMs(hours: number): number {
	return hours * 60 * 60 * 1000;
}

/**
 * Converts days to milliseconds.
 * @param {number} days - The value in days.
 * @returns {number} The equivalent value in milliseconds.
 */
function daysToMs(days: number): number {
	return days * 24 * 60 * 60 * 1000;
}

export { secToMs, minToMs, hoursToMs, daysToMs };
