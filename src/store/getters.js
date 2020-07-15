// getters

const getters = {
    ip: state => {
        let ip = sessionStorage.getItem("ip");
        if (!ip) {
            return ip;
        } else {
            return state.ip;
        }
    }
};
export default getters;
