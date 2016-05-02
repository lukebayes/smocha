
# Smocha
Smokin' fast (and Safe) drop-in replacement for Mocha tests.

Tests should be fast.
Tests should be isolated.
Tests should be readable.
Tests should be consistent.

Tests should be executed in parallel across however many cores are available to
a given developer, whether these cores are local or remote should not require
any changes to the test code itself.

Nodejs presents a collection of primitives that make it possible for us to write
extremely fast, concurrent programs that can scale with machine capabilities and
avoid many of the limitations that other languages suffer from.

For example, we can scan the file system for test files, and immediately begin
execution when the first file is encountered. We can fan out test execution
across any number of external processes based on user determined count or
by inferring the available CPU cores. Tests can be given a global clean room for
execution that is reset between each test method.

A variety of test types can be described using the same DSL provided by Mocha,
we should be able to simply declare different runners for different test tasks.

Smocha will soon support the following types of tests:

* Unit/Component
* Performance
* Fuzzing
* Integration

Our team has over 5,500 unit/component tests that currently take about 2.5
minutes on a 2014 IMac (Intel Core i7-4771 CPU @ 3.50GHz). After spreading these
tests across the available cores, test run times dropped to about 22 seconds.


## Contributing

1) Get Node v5.10+ into your system path.
2) `npm install`
3) Run tests with `mocha test/**/*_test.js --reporter dot`
4) Run linter with, `eslint .`

