export const checkCookie = (cookieName) => {
    const name = cookieName + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return true;
        }
    }
    return false;
};