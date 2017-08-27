

# Notes

## Hooks, Rules and Messaging (2017-08-24)

We have a composite tree structure that is being created in the form of Suites and Hooks.

A Hook is a relatively simple container for a label and a handler. Hooks provide an ```execute()``` method which wraps and call the provided handler, which may be implemented as a synchronous method, an async method that receives a node style callback, or it might return a Promise. The Hook implementation hides these details from callers. When ```execute()``` is called, if the underlying handler is synchronous, nothing is returned, otherwise a Promise is returned.

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

### Execution Planning: .only

Before we begin execution, we need to know (1) if a filter is present, then we need to only execute those tests that match the filter and (2) if any Hooks (Suite or Test) include a .only annotation, we need to remove all TEST Hooks (and their associated before/afters) that do not. Additionally, if a suite has all of it's tests filtered out, that Suite's before/after hooks should not fire.

In the case of filters, we know ahead of time and we can simply not add filtered tests to our data structure, but things get much more interesting with the .only annotation, especially when evaluating and running across multiple processes or machines.

In this case, we need to perform a traversal of the tree after evaluation and before execution and if one or more describe.only or it.only blocks are found, we need to then filter out all other tests. This is problematic as I would like to begin test execution as each file is encountered on disk so that large projects can run as quickly as possible.

Some considerations to mitigate this problem are as follows:

1. Commandline flag to disable immediate test execution: This would allow an author to switch into .only mode and get the desired behavior. Unfortunately, switching into the commandline feels somewhat cumbersome when driving the rhythm that goes with a test watcher.

2. Withold reporting until all test files have been evaluated: This approach would make the UI appear to do what is desired, but any runtime debug hooks would potentially fire for tests that are not apparently being run. This seems bad.

3. Remove support for .only and instead only support Commandline flag to filter down to a single test (or file) when desired: This would be a significant incompatibility with Mocha's interface and would break my own years-long development workflow.

4. Sort file processing by last edit timestamp: This would allow us to usually capture files that have been edited with the addition of a .only annotation and we could easily filter those tests that are declared in the same file and in subsequent files. One additional benefit here, is that test execution would become somewhat randomized and interacting tests could surface more readily. We might need to do some work to expose test ordering in order to make failures visible and reproducible. We will still need to provide messaging across processes in order to prevent sibling processes from continuing into execution. There is also a likely risk that sibling processes might execute some of their tests before the one with a .only is evaluated. Perhaps this could be mitigated by also adding a flag for core count, or that disables parallel execution?

### Execution Planning: Failures

When running in "watch" mode, anytime there are one or more test failures, the runner should automatically filter subsequent test runs to only include those failed tests, until they pass. Once all failures have passed, a second run should automatically trigger without the auto-filter applied.

This functionality implies that filters should be pluralized, not singular.

