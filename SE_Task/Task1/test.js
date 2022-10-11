function resolveAfter2Seconds() {
    console.log("starting slow promise");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("slow");
            console.log("slow promise is done");
        }, 2000);
    });
}

function resolveAfter1Second() {
    console.log("starting fast promise");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("fast");
            console.log("fast promise is done");
        }, 1000);
    });
}

async function sequentialStart() {
    console.log("==SEQUENTIAL START==");

    // 1. Execution gets here almost instantly
    ///const slow = await resolveAfter2Seconds();
    console.log(await resolveAfter2Seconds()); // 2. this runs 2 seconds after 1.

    ///const fast = await resolveAfter1Second();
    console.log(await resolveAfter1Second()); // 3. this runs 3 seconds after 1.
}

async function concurrentStart() {
    console.log("==CONCURRENT START with await==");
    const slow = resolveAfter2Seconds(); // starts timer immediately
    const fast = resolveAfter1Second(); // starts timer immediately

    // 1. Execution gets here almost instantly
    ///console.log(await slow); // 2. this runs 2 seconds after 1.
    ///console.log(await fast); // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}

sequentialStart();