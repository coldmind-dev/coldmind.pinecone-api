import { createConsoleSpySimple } from "@lib/coldmind";
import { CmScriptlet }            from "@lib/coldmind/common/scriptlet/@cm.scriptlet";
import { expect }                 from 'chai';


@CmScriptlet(
	{
		name   : "",
		autoRun: {
			enabled: true,
			ctorParams: [ 1, "hello", { "DB_HOST": "" } ]
		}
	})
class MyApp {
	constructor() {
		console.log('MyApp executed');
	}
}

const consoleMethods = ['log', 'info', 'error'];

// Test suite
describe('AutoRunWithEnvValidation', () => {
	it('should execute the app if environment variables are set', () => {
		// Capture the console output
		const consoleSpy = createConsoleSpySimple(console, 'log');

		// Instantiate the app
		new MyApp();

		// Expect the console log to have been called
		expect(consoleSpy.didLog('MyApp executed')).to.be.true;

		consoleSpy.restore();
	});

	it('should throw an error if environment variables are not set', () => {
		const consoleErrorSpy = createConsoleSpySimple(console, 'error');

		// Disable console.error output during the test
		consoleErrorSpy.setMute(true);

		// Instantiate the app without environment variables
		expect(() => new MyApp()).to.throw(Error, 'DB_HOST is not set');

		// Expect console.error to have been called with the error message
		expect(consoleErrorSpy.didLog('SOMETHING_ELSE')).to.be.true;

		consoleErrorSpy.restore();
	});
});
