# Perf test of the EventEmitter module

## Named method

This method uses the event emitter from this module. It creates an `event` property that can be called to listen to events

## String method

This method is the traditional Node.js style EventEmitter using strings to compare events being emitted.

## Memory

This test creates 1000 event emitters using this module's class and a 1000 event emitter using a traditional string based event names.

After running the two pages in different tabs, using the devTools in the memory pane, take a heap snapshot and look for `emitter` to see the memory results.

### Results

The string based method will keep a shallow size of 32k at all times but its retained size (Size that would be freed when garbage collected), is higer than with the named method as it needs to store the string.

## CPU

After timing the creation of all these emitters, the named method averages 4ms for 1000 items, the string method 18ms / 1000

## JS size

Once compressed with mangling, every event name from the named method has to be kept as is while the named method can have its symbols mangled.

## Table

|   | Named  | String  |
|---|---|---|---|---|
| Memory (Shallow)  | 48k  | 32k  |
| Memory (Retained)  | 432k  | 584k  |
| CPU  | 4ms  |  18ms |
