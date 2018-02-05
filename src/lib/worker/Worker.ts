export * from "./Worker-Loader";
export * from "./Worker-Start";

/* Example

    Main thread:
        const worker = await loadWorker();
   
        worker.addEventListener('message', (msg: MessageEvent) => {
            switch(msg.data.cmd) {
                case "pong":
                    console.log("PONG", msg.data.ts);
                    break;
            }
        });

        worker.postMessage({
            cmd: "ping",
            ts: performance.now()
        });

    Worker thread (ping/pong is builtin):
        StartWorker();
*/