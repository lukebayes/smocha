

# Notes

## Hooks, Rules and Messaging (2017-08-24)

We have a composite tree structure that is being created in the form of Suites and Hooks.

A Hook is a relatively simple container for a label and a handler. Hooks provide an ```execute()``` method which wraps and call the provided handler, which may be implemented as a synchronous method, an async method that receives a node style callback, or it might return a Promise. The Hook implementation hides these details from callers. When ```execute()``` is called, if the underlying handler is synchronous, nothing is returned, otherwise a Promise is returned.0

A Suite is a Hook that can compose any number of Suites and Hooks. The Suite implementation of ```execute()``` will cause all child Hooks to be executed.

There are specific types of hooks that have specific business rules around how and when they are called (or not called). The Hook types and rules are as follows:

* BEFORE: Zero or more BEFORE hooks are called in order of declaration at the beginning of a Suite's execution.
* BEFORE EACH: Zero or more BEFORE EACH hooks are called in order of declaration before each TEST definition.
* TEST: One or more TEST hooks are called in the order they are defined, or sometimes in parallel if we are spread across multiple machines or processes.
* AFTER EACH: Zero or more AFTER EACH hooks are called in order of declaration after each TEST definition.
* AFTER: Zero or more AFTER hooks are called in order of declaration at the end of a Suite's execution.
* SKIPPED: When a TEST is annotated to be skipped, a SKIPPED hook will run instead.

Each hook execution is bracketed by {Hook Type}-BEGIN and {Hook Type}-END events that bubble up the Suite tree so that a reporter can track durations and report progress incrementally.

Test execution may be limited or filtered in the following ways:

* Glob: A filter glob can be provided to the Runner and only tests with a matching Full Label will be executed.
* Only'd: Some tests may be annotated with a .only declaration. If one or more tests includes the .only flag, the entire runtime will filter down to only execute those tests.
* Skipped: Tests may be annotated with a .skip declaration. Any tests with this annotated will not be executed and their associated surrounding hooks will also not run.
* Single Test: If there is only a single test that is being executed (due to filtering or .only), the AFTER and AFTER EACH hooks will not be called. This will allow us to run tests in the browser and leave visual elements on screen for in-place, isolated development and exploration.

## Data structures, traversal and execution

Once we create the Composite Suite data structure, we're faced with some choices surrounding traversal and execution.

### Execution Planning

Before we begin execution, we need to know (1) if a filter is present, then we need to only execute those tests that match the filter and (2) if any Hooks include a .only annotation, we need to remove all TEST Hooks that do not.

Both of these operations should be performed while evaluating test files and constructing the Suites. This is challenging because we might be evaluating Suites across any number of different processes or machines in parallel. While it would be reasonable for a parent process to simply forward an existing filter to be applied, in the .only case, sibling processes will need to pass messages in order to prevent test executions that shouldn't begin.

Perhaps we could implement this as an event that bubbles up the Suite Tree during evaluation?
