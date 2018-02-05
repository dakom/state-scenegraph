//Loaded by worker bundle
export const StartWorker = () => {
    self.addEventListener('message', (msg: MessageEvent) => {
        switch(msg.data.cmd) {
            case "init":
                console.log("%cDrift - Worker Ready", 'color: green; font-weight: bold;');

                (self as any).postMessage({cmd: "ready"});
                break;

            case "ping":
                (self as any).postMessage({
                    cmd: "pong",
                    ts: msg.data.ts,
                });

                break;
        }
    });
}