let reserveAddUser: number[] = [];
let reserveRemoveUser: number[] = [];

export function registerAddUser(id: number) {
    reserveAddUser.push(id);
}

export function registerRemoveUser(id: number) {
    reserveRemoveUser.push(id);
}

export function clear() {
    reserveAddUser = [];
    reserveRemoveUser = [];
}

export function updateSitemap() {
    console.log("reserveAddUser", reserveAddUser);
    console.log("reserveRemoveUser", reserveRemoveUser);
}