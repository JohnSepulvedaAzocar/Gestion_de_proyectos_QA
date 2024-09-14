export const generarNumeroAleatorio = () => {
    return Math.floor(Math.random() * 900000) + 100000;
}

export const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
        const date = timestamp.toDate();
        return date.toLocaleDateString();
    }
    return "Fecha no disponible";
};

