
# Smocha
Smokin' fast drop-in replacement for Mocha tests.

Tests should be fast.
Tests should be isolated.
Tests should be readable.
Tests should be consistent.

Tests should be executed in parallel across however many cores are available to
a given developer, whether these cores are local or remote should not require
any changes to the test code itself.

Nodejs presents a collection of primitives that make it possible for us to write
extremely fast, concurrent programs that can scale with compute capability.

For example, we can scan the file system for test files, and immediately begin
execution when the first file is encountered. We can fan out test execution
across any number of external processes based on user determined count or
by inferring the available CPU cores. Tests can be given a global clean room for
execution that is reset between each test method.

A variety of test types can be described using the same DSL provided by Mocha,
we should be able to simply declare different runners for different test tasks.

Smocha supports the following types of tests:

* Unit/Component
* Performance
* Fuzzing
* Integration

One of the teams that I have worked on, had over 5,500 unit & component tests
that took take about 2.5 minutes on a 2014 IMac
(Intel Core i7-4771 CPU @ 3.50GHz) to run.

After spreading these tests across the available cores, test run times dropped
to typically take 22 seconds.

## Contributing

- Clone the git repository and cd into it
- `make dev-install`
- `source setup-env.sh`
- `npm install`
- Run tests by running `make test` in the main directory (it was added to your path by setup-env.sh).

