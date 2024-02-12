// Navbar items list
export const navItemsConstant = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        roles: ["user", "admin", "hr", "hradmin"],
        img: 'dashboard'
    },
    {
        path: 'new-ticket',
        name: 'New Ticket',
        roles: ["user", "admin", "hr", "hradmin"],
        img: "library_add"
    },
    {
        path: 'tickets',
        name: 'My Tickets',
        roles: ["user", "admin", "hr", "hradmin"],
        img: "library_books"
    },
    {
        path: 'inventory',
        name: 'Inventory',
        roles: ["admin", "hradmin"],
        img: "layers"
    },
    {
        path: 'employee-search',
        name: 'Employee Search',
        roles: ["admin", "user", 'hr', 'hradmin'],
        img: "people"
    },
    {
        path: 'service-request',
        name: 'Service Request',
        roles: ["admin", "hradmin"],
        img: "mail_outline"
    },
    {
        path: 'my-profile',
        name: 'Profile',
        roles: ["user", "admin", "hr", "hradmin"],
        img: "person"
    }
]