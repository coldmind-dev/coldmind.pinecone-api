
Coldmind Action Class - CmAction
===================================
The `Action` class represents a generic action object that acts as a result wrapper for various actions.

```markdown
# Action Class

Represents a generic action object that acts as a result wrapper for various actions.

## Installation

Install the package using npm:

```
npm install action-class
```

## Usage

Import the `Action` class:

```typescript
import { Action } from 'action-class';
```

### Creating Action Objects

To create an action object, use the `Action` class constructor:

```typescript
const myAction = new Action(data, eventType, error);
```

- `data`: The data associated with the action.
- `eventType` (optional): The event type associated with the action.
- `error` (optional): Specifies if the action represents an error.

### Accessing Action Properties

The following properties are available on an action object:

- `data`: The data associated with the action.
- `eventType` (optional): The event type associated with the action.
- `error` (optional): Specifies if the action represents an error.

### Checking Action Success

You can use the `success` method to check if the action represents a successful result:

```typescript
const isSuccess = myAction.success();
```

- Returns `true` if the action represents a successful result.
- Returns `false` if the action represents an error.

### Chaining Methods

The `Action` class provides several chainable utility methods:

#### setData

Set the data associated with the action.

```typescript
const updatedAction = myAction.setData(newData);
```

- `newData`: The new data for the action.
- Returns a new action object with the updated data.

#### setError

Set the error flag associated with the action.

```typescript
const errorAction = myAction.setError(true);
```

- `error`: The new error flag for the action.
- Returns a new action object with the updated error flag.

#### setEventType

Set the event type associated with the action.

```typescript
const updatedAction = myAction.setEventType('newEventType');
```

- `newEventType`: The new event type for the action.
- Returns a new action object with the updated event type.

### Static Methods

The `Action` class also provides several static methods:

#### createSuccessAction

Create a successful action.

```typescript
const successAction = Action.createSuccessAction(data, eventType);
```

- `data`: The data associated with the action.
- `eventType` (optional): The event type associated with the action.
- Returns a new successful action object.

#### createErrorAction

Create an error action.

```typescript
const errorAction = Action.createErrorAction(data, eventType);
```

- `data`: The data associated with the action.
- `eventType` (optional): The event type associated with the action.
- Returns a new error action object.

#### fromEvent

Create an action object from an event.

```typescript
const eventAction = Action.fromEvent(eventType, data, error);
```

- `eventType`: The event type associated with the action.
- `data`: The data associated with the action.
- `error` (optional): Specifies if the action represents an error.
- Returns a new action object created from the event.

## License

This project is licensed under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).
```

Please note that the provided documentation is a starting point, and you can customize it further based on your project's needs.
