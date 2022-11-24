"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (inputValue) => {
    if (inputValue.username.length <= 2) {
        return [
            {
                field: "username",
                message: "username length must be greater than 2",
            },
        ];
    }
    if (!inputValue.email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (inputValue.username.includes("@")) {
        return [
            {
                field: "username",
                message: "invalid username",
            },
        ];
    }
    if (inputValue.password.length <= 2) {
        return [
            {
                field: "password",
                message: "password length must be greater than 2",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map