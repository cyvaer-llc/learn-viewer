# Storing user progress
Obviously, one thing that isn't easy to replicate is the storage and API of Learn. This makes it impossible to keep track of progress out of the box, and potentially expensive to build a solution that stores learner progress.

As a stop-gap, we could use local storage so that at least the progress is saved on the same computer in the same browser. This would be a great offline-mode solution, even if we do eventually decide to allow users to log in and save data later.

Probably the best way to store lesson progress is with IndexedDB, which appears to have some good react hooks available. See [react-indexed-db](https://www.npmjs.com/package/react-indexed-db).