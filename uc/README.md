# uController

This set of classes help separating the business logic from the view/rendering. It follows loosely the principle of MVC.

## Philosophy

A View should only take care of the layout/rendering and some minimal UI logic (loading states, hide/show). It's properties and state should have names that are meaningful internally.

A Controller should only take care of its state and how it mutates based on a known business logic. The controller updates the view accordingly to its internal state.

## Usage

See the files under `demo`
