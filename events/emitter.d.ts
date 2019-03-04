import { IDisposable } from '../lifecycle/disposables.js';

export type IEvent<T> = (callback : (data : T) => void, thisArg? : any, subs? : IDisposable[]) => IDisposable;
export class EventEmitter<T = void> {
    event : IEvent<T>;
    fire(data : T) : void;
    dispose() : void;
}

export function subscribe(target : any, name : string, callback : Function, thisArg? : any, subs? : any[]) : IDisposable;
export function subscribeDOM(target : HTMLElement|SVGElement, name : string, callback : Function, thisArg? : any, subs? : any[]) : IDisposable;
