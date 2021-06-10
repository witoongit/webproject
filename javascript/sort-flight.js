async function sort(value) {
    let data = await fetch('/flight/sort/' + value);
    return await data.json();
}