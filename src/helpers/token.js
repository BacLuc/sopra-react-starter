import Cookie from "js-cookie";

export default function useToken() {
    const cookie = Cookie.get('jwt');
    const parts = cookie.split('.');
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
}
