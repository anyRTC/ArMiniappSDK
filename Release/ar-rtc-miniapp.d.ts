
declare class Client extends EventEmitter implements IClient {
    uid: string;
    role: string;
    channelName: string;
    remoteUser: RemoteUser[];
    enableVideo: boolean;
    enableAudio: boolean;
    _ws: MediaServer | undefined;
    _state: string;
    _appId: string;
    _sessionId: string;
    _joinInfo: {
        [key: string]: any;
    };
    _useWss: boolean;
    _online: boolean;
    _hasPublished: boolean;
    constructor();
    destroy(onSuccess: () => void, onFailure: (err: {
        code: number;
        reason: string;
    }) => void): void;
    init(appId: string, onSuccess: () => void, onFailure: (err: {
        code: number;
        reason: string;
    }) => void): void;
    join(token: string | undefined, channel: string, uid: string | undefined, onSuccess: (uid: string) => void, onFailure: (err: {
        code: number;
        reason: string;
    }) => void): void;
    leave(onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    mute(uid: string, target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    muteLocal(target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    publish(onSuccess: (url: string) => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    rejoin(token: string, channel: string, uid: string, uids: number, onSuccess: (uid: string) => void, onFailure: (err: {
        code: number;
        reason: string;
    }) => void): void;
    setRole(role: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    subscribe(uid: string, onSuccess: (url: string) => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    unmute(uid: string, target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    unmuteLocal(target: string, onSuccess?: () => void, onFailure?: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    unpublish(onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    unsubscribe(uid: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    setParameters(options: any): Promise<void>;
    private _createMediaServerIntance;
    private _authGateWay;
    private _connectMediaServer;
}

export declare const client: typeof Client;

declare type ConnectionState = "DISCONNECTED" | "CONNECTING" | "RECONNECTING" | "CONNECTED" | "DISCONNECTING";

declare const _default: {
    client: typeof Client;
};
export default _default;

declare class EventEmitter {
    private _events;
    private addListener;
    constructor();
    getListeners(event: string): unknown[];
    on(event: string, callback: Function): void;
    once(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    removeAllListeners(event?: string): void;
    emit(event: string, ...args: any[]): void;
    private _indexOfListener;
}

declare interface IClient {
    destroy(onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    init(appId: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    join(channelKey: string | undefined, channel: string, uid: string | undefined, onSuccess: (uid: string) => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    leave(onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    mute(uid: string, target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    muteLocal(target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    off(event: string, callback: Function): void;
    on(event: "error", callback: (evt: {
        code: number;
        reason: string;
    }) => void): void;
    on(event: "stream-added", callback: (evt: {
        uid: string;
    }) => void): void;
    on(event: "stream-removed", callback: (evt: {
        uid: string;
    }) => void): void;
    on(event: "update-url", callback: (evt: {
        uid: string;
        url: string;
    }) => void): void;
    on(event: "video-rotation", callback: (evt: {
        rotation: number;
        uid: string;
    }) => void): void;
    on(event: "mute-audio", callback: (evt: {
        uid: string;
    }) => void): void;
    on(event: "channel-media-relay-event", callback: (evt: {
        code: number;
    }) => void): void;
    on(event: "channel-media-relay-state", callback: (evt: {
        code: number;
        state: number;
    }) => void): void;
    publish(onSuccess: (url: string) => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    setRole(role: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    subscribe(uid: string, onSuccess: (url: string) => void, onFailure: (err: any) => void): void;
    unmute(uid: string, target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    unmuteLocal(target: string, onSuccess: () => void, onFailure: (err?: {
        code: number;
        reason: string;
    }) => void): void;
    unpublish(onSuccess: () => void, onFailure: (err: any) => void): void;
    unsubscribe(uid: string, onSuccess: () => void, onFailure: (err: any) => void): void;
}

declare class MediaServer extends EventEmitter {
    private _appId;
    private _serverIsWss;
    private _serverUrl;
    private _serverPort;
    _revState: ConnectionState;
    private _curState;
    private _userId;
    private _keepAiveInterval;
    private _keepAliveIntervalTime;
    private _handleOnline;
    private _connectTimeout;
    private _keepAliveTimeout;
    signal: any;
    handleMediaServerEvents: Function;
    constructor(config?: {
        [key: string]: any;
    });
    setAppInfo(appInfo: {
        [key: string]: any;
    }): void;
    configServer(isWss: boolean, url: string, port: number): void;
    connectCTS(): Promise<unknown>;
    doKeepAlive(): void;
    doJoin(extendContent: any): Promise<string>;
    doLeave(): Promise<void>;
    doPublish(): Promise<{
        [key: string]: any;
    }>;
    doUnPublish(): Promise<unknown>;
    doSubscribe(UserId: string, ChanId: string): Promise<string>;
    doUnSubscribe(UserId: string, ChanId: string): Promise<unknown>;
    setClientRole(role: string): Promise<void>;
    doMuteRemoteStream(UserId: string, MuteAudio: boolean, MuteVideo: boolean): void;
    doMuteLocalStream(MuteAudio: boolean, MuteVideo: boolean): void;
    disconnectCTS(reason?: string): void;
    clearEventEmitter(): void;
    private _setConnectTimeout;
    private _startKeepAlive;
    private _stopKeepAlive;
    private _clearConnectTimeout;
    _handleKeepAlive(): void;
    _removeHandleKeepAlive(): void;
    _sendMessage(msg: object): boolean;
    _emitGateWayEvent(type: string, data: any): void;
    _emitConnectionState(curState: any, reason?: string): void;
}

declare interface RemoteUser {
    uid: string;
    hasSub: boolean;
    hasVideo: boolean;
    hasAudio: boolean;
    muteVideo: boolean;
    muteAudio: boolean;
}

export { }
