# Note
Because this folder is under .git for ***myTrial*** project, ```cargo``` command doesn't make .git and .gitignore.
To make .gitignore file, run cargo with --vcs=git

```cargo new rust_examples --vcs=git```

Then remove .git filder as follow:

```rm -rf .git```


