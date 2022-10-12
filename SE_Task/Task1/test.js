async function main() {
    const get = async (s) => s;

    const arr = await Promise.all([(async () => "a")(), get("b"), get("c")]);

    console.log(arr);
}

main();