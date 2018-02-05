export async function loadWorker() {
    return new Promise<Worker>(resolve => {
        const worker = new Worker('worker.shim.js');

        const onInitial = (e: MessageEvent) => {
            switch (e.data.cmd) {
                case "ready":
                    worker.removeEventListener('message', onInitial);
                    resolve(worker);
                    break;
            }
        }
        //Wait for initial worker communication setup
        worker.addEventListener('message', onInitial);
        worker.postMessage({ cmd: 'init' });
    });
}