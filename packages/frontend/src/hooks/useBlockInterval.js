import { useEffect, useRef } from "react";

const blockEvent = (provider, callback, delayBlock) => {
    let blockRunning = 0;

    const fn = (block) => {
        blockRunning += 1;
        console.log(block);
        if (blockRunning >= delayBlock) {
            callback && callback(block);
            blockRunning = 0;
        }
    };

    provider.on('block', fn);

    return fn;
}

const useBlockInterval = 
(
    callback,
    { provider, delayBlock = 1, leading = true }, 
    deps = []
) => {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick(e) {
            const { current } = savedCallback
            if (current) {
                current(e)
            }
        }

        if (delayBlock !== null && provider) {
            if (leading) tick(provider.blockNumber);
            const fn = blockEvent(provider, tick, delayBlock);
            return () => {
                provider.off('block', fn);
            };
        }
        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, delayBlock, leading, ...deps])
}

export default useBlockInterval;
