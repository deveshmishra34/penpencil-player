import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {debounceTime, startWith} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NetworkDetectionService implements OnDestroy {

    private offlineSubscription: Subscription;
    private onlineSubscription: Subscription;
    private currentState: ConnectionState = {
        hasInternetAccess: false,
        hasNetworkConnection: window.navigator.onLine
    };
    private stateChangeEventEmitter = new EventEmitter<ConnectionState>();

    constructor() {
        this.checkNetworkState();
    }

    ngOnDestroy(): void {
        try {
            this.offlineSubscription.unsubscribe();
            this.onlineSubscription.unsubscribe();
        } catch (e) {
        }
    }

    private checkNetworkState() {
        this.onlineSubscription = fromEvent(window, 'online').subscribe(() => {
            this.currentState.hasNetworkConnection = true;
            this.currentState.hasInternetAccess = true;
            // console.log('online: ', this.currentState);
            this.emitEvent();
        });

        this.offlineSubscription = fromEvent(window, 'offline').subscribe(() => {
            this.currentState.hasNetworkConnection = false;
            this.currentState.hasInternetAccess = false;
            // console.log('offline: ', this.currentState);
            this.emitEvent();
        });
    }

    private emitEvent() {
        this.stateChangeEventEmitter.emit(this.currentState);
    }

    /**
     * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
     * function will not report current status of the connections when initially subscribed.
     * @param reportCurrentState Report current state when initial subscription. Default is "true"
     */
    monitor(reportCurrentState = true): Observable<ConnectionState> {
        return reportCurrentState ?
            this.stateChangeEventEmitter.pipe(
                debounceTime(300),
                startWith(this.currentState),
            )
            :
            this.stateChangeEventEmitter.pipe(
                debounceTime(300)
            );
    }
}

/**
 * Instance of this interface is used to report current connection status.
 */
export interface ConnectionState {
    /**
     * "True" if browser has network connection. Determined by Window objects "online" / "offline" events.
     */
    hasNetworkConnection: boolean;
    /**
     * "True" if browser has Internet access. Determined by heartbeat system which periodically makes request to heartbeat Url.
     */
    hasInternetAccess: boolean;
}

