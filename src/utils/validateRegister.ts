import { UserObjectFields } from "../resolvers/UserObjectFields";

export const validateRegister = (inputValue: UserObjectFields) => {
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
