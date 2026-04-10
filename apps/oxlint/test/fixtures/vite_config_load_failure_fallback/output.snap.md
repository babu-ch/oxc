# Exit code
0

# stdout
```
  ! eslint(no-debugger): `debugger` statement is not allowed
   ,-[<fixture>/files/test.js:1:1]
 1 | debugger;
   : ^^^^^^^^^
 2 | if (x == 1) {
   `----
  help: Remove the debugger statement

  ! eslint(eqeqeq): Expected === and instead saw ==
   ,-[<fixture>/files/test.js:2:7]
 1 | debugger;
 2 | if (x == 1) {
   :       ^^
 3 | }
   `----
  help: Prefer === operator

Found 2 warnings and 0 errors.
Finished in Xms on 2 files with 94 rules using X threads.
```

# stderr
```
```
