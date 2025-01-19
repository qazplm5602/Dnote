type reserveData = {
    userId: number,
    action: 'add' | 'remove' | 'update'
}

let reserveUsers: reserveData[] = [];


export function registerUser(id: number, action: reserveData['action']) {
    reserveUsers.push({ userId: id, action: action });
}

export function clear() {
    reserveUsers = [];
}

export function updateSitemap() {
    const currentUserIds = new Set<number>();

    console.log("reserveUsers", reserveUsers);
}