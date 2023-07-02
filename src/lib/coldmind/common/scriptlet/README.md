## Scriptlet

Scriptlet is a lightweight component in our library designed to simplify the development process of CLI-oriented applications. It offers a set of decorators that seamlessly integrate life cycle events, environment variable management, logging, error handling, and command line argument capabilities.

### Features

- **Life Cycle Events**: With Scriptlet, you can easily define initialization, execution, and termination actions by applying decorators to your class. This helps streamline the flow of your CLI application.

- **Environment Variable Management**: Scriptlet simplifies the access and management of environment variables specific to your CLI application. Retrieve and utilize configuration values effortlessly, allowing you to focus on building your application's core functionality.

- **Logging**: The built-in logging functionality provided by Scriptlet enables you to capture and record application-specific events and messages. This assists in monitoring and debugging your CLI application during both development and deployment.

- **Error Handling**: Scriptlet offers robust error handling capabilities, ensuring that critical exceptions are gracefully captured and handled. Enhance the reliability and stability of your CLI application with ease, allowing you to focus on building without worrying about error management.

- **Command Line Argument Capabilities**: Scriptlet streamlines the parsing and processing of command line arguments. It simplifies the extraction and interpretation of user input, enabling seamless interaction with your CLI application through command line parameters.

### Usage

```typescript
/**
 * @CmScriptlet({
 *   name: 'Coldmind Pinecone App',
 *   version: '1.0.0',
 *   description: 'A sample app - demonstrating some of the library's features',
 *   autoRun: {
 *     enabled: true,
 *     ctorParams: []
 *   },
 *   cliParams: {
 *     params: [
 *       {
 *         name: 'create',
 *         alias: 'c',
 *         description: 'Create a new project',
 *         action: undefined
 *       }
 *     ]
 *   }
 * })
 * @class CmPineconeApp
 */
export class CmPineconeApp {
  client?: CmPineconeClient = undefined;

  constructor() {
    console.log('Hello Hey');
    this.client = new CmPineconeClient();
    this.client.refreshIndexList();
  }

  /**
   * Initializes the application.
   *
   * @param {ICmCliParam[]} [cliParams] - Command line parameters.
   */
  onInit(cliParams?: ICmCliParam[]) {
    console.log('onInit :: cliParams ::', cliParams);
  }
}
```

In this updated version, the code snippet is formatted as a GitHub README. The `@CmScriptlet` decorator is documented with the relevant configuration properties such as name, version, description, autoRun, and cliParams. The `CmPineconeApp` class and its methods are documented using JSDoc-style comments.

This format allows users to quickly understand the purpose and functionality of the `CmPineconeApp` class and its initialization method. It provides clear documentation of the decorator's usage and the purpose of the class and its methods.

Feel free to customize the README further based on your specific requirements and preferences.
