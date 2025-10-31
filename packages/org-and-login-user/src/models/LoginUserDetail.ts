export type LoginUserDetail = {
  id: string;
  username: string;
  email: string;
  name: string;
  profileName: string;
  roleName: string | null;
  employeeNumber: string | null;
};
export const LoginUserDetail = {
  default: (): LoginUserDetail => ({
    id: '',
    username: '',
    email: '',
    name: '',
    profileName: '',
    roleName: null,
    employeeNumber: null,
  }),
};
