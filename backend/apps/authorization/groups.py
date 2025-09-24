ADMINISTRATOR_GROUP = "ADMINISTRATOR"

GROUP_MATRIX = {
    ADMINISTRATOR_GROUP: {
        "description": "Full access.",
        "permissions": ["*"],
    },
    "STANDARD_GROUP": {
        "description": "Access to the general functionality.",
        "permissions": ["view_users"],
    },
    "USER_ADMINISTRATOR": {
        "description": "Manage all user functionalities.",
        "permissions": ["view_users", "edit_users"],
    }
}