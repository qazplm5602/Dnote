const { api } = require("../config.json");

exports.request = async function(uri, option = {}, accessToken)  {
    if (accessToken !== undefined) {
        if (option.headers === undefined)
            option.headers = {};

        Object.assign(option.headers, {
            Authorization: `Barer ${accessToken}`
        });
    }

    const response = await fetch(`${api}/${uri}`, option);
    let result;
    try {
        result = await response.clone().json();
    } catch {
        result = await response.text();
    }

    return { status: response.status, data: result };
}