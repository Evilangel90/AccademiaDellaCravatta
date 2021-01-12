const cookieStorage = {
    getItem: (item) => {
        const cookies = document.cookie
            .split(';')
            .map(cookie => cookie.split('='))
            .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {});
        return cookies[item];
    },
    setItem: (item, value) => {
        document.cookie = `${item}=${value};`
    }
}

const tipoStorage = cookieStorage;
const consensoNomeProprieta = 'AccademiaCravatta_consenso';
const shouldShowPopup = () => !tipoStorage.getItem(consensoNomeProprieta);
const saveToStorage = () => tipoStorage.setItem(consensoNomeProprieta, true);

window.onload = () => {

    const acceptFn = event => {
        saveToStorage(tipoStorage);
        popupConsenso.classList.add('nascosto');
    }
    const popupConsenso = document.getElementById('popupConsenso');
    const acceptBtn = document.getElementById('btnAccetta');
    acceptBtn.addEventListener('click', acceptFn);

    if (shouldShowPopup(tipoStorage)) {
        setTimeout(() => {
            popupConsenso.classList.remove('nascosto');
        }, 2000);
    }

};