const { apiPort: port } = require("../config.json");
const endpoint = `http://localhost:${port}/api/`;

module.exports = async function(url, option) {
    const response = await fetch(endpoint + url, option);
    
    
    let result;
    try {
        result = await response.json();
    } catch { // json 형식이 아닌경우
        result = await response.text(); // 이것도 안되면;;
    }
    
    return {
        status: response.status,
        data: result
    };
}