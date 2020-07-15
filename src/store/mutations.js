import * as type from "./mutation-types";

const mutations = {
    [type.SET_IP] (state, ip) {
        state.ip = ip;
        sessionStorage.setItem("ip", ip);
    }
};

export default mutations;
